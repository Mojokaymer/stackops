import * as React from "react";
import { supabaseServer } from "@/lib/supabase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Download, Search, Calendar } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";

const PageHeader = ({
  title,
  breadcrumbs,
  actions,
}: {
  title: string;
  breadcrumbs?: { label: string; href?: string }[];
  actions?: React.ReactNode;
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
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
};

export default async function ActivityPage() {
  const sb = supabaseServer();
  
  // Fetch intents and audit logs from Supabase
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
      case "pending":
        return "secondary";
      case "planned":
      case "approved":
      case "applied":
      case "success":
        return "default";
      case "failed":
        return "destructive";
      default:
        return "outline";
    }
  };

  // Combine logs for display
  const activityLogs = [
    ...(intents || []).map((intent: any) => ({
      id: intent.id,
      type: intent.type || "Intent",
      status: intent.status,
      timestamp: new Date(intent.created_at).toLocaleString(),
      details: `Intent: ${intent.type}`,
    })),
    ...(logs || []).map((log: any) => ({
      id: log.id,
      type: log.tool_name || "Operation",
      status: log.status || "pending",
      timestamp: new Date(log.ts).toLocaleString(),
      details: log.step || "Audit log entry",
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <>
      <PageHeader
        title="Activity & Audit Logs"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Activity" }]}
        actions={
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        }
      />

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <Label htmlFor="tenant-filter">Tenant</Label>
              <Select defaultValue="all">
                <SelectTrigger id="tenant-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tenants</SelectItem>
                  <SelectItem value="contoso">contoso.com</SelectItem>
                  <SelectItem value="fabrikam">fabrikam.com</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status-filter">Status</Label>
              <Select defaultValue="all">
                <SelectTrigger id="status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date-filter">Date Range</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between" id="date-filter">
                    <span>Last 7 days</span>
                    <Calendar className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Today</DropdownMenuItem>
                  <DropdownMenuItem>Last 7 days</DropdownMenuItem>
                  <DropdownMenuItem>Last 30 days</DropdownMenuItem>
                  <DropdownMenuItem>Custom range</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="space-y-2">
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search logs..."
                  className="pl-8"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityLogs && activityLogs.length > 0 ? (
                activityLogs.slice(0, 20).map((log: any) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-xs">{log.id.slice(0, 8)}...</TableCell>
                    <TableCell className="font-medium">{log.type}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(log.status)}>
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                    <TableCell className="max-w-xs truncate text-sm">{log.details}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/plans/${log.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No activity logs yet. Create an intent in the Agent Console to get started!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
