export default function Page() {
  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-semibold">StackOps Agent</h1>
      <div className="space-x-3">
        <a className="px-4 py-2 rounded bg-black text-white" href="/agent">Open Agent Console</a>
        <a className="px-4 py-2 rounded border" href="/activity">Activity</a>
      </div>
    </main>
  );
}
