"use client";
import { useState } from "react";

export default function AgentPage() {
  const [text, setText] = useState("");
  const [resp, setResp] = useState<any>(null);

  const submit = async () => {
    const r = await fetch("/api/intent/parse", {
      method: "POST",
      body: JSON.stringify({ tenantId: "contoso.onmicrosoft.com", text }),
    });
    setResp(await r.json());
  };

  return (
    <main className="p-8 space-y-4">
      <h2 className="text-xl font-semibold">Agent Console</h2>
      <textarea className="w-full border p-3 h-40" value={text} onChange={e=>setText(e.target.value)}
        placeholder={`Example: Create user Alice Dupont, alice@contoso.com, Sales, E3 license, add to "Sales-EU"`} />
      <button className="px-4 py-2 rounded bg-black text-white" onClick={submit}>Create intent</button>

      {resp?.intent && (
        <div className="border p-4 rounded">
          <div className="font-medium">Intent created</div>
          <div className="text-sm text-gray-600">id: {resp.intent.id}</div>
          <a className="underline text-blue-600" href={`/plans/${resp.intent.id}`}>Open plan</a>
        </div>
      )}
    </main>
  );
}

