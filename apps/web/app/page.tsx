import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-secondary/20 to-background">
      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            StackOps AI
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-center">
          <p className="text-muted-foreground">
            Intelligent Microsoft 365 tenant management powered by AI
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/login">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
