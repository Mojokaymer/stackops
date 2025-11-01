import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const text: string = body.text || "";
  const tenantId: string = body.tenantId || null;

  const email = (text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [])[0] || "user@example.com";

  const plan = {
    steps: [
      {
        tool: "graph.users.create",
        input: {
          displayName: "Alice Dupont",
          userPrincipalName: email,
          mailNickname: email.split("@")[0],
          jobTitle: "Sales Representative",
          department: "Sales",
          usageLocation: "FR",
          passwordProfile: {
            password: "Temp!P@ss-1234",
            forceChangePasswordNextSignIn: true
          }
        }
      },
      {
        tool: "graph.groups.addMember",
        input: { group: "Sales-EU", userPrincipalName: email }
      },
      {
        tool: "graph.licenses.assign",
        input: { userPrincipalName: email, skus: ["M365_E3"] }
      }
    ]
  };

  const sb = supabaseServer();
  const { data, error } = await sb.from("intents").insert({
    tenant_id: tenantId, type: "createUser", input_json: { text }, plan_json: plan, status: "planned"
  }).select().single();

  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ intent: data });
}

