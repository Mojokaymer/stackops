import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl">StackOps AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-muted-foreground">
            🔐 Sign in to manage your Microsoft Tenant
          </div>
          <div className="flex">
            <Button asChild className="w-full">
              {/* replace href with your real OAuth start URL when ready */}
              <Link href="/dashboard">Sign in with Microsoft (OAuth / Entra ID)</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We request least-privilege permissions to manage users, licenses, etc.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}

