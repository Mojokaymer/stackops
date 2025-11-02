import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const intentId = (form.get("intentId") as string) || "";

  if (!intentId) {
    return NextResponse.json({ error: "Missing intentId" }, { status: 400 });
  }

  try {
    const workerUrl = process.env.WORKER_URL || "http://localhost:3100";
    const response = await fetch(`${workerUrl}/agent/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ intentId }),
    });

    const result = await response.json();

    if (result.status === "applied") {
      return NextResponse.redirect(new URL(`/plans/${intentId}`, req.url));
    } else {
      return NextResponse.json({ 
        error: result.error || "Execution failed" 
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ 
      error: error.message || "Failed to approve intent" 
    }, { status: 500 });
  }
}

