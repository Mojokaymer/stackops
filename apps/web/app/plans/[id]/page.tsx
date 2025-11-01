import { supabaseServer } from "@/lib/supabase";

export default async function PlanPage({ params }: { params: { id: string }}) {
  const sb = supabaseServer();
  const { data: intent } = await sb.from("intents").select("*").eq("id", params.id).single();

  return (
    <main className="p-8 space-y-4">
      <h2 className="text-xl font-semibold">Plan Preview</h2>
      <pre className="bg-gray-50 p-4 rounded border overflow-auto">{JSON.stringify(intent?.plan_json || intent?.input_json, null, 2)}</pre>
      <form action="/api/intent/approve" method="post">
        <input type="hidden" name="intentId" value={params.id}/>
        <button className="px-4 py-2 rounded bg-green-600 text-white">Approve & Execute</button>
      </form>
    </main>
  );
}

