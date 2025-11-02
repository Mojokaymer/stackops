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
      <main className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background p-6">
        <AppHeader />
        <Card className="max-w-2xl mx-auto shadow-lg border-border/50 bg-card/80 backdrop-blur-sm mt-20">
          <CardContent className="pt-8 pb-8 text-center space-y-4">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-muted-foreground text-lg">Intent not found</p>
            <Button asChild variant="outline" className="mt-6 border-border/50 hover:bg-accent/10">
              <Link href="/activity">← Back to Activity</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background p-6">
      <AppHeader />

      <div className="max-w-4xl mx-auto space-y-6 mt-6">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Execution Plan
          </h1>
          <p className="text-muted-foreground">
            Review the detailed plan before approving execution
          </p>
        </div>

        {/* Intent Overview Card */}
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span>📋</span>
                  <span>Plan Overview</span>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  Review and approve the execution plan
                </div>
              </div>
              <Badge variant={getStatusVariant(intent.status)} className="text-sm shadow-sm px-3 py-1">
                {intent.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid gap-4">
              <div className="flex gap-3 items-start">
                <span className="text-sm font-medium text-muted-foreground w-28">Type:</span>
                <Badge variant="outline" className="border-border/50">
                  {intent.type}
                </Badge>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-sm font-medium text-muted-foreground w-28">Intent ID:</span>
                <code className="text-xs bg-muted/50 px-3 py-1.5 rounded border border-border/50 font-mono">
                  {intent.id}
                </code>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-sm font-medium text-muted-foreground w-28">Created:</span>
                <span className="text-sm">
                  🕒 {new Date(intent.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input JSON Card */}
        {intent.input_json && (
          <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>📝</span>
                <span>Original Input</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <pre className="bg-background/50 border border-border/50 p-4 rounded-lg text-xs overflow-auto max-h-[200px] font-mono">
                {JSON.stringify(intent.input_json, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Execution Plan Card */}
        {intent.plan_json && (
          <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>🔧</span>
                <span>Execution Plan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <pre className="bg-background/50 border border-border/50 p-4 rounded-lg text-xs overflow-auto max-h-[400px] font-mono">
                {JSON.stringify(intent.plan_json, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="pt-6 pb-6">
            <div className="flex gap-4">
              {intent.status === "planned" && (
                <form action="/api/intent/approve" method="post" className="flex-1">
                  <input type="hidden" name="intentId" value={params.id} />
                  <Button type="submit" className="w-full shadow-md hover:shadow-lg transition-all" size="lg">
                    <span className="mr-2">✓</span>
                    Approve & Execute
                  </Button>
                </form>
              )}
              <Button asChild variant="outline" size="lg" className="flex-1 border-border/50 hover:bg-accent/10">
                <Link href="/activity">
                  <span className="mr-2">←</span>
                  Back to Activity
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
