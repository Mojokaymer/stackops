import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase';

export async function GET() {
  try {
    const sb = supabaseServer();
    
    // Fetch intents and audit logs from Supabase
    const { data: intents } = await sb
      .from("intents")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);
      
    const { data: logs } = await sb
      .from("audit_logs")
      .select("*")
      .order("ts", { ascending: false })
      .limit(20);

    // Combine and format for display
    const activityLogs = [
      ...(intents || []).map((intent: any) => ({
        id: intent.id.slice(0, 8),
        type: intent.type || "Intent",
        status: intent.status,
        timestamp: new Date(intent.created_at).toLocaleString(),
        details: `Intent: ${intent.type}`,
      })),
      ...(logs || []).map((log: any) => ({
        id: log.id.slice(0, 8),
        type: log.tool_name || "Operation",
        status: log.status || "pending",
        timestamp: new Date(log.ts).toLocaleString(),
        details: log.step || "Audit log entry",
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ logs: activityLogs });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity logs' }, { status: 500 });
  }
}

