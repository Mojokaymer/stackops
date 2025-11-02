import Link from "next/link";
import AppHeader from "@/components/app-header";
import { supabaseServer } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function Activity() {
  const sb = supabaseServer();
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-accent/5 to-background p-6">
      <AppHeader />

      <div className="mb-8 mt-6">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
          Activity & Audit Logs
        </h1>
        <p className="text-muted-foreground">
          Track all intents and system activities in real-time
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Intents Section */}
        <section className="space-y-4">
          <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle className="flex items-center justify-between text-xl">
                <span className="flex items-center gap-2">
                  <span>📋</span>
                  <span>Recent Intents</span>
                </span>
                <Badge variant="secondary" className="text-sm">
                  {intents?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {intents && intents.length > 0 ? (
                intents.map((intent: any) => (
                  <Card key={intent.id} className="shadow-md hover:shadow-lg transition-all duration-300 border-border/50 bg-background/50">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1.5 flex-1">
                          <div className="font-semibold text-sm">{intent.type}</div>
                          <code className="text-xs text-muted-foreground/80 block truncate bg-muted/30 px-2 py-1 rounded">
                            {intent.id}
                          </code>
                        </div>
                        <Badge variant={getStatusVariant(intent.status)} className="shadow-sm">
                          {intent.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2 pt-1">
                        <Button asChild variant="outline" size="sm" className="flex-1 border-border/50 hover:bg-accent/10">
                          <Link href={`/plans/${intent.id}`}>View Plan →</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 space-y-3">
                  <div className="text-4xl mb-2">📭</div>
                  <div className="text-muted-foreground text-sm">
                    No intents yet. Create one in the Agent Console!
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link href="/agent">Go to Agent Console →</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Audit Logs Section */}
        <section className="space-y-4">
          <Card className="shadow-lg border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-500/10 to-transparent">
              <CardTitle className="flex items-center justify-between text-xl">
                <span className="flex items-center gap-2">
                  <span>📜</span>
                  <span>Audit Logs</span>
                </span>
                <Badge variant="secondary" className="text-sm">
                  {logs?.length || 0}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-6">
              {logs && logs.length > 0 ? (
                logs.map((log: any) => (
                  <Card key={log.id} className="shadow-md hover:shadow-lg transition-all duration-300 border-border/50 bg-background/50">
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1.5 flex-1">
                          <div className="font-semibold text-sm">
                            {log.tool_name || "Unknown Tool"}
                          </div>
                          {log.step && (
                            <div className="text-xs text-muted-foreground/80 bg-muted/30 px-2 py-1 rounded">
                              {log.step}
                            </div>
                          )}
                        </div>
                        <Badge variant={getStatusVariant(log.status)} className="shadow-sm">
                          {log.status || "pending"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground/60 pt-1">
                        🕒 {new Date(log.ts).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12 space-y-3">
                  <div className="text-4xl mb-2">📊</div>
                  <div className="text-muted-foreground text-sm">
                    No audit logs yet.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
