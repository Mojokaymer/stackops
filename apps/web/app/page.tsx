import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-accent/10 to-background relative overflow-hidden">
      {/* Animated background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <Card className="w-full max-w-lg shadow-2xl border-border/50 backdrop-blur-sm bg-card/95 relative z-10">
        <CardHeader className="space-y-4 pb-6">
          <div className="flex items-center justify-center mb-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <span className="text-3xl">🚀</span>
            </div>
          </div>
          <CardTitle className="text-4xl font-bold text-center bg-gradient-to-r from-primary via-primary/80 to-accent bg-clip-text text-transparent">
            StackOps AI
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground/80 font-medium">
            Intelligent Microsoft 365 Management
          </p>
        </CardHeader>
        <CardContent className="space-y-6 pb-8">
          <div className="space-y-3 text-center">
            <p className="text-muted-foreground leading-relaxed">
              Streamline your Microsoft 365 tenant management with AI-powered automation and insights
            </p>
            <div className="flex items-center justify-center gap-6 pt-2 text-sm text-muted-foreground/60">
              <span className="flex items-center gap-1">
                <span className="text-green-500">●</span> Secure
              </span>
              <span className="flex items-center gap-1">
                <span className="text-blue-500">●</span> Fast
              </span>
              <span className="flex items-center gap-1">
                <span className="text-purple-500">●</span> Intelligent
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <Button asChild size="lg" className="w-full shadow-lg hover:shadow-xl transition-all">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full border-border/50 hover:bg-accent/10">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
