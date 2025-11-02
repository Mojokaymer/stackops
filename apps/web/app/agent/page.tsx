"use client";

import * as React from "react";
import { useState } from "react";
import { Bot, CheckCircle2, Clock, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import Link from "next/link";

const PageHeader = ({
  title,
  breadcrumbs,
}: {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
}) => {
  return (
    <div className="mb-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  {index === breadcrumbs.length - 1 ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={crumb.href || "#"}>{crumb.label}</BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      </div>
    </div>
  );
};

export default function AgentPage() {
  const [command, setCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [intentId, setIntentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!command.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/intent/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tenantId: "contoso.onmicrosoft.com", 
          text: command 
        }),
      });

      const data = await response.json();

      if (data.intent) {
        setIntentId(data.intent.id);
        setShowSuccess(true);
        setCommand("");
      } else if (data.error) {
        setError(data.error);
      }
    } catch (err) {
      setError("Failed to create intent. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Agent Console"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Agent Console" }]}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Natural Language Command
            </CardTitle>
            <CardDescription>
              Describe what you want to do in plain English. The AI agent will create an execution plan for your approval.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="command">Command</Label>
              <Textarea
                id="command"
                placeholder="Example: Create a new user john.doe@contoso.com and assign them an E5 license"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading || !command.trim()} 
              className="w-full sm:w-auto"
            >
              <Bot className="mr-2 h-4 w-4" />
              {isLoading ? "Processing..." : "Generate Plan"}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <DialogTitle className="text-center">Intent Created Successfully</DialogTitle>
            <DialogDescription className="text-center">
              Your command has been processed and an execution plan has been created.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccess(false);
                setIntentId(null);
              }}
            >
              Create Another
            </Button>
            {intentId && (
              <Button asChild>
                <Link href={`/plans/${intentId}`}>View Plan</Link>
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
