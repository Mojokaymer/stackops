import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-accent/10 to-background relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/3 -right-48 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-xl shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 relative z-10">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-2xl">🔐</span>
            </div>
            <div>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                StackOps AI
              </CardTitle>
              <p className="text-sm text-muted-foreground/80">
                Microsoft 365 Management
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sign in securely to manage your Microsoft 365 tenant with AI-powered tools and insights.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                <span className="text-green-500">✓</span>
                <span>Secure OAuth</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                <span className="text-green-500">✓</span>
                <span>Entra ID</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
                <span className="text-green-500">✓</span>
                <span>Least Privilege</span>
              </div>
            </div>
          </div>
          <div className="space-y-3 pt-2">
            <Button asChild className="w-full shadow-lg hover:shadow-xl transition-all h-12 text-base">
              {/* replace href with your real OAuth start URL when ready */}
              <Link href="/dashboard">
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" viewBox="0 0 23 23" fill="currentColor">
                    <path d="M0 0h11v11H0z" />
                    <path d="M12 0h11v11H12z" />
                    <path d="M0 12h11v11H0z" />
                    <path d="M12 12h11v11H12z" />
                  </svg>
                  Sign in with Microsoft
                </span>
              </Link>
            </Button>
            <p className="text-xs text-center text-muted-foreground/60 leading-relaxed px-4">
              We request only the minimum permissions needed to manage users, licenses, and tenant settings on your behalf.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}

