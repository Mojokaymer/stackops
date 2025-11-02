"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AppHeader() {
  const [tenant, setTenant] = useState("Contoso");

  return (
    <header className="mb-6 backdrop-blur-sm bg-card/30 rounded-xl p-4 shadow-lg border border-border/50">
      <div className="flex items-center justify-between gap-3">
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-md">
            <span className="text-base">🚀</span>
          </div>
          StackOps AI
        </Link>
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="shadow-sm hover:shadow-md transition-all"
            onClick={() => alert("+ Add New Tenant (coming soon)")}
          >
            <span className="mr-1">+</span> Add Tenant
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-border/50 hover:bg-accent/10 shadow-sm"
            onClick={() => alert("Switch Tenant (coming soon)")}
          >
            <span className="mr-2">🏢</span>
            {tenant} ▾
          </Button>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-border/50">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-semibold">
              A
            </div>
            <span className="text-sm text-foreground font-medium">Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}

