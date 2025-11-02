import { z } from "zod";
import { PlanSchema, Plan } from "../schemas/plan.js";
import { llmJson } from "./llm.js";

const SYSTEM = `You are a Microsoft tenant ops planner.
Return ONLY JSON matching:
{ "steps": [ { "tool": "<allowed>", "input": { ... } } ] }

Allowed tools:
- graph.users.create: displayName, userPrincipalName, mailNickname, department, usageLocation, passwordProfile.password, passwordProfile.forceChangePasswordNextSignIn
- graph.groups.addMember: group, userPrincipalName
- graph.licenses.assign: userPrincipalName, skus[]
- graph.users.disable: userPrincipalName

If essential data is missing, ask ONE clarifying question:
{ "clarify": "your concise question" }

No prose.`.trim();

export async function planFromText(tenantId: string, text: string) {
  const user = `Tenant: ${tenantId}\nTask: ${text}\nOutput: JSON only.`;
  const raw = await llmJson({ system: SYSTEM, user });
  
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.clarify) {
      return { needsClarification: true, clarifyingQuestion: parsed.clarify };
    }
  } catch {}
  
  try {
    const plan = PlanSchema.parse(JSON.parse(raw));
    return { needsClarification: false, plan };
  } catch (e: any) {
    const msg = (e as z.ZodError).errors?.map(er => `${er.path.join(".")}: ${er.message}`).join("; ");
    const fixedRaw = await llmJson({ 
      system: SYSTEM, 
      user: `${user}\nYour last JSON was invalid: ${msg}\nReturn a corrected JSON plan only.` 
    });
    const plan = PlanSchema.parse(JSON.parse(fixedRaw));
    return { needsClarification: false, plan };
  }
}

