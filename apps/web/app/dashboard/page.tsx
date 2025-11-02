"use client";

import Link from "next/link";
import AppHeader from "@/components/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  return (
    <main className="p-6">
      <AppHeader />
      <section className="grid gap-4 md:grid-cols-3">
        {/* Agent Console card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>🤖 Agent Console</CardTitle>
          </CardHeader>
          <CardContent className="flex">
            <Button asChild className="ml-auto">
              <Link href="/agent">Open</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Activity & Audit Logs card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>📜 Activity & Audit Logs</CardTitle>
          </CardHeader>
          <CardContent className="flex">
            <Button asChild variant="outline" className="ml-auto">
              <Link href="/activity">View</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Tenant Settings card */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle>⚙️ Tenant Settings</CardTitle>
          </CardHeader>
          <CardContent className="flex">
            <Button
              variant="ghost"
              className="ml-auto"
              onClick={() => alert("Tenant Settings (coming soon)")}
            >
              Configure
            </Button>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}

