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
    <main className="p-6">
      <AppHeader />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Intents Section */}
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>📋 Recent Intents</span>
                <Badge variant="secondary">{intents?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {intents && intents.length > 0 ? (
                intents.map((intent: any) => (
                  <Card key={intent.id} className="shadow-sm">
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1">
                          <div className="font-medium text-sm">{intent.type}</div>
                          <code className="text-xs text-muted-foreground block truncate">
                            {intent.id}
                          </code>
                        </div>
                        <Badge variant={getStatusVariant(intent.status)}>
                          {intent.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <Link href={`/plans/${intent.id}`}>View Plan</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No intents yet. Create one in the Agent Console!
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Audit Logs Section */}
        <section className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>📜 Audit Logs</span>
                <Badge variant="secondary">{logs?.length || 0}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {logs && logs.length > 0 ? (
                logs.map((log: any) => (
                  <Card key={log.id} className="shadow-sm">
                    <CardContent className="pt-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1">
                          <div className="font-medium text-sm">
                            {log.tool_name || "Unknown Tool"}
                          </div>
                          {log.step && (
                            <div className="text-xs text-muted-foreground">{log.step}</div>
                          )}
                        </div>
                        <Badge variant={getStatusVariant(log.status)}>
                          {log.status || "pending"}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(log.ts).toLocaleString()}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No audit logs yet.
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}
