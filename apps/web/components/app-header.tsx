"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AppHeader() {
  const [tenant, setTenant] = useState("Contoso");

  return (
    <header className="mb-6">
      <div className="flex items-center justify-between gap-3">
        <Link href="/dashboard" className="font-semibold tracking-tight">
          StackOps AI
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => alert("+ Add New Tenant (coming soon)")}
          >
            + Add New Tenant
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Switch Tenant (coming soon)")}
          >
            {tenant} ▾
          </Button>
          <div className="text-sm text-muted-foreground">User: Admin</div>
        </div>
      </div>
      <Separator className="mt-4" />
    </header>
  );
}

