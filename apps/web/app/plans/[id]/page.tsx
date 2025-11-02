import Link from "next/link";
import AppHeader from "@/components/app-header";
import { supabaseServer } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function PlanPage({ params }: { params: { id: string } }) {
  const sb = supabaseServer();
  const { data: intent } = await sb
    .from("intents")
    .select("*")
    .eq("id", params.id)
    .single();

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "draft":
        return "secondary";
      case "planned":
        return "default";
      case "approved":
        return "default";
      case "applied":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  if (!intent) {
    return (
      <main className="p-6">
        <AppHeader />
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Intent not found</p>
            <Button asChild variant="outline" className="mt-4">
              <Link href="/activity">Back to Activity</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="p-6">
      <AppHeader />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Intent Overview Card */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-2xl">Plan Preview</CardTitle>
                <div className="text-sm text-muted-foreground">
                  Review and approve the execution plan
                </div>
              </div>
              <Badge variant={getStatusVariant(intent.status)} className="text-sm">
                {intent.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex gap-2">
                <span className="text-sm font-medium text-muted-foreground w-24">Type:</span>
                <Badge variant="outline">{intent.type}</Badge>
              </div>
              <div className="flex gap-2">
                <span className="text-sm font-medium text-muted-foreground w-24">Intent ID:</span>
                <code className="text-xs bg-muted px-2 py-1 rounded">{intent.id}</code>
              </div>
              <div className="flex gap-2">
                <span className="text-sm font-medium text-muted-foreground w-24">Created:</span>
                <span className="text-sm">{new Date(intent.created_at).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input JSON Card */}
        {intent.input_json && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📝 Original Input</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-[200px]">
                {JSON.stringify(intent.input_json, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Execution Plan Card */}
        {intent.plan_json && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔧 Execution Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-xs overflow-auto max-h-[400px] font-mono">
                {JSON.stringify(intent.plan_json, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              {intent.status === "planned" && (
                <form action="/api/intent/approve" method="post" className="flex-1">
                  <input type="hidden" name="intentId" value={params.id} />
                  <Button type="submit" className="w-full" size="lg">
                    ✓ Approve & Execute
                  </Button>
                </form>
              )}
              <Button asChild variant="outline" size="lg" className="flex-1">
                <Link href="/activity">Back to Activity</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
