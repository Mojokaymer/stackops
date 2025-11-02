"use client";

import { useState } from "react";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function AgentPage() {
  const [text, setText] = useState("");
  const [resp, setResp] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async () => {
    setIsLoading(true);
    try {
      const r = await fetch("/api/intent/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tenantId: "contoso.onmicrosoft.com", text }),
      });
      const data = await r.json();
      setResp(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-6">
      <AppHeader />
      
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🤖 Agent Console
              <Badge variant="secondary">Natural Language</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`Example: Create user Alice Dupont, alice@contoso.com, Sales, E3 license, add to "Sales-EU"`}
              className="min-h-[150px] font-mono text-sm"
            />
            <div className="flex justify-end">
              <Button onClick={submit} disabled={isLoading || !text.trim()}>
                {isLoading ? "Processing..." : "Create Intent"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {resp?.intent && (
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Intent Created</CardTitle>
                <Badge>Success</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm space-y-1">
                <div className="text-muted-foreground">Intent ID:</div>
                <code className="text-xs bg-muted px-2 py-1 rounded">{resp.intent.id}</code>
              </div>
              <div className="text-sm space-y-1">
                <div className="text-muted-foreground">Type:</div>
                <Badge variant="outline">{resp.intent.type}</Badge>
              </div>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/plans/${resp.intent.id}`}>View Plan Details →</Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {resp?.error && (
          <Card className="border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-lg text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{JSON.stringify(resp.error)}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
