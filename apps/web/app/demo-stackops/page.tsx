"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Bot,
  FileText,
  Building,
  Settings,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
  Plus,
  Search,
  Calendar,
  Download,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface ActivityLog {
  id: string;
  type: string;
  status: "success" | "pending" | "failed";
  timestamp: string;
  details: string;
}

interface Tenant {
  id: string;
  domain: string;
  users: number;
  licenses: number;
  maxLicenses: number;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Agent Console", href: "/agent", icon: <Bot className="h-5 w-5" /> },
  { label: "Activity & Audit", href: "/activity", icon: <FileText className="h-5 w-5" /> },
  { label: "Tenants", href: "/tenants", icon: <Building className="h-5 w-5" /> },
  { label: "Settings", href: "/settings", icon: <Settings className="h-5 w-5" /> },
];

const activityLogs: ActivityLog[] = [
  { id: "ACT-001", type: "User Creation", status: "success", timestamp: "2024-01-15 14:32:00", details: "Created user john.doe@contoso.com" },
  { id: "ACT-002", type: "License Assignment", status: "success", timestamp: "2024-01-15 14:28:00", details: "Assigned E5 license to jane.smith@contoso.com" },
  { id: "ACT-003", type: "Group Update", status: "pending", timestamp: "2024-01-15 14:15:00", details: "Adding users to Marketing group" },
  { id: "ACT-004", type: "Policy Change", status: "failed", timestamp: "2024-01-15 13:45:00", details: "Failed to update conditional access policy" },
  { id: "ACT-005", type: "User Deletion", status: "success", timestamp: "2024-01-15 13:20:00", details: "Removed user old.account@contoso.com" },
];

const tenants: Tenant[] = [
  { id: "1", domain: "contoso.com", users: 245, licenses: 200, maxLicenses: 250 },
  { id: "2", domain: "fabrikam.com", users: 128, licenses: 100, maxLicenses: 150 },
  { id: "3", domain: "northwind.com", users: 89, licenses: 75, maxLicenses: 100 },
];

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null;
    const initial = stored || "light";
    setTheme(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
};

const SidebarContent = ({ currentPath, onNavigate }: { currentPath: string; onNavigate: (path: string) => void }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          StackOps AI
        </h1>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => onNavigate(item.href)}
            aria-current={currentPath === item.href ? "page" : undefined}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              currentPath === item.href
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </nav>
      <Separator />
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground">AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">admin@stackops.ai</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
};

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

const JsonViewer = ({ data }: { data: any }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <pre className="overflow-auto rounded-md bg-muted p-4 text-xs">
          {JSON.stringify(data, null, 2)}
        </pre>
      </CardContent>
    </Card>
  );
};

const LoginPage = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-3">
              <Building className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Welcome to StackOps AI</CardTitle>
          <CardDescription>Sign in to manage your Microsoft Tenant</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" size="lg" onClick={() => onNavigate("/dashboard")}>
            <svg className="mr-2 h-5 w-5" viewBox="0 0 21 21" fill="currentColor">
              <path d="M10.5 0C4.701 0 0 4.701 0 10.5S4.701 21 10.5 21 21 16.299 21 10.5 16.299 0 10.5 0zm0 19.11c-4.748 0-8.61-3.862-8.61-8.61S5.752 1.89 10.5 1.89s8.61 3.862 8.61 8.61-3.862 8.61-8.61 8.61z" />
            </svg>
            Sign in with Microsoft (Entra ID)
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            We request least-privilege permissions to manage users, licenses, and tenant settings securely.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

