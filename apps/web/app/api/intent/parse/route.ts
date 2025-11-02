import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const text: string = body.text || "";
  const tenantId: string = body.tenantId || null;

  if (!tenantId || !text) {
    return NextResponse.json({ error: "Missing tenantId or text" }, { status: 400 });
  }

  try {
    const workerUrl = process.env.WORKER_URL || "http://localhost:3100";
    const response = await fetch(`${workerUrl}/agent/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId, text }),
    });

    const data = await response.json();

    if (data.status === "clarify") {
      return NextResponse.json({ clarify: data.question });
    }

    // data contains { intentId, status, plan }
    return NextResponse.json({ 
      intent: { 
        id: data.intentId, 
        plan_json: data.plan,
        status: data.status 
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to process request" }, { status: 500 });
  }
}

