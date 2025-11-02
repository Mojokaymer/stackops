"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

import {
  LayoutDashboard,
  Bot,
  FileText,
  Building,
  Settings,
  Menu,
  Sun,
  Moon,
  Plus,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

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
    const stored = (typeof window !== "undefined" ? localStorage.getItem("theme") : null) as "light" | "dark" | null;
    const initial = stored || "light";
    setTheme(initial);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", initial === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", newTheme === "dark");
    }
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </Button>
  );
};

const SidebarContent = ({ currentPath }: { currentPath: string }) => {
  return (
    <div className="flex h-full flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
          StackOps AI
        </h1>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const active = currentPath === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
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

function DashboardCards() {
  return (
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
          <Button asChild className="w-full">
            <Link href="/agent">Open Console</Link>
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
          <Button asChild variant="outline" className="w-full">
            <Link href="/activity">View Logs</Link>
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
          <Button asChild variant="outline" className="w-full">
            <Link href="/settings">Configure</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function DashboardSecondary() {
  return (
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
  );
}

export default function DashboardPage() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 border-r bg-card lg:block">
        <SidebarContent currentPath={pathname || ""} />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent currentPath={pathname || ""} />
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
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/login" className="flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <PageHeader title="Dashboard" breadcrumbs={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />
            <DashboardCards />
            <DashboardSecondary />
          </div>
        </main>
      </div>
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Done</DialogTitle>
            <DialogDescription>Action completed successfully.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccess(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