const DashboardPage = ({ onNavigate }: { onNavigate: (path: string) => void }) => {
  return (
    <>
      <PageHeader title="Dashboard" breadcrumbs={[{ label: "Home" }, { label: "Dashboard" }]} />
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Agent Console</CardTitle>
            </div>
            <CardDescription>Execute natural language commands to manage your tenant</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={() => onNavigate("/agent")}>
              Open Console
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-2">
                <FileText className="h-6 w-6 text-blue-500" />
              </div>
              <CardTitle>Activity & Audit Logs</CardTitle>
            </div>
            <CardDescription>View all tenant operations and audit trails</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={() => onNavigate("/activity")}>
              View Logs
            </Button>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-2">
                <Settings className="h-6 w-6 text-green-500" />
              </div>
              <CardTitle>Tenant Settings</CardTitle>
            </div>
            <CardDescription>Configure tenant preferences and policies</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" onClick={() => onNavigate("/settings")}>
              Configure
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest operations across all tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityLogs.slice(0, 3).map((log) => (
                <div key={log.id} className="flex items-center gap-3">
                  {log.status === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {log.status === "pending" && <Clock className="h-5 w-5 text-yellow-500" />}
                  {log.status === "failed" && <AlertCircle className="h-5 w-5 text-red-500" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{log.type}</p>
                    <p className="text-xs text-muted-foreground truncate">{log.details}</p>
                  </div>
                  <Badge variant={log.status === "success" ? "default" : log.status === "pending" ? "secondary" : "destructive"}>
                    {log.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tenant Overview</CardTitle>
            <CardDescription>Quick stats across all managed tenants</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Tenants</span>
                <span className="text-2xl font-bold">{tenants.length}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Users</span>
                <span className="text-2xl font-bold">{tenants.reduce((acc, t) => acc + t.users, 0)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Licenses</span>
                <span className="text-2xl font-bold">{tenants.reduce((acc, t) => acc + t.licenses, 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const AgentPage = () => {
  const [command, setCommand] = useState("");
  const [showPlan, setShowPlan] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const planData = {
    task: "Create new user and assign license",
    steps: [
      { id: 1, action: "Validate user email format", status: "pending" },
      { id: 2, action: "Check if user already exists", status: "pending" },
      { id: 3, action: "Create user account in Azure AD", status: "pending" },
      { id: 4, action: "Assign E5 license to user", status: "pending" },
      { id: 5, action: "Send welcome email", status: "pending" },
    ],
    estimatedTime: "2-3 minutes",
  };

  const handleSend = () => {
    if (command.trim()) {
      setShowPlan(true);
    }
  };

  const handleApprove = () => {
    setShowSuccess(true);
    setShowPlan(false);
  };

  const handleCancel = () => {
    setShowPlan(false);
    setCommand("");
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
            <CardTitle>Natural Language Command</CardTitle>
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
            <Button onClick={handleSend} disabled={!command.trim()} className="w-full sm:w-auto">
              <Bot className="mr-2 h-4 w-4" />
              Generate Plan
            </Button>
          </CardContent>
        </Card>

        {showPlan && (
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Execution Plan Preview
              </CardTitle>
              <CardDescription>Review the steps before execution. Estimated time: {planData.estimatedTime}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This plan will be executed against your production tenant. Please review carefully.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                {planData.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-3 rounded-lg border p-3">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{step.action}</p>
                    </div>
                    <Badge variant="secondary">{step.status}</Badge>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleApprove} className="flex-1">
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve & Execute
                </Button>
                <Button onClick={handleCancel} variant="outline" className="flex-1">
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
            </div>
            <DialogTitle className="text-center">Task Executed Successfully</DialogTitle>
            <DialogDescription className="text-center">
              Your command has been executed successfully. All steps completed without errors.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuccess(false);
                setCommand("");
              }}
            >
              Create Another Task
            </Button>
            <Button onClick={() => setShowSuccess(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const ActivityPage = () => {
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const sampleJson = {
    id: "ACT-001",
    timestamp: "2024-01-15T14:32:00Z",
    type: "User Creation",
    status: "success",
    tenant: "contoso.com",
    actor: "admin@stackops.ai",
    details: {
      userPrincipalName: "john.doe@contoso.com",
      displayName: "John Doe",
      mailNickname: "john.doe",
      accountEnabled: true,
    },
    changes: [
      { property: "userPrincipalName", value: "john.doe@contoso.com" },
      { property: "displayName", value: "John Doe" },
    ],
  };

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
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
              {activityLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs">{log.id}</TableCell>
                  <TableCell className="font-medium">{log.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        log.status === "success"
                          ? "default"
                          : log.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">{log.timestamp}</TableCell>
                  <TableCell className="max-w-xs truncate text-sm">{log.details}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => setSelectedLog(log)}>
                      View JSON
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Activity Log Details</DialogTitle>
            <DialogDescription>Full JSON representation of the activity log entry</DialogDescription>
          </DialogHeader>
          <JsonViewer data={sampleJson} />
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedLog(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const TenantsPage = () => {
  return (
    <>
      <PageHeader
        title="Tenants"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Tenants" }]}
        actions={
          <Button size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Tenant
          </Button>
        }
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant) => (
          <Card key={tenant.id} className="transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{tenant.domain}</CardTitle>
                    <CardDescription>Tenant ID: {tenant.id}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Users</span>
                  <span className="font-medium">{tenant.users}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">License Usage</span>
                    <span className="font-medium">
                      {tenant.licenses} / {tenant.maxLicenses}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${(tenant.licenses / tenant.maxLicenses) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Manage Tenant
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
};

const SettingsPage = () => {
  return (
    <>
      <PageHeader
        title="Settings"
        breadcrumbs={[{ label: "Home", href: "/dashboard" }, { label: "Settings" }]}
      />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>Manage your account information and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" alt="User" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">AD</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-sm text-muted-foreground">admin@stackops.ai</p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" defaultValue="Admin User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="admin@stackops.ai" />
              </div>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize the look and feel of the application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Theme</Label>
                <p className="text-sm text-muted-foreground">Toggle between light and dark mode</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Settings</CardTitle>
            <CardDescription>Configure application behavior and integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-endpoint">API Endpoint</Label>
              <Input id="api-endpoint" defaultValue="https://api.stackops.ai" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeout">Request Timeout (seconds)</Label>
              <Input id="timeout" type="number" defaultValue="30" />
            </div>
            <Button>Update Settings</Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

const DashboardLayout = () => {
  const [currentPath, setCurrentPath] = useState("/login");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    setMobileMenuOpen(false);
  };

  const renderPage = () => {
    switch (currentPath) {
      case "/login":
        return <LoginPage onNavigate={handleNavigate} />;
      case "/dashboard":
        return <DashboardPage onNavigate={handleNavigate} />;
      case "/agent":
        return <AgentPage />;
      case "/activity":
        return <ActivityPage />;
      case "/tenants":
        return <TenantsPage />;
      case "/settings":
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={handleNavigate} />;
    }
  };

  if (currentPath === "/login") {
    return renderPage();
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-card lg:block">
        <SidebarContent currentPath={currentPath} onNavigate={handleNavigate} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent currentPath={currentPath} onNavigate={handleNavigate} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>

          <div className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold lg:hidden">StackOps AI</h1>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Building className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">contoso.com</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>contoso.com</DropdownMenuItem>
                  <DropdownMenuItem>fabrikam.com</DropdownMenuItem>
                  <DropdownMenuItem>northwind.com</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Tenant
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden lg:flex">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt="User" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleNavigate("/settings")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigate("/settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigate("/login")}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
};

export default function Page() {
  return <DashboardLayout />;
}


