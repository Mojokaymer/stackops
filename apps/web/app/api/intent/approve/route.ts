import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const intentId = (form.get("intentId") as string) || "";

  if (!intentId) {
    return NextResponse.json({ error: "Missing intentId" }, { status: 400 });
  }

  const sb = supabaseServer();
  
  // Update intent status to approved
  const { error } = await sb
    .from("intents")
    .update({ status: "approved" })
    .eq("id", intentId);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  // TODO: Trigger worker to execute the plan
  // This will be handled by the Python worker listening to database changes

  return NextResponse.redirect(new URL(`/plans/${intentId}`, req.url));
}

