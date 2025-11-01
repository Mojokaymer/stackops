import { supabaseServer } from "@/lib/supabase";

export default async function Activity() {
  const sb = supabaseServer();
  const { data: intents } = await sb.from("intents").select("*").order("created_at", { ascending: false }).limit(20);
  const { data: logs } = await sb.from("audit_logs").select("*").order("ts", { ascending: false }).limit(20);

  return (
    <main className="p-8 grid md:grid-cols-2 gap-6">
      <section>
        <h2 className="text-xl font-semibold mb-2">Intents</h2>
        <div className="space-y-2">
          {(intents||[]).map((i:any)=>(
            <div key={i.id} className="border rounded p-3">
              <div className="font-medium">{i.type} — {i.status}</div>
              <div className="text-xs text-gray-600">{i.id}</div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-2">Audit logs</h2>
        <div className="space-y-2">
          {(logs||[]).map((l:any)=>(
            <div key={l.id} className="border rounded p-3">
              <div className="font-medium">{l.tool_name} — {l.status}</div>
              <div className="text-xs text-gray-600">{l.ts}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

