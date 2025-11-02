import fs from "node:fs";
import yaml from "yaml";
import { Plan } from "../schemas/plan.js";

type Guardrails = { 
  toolsAllowed?: string[]; 
  limits?: { maxUsersPerBatch?: number }; 
  protectedPrincipals?: string[] 
};

let cachedGuardrails: Guardrails | null = null;

function load(): Guardrails {
  if (cachedGuardrails) return cachedGuardrails;
  
  const path = process.env.GUARDRAILS_PATH || "./guardrails.yaml";
  const content = fs.readFileSync(path, "utf-8");
  cachedGuardrails = yaml.parse(content);
  return cachedGuardrails!;
}

export function checkPlanAllowed(plan: Plan) {
  const guardrails = load();
  
  // Check if all tools are allowed
  if (guardrails.toolsAllowed?.length) {
    for (const step of plan.steps) {
      if (!guardrails.toolsAllowed.includes(step.tool)) {
        throw new Error(`Tool not allowed: ${step.tool}`);
      }
    }
  }
  
  // Check batch limits for user creation
  const userCreations = plan.steps.filter(s => s.tool === "graph.users.create").length;
  const maxAllowed = guardrails.limits?.maxUsersPerBatch ?? 25;
  if (userCreations > maxAllowed) {
    throw new Error(`Too many user creations: ${userCreations} > ${maxAllowed}`);
  }
  
  // Check for protected principals
  if (guardrails.protectedPrincipals?.length) {
    for (const step of plan.steps) {
      const upn = step.input.userPrincipalName as string | undefined;
      if (upn && guardrails.protectedPrincipals.includes(upn)) {
        throw new Error(`Cannot perform operations on protected principal: ${upn}`);
      }
    }
  }
}

