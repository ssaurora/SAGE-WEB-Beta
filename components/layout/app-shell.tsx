"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

function getPageTitle(pathname: string): string {
  if (pathname.includes("/workbench")) return "Scene Workbench";
  if (pathname.includes("/overview")) return "Scene Overview";
  if (pathname.includes("/task-runs")) return "Task Runs";
  if (pathname.includes("/results")) return "Results";
  if (pathname.includes("/audit")) return "Audit";
  if (pathname.startsWith("/tasks")) return "Tasks";
  if (pathname.startsWith("/task-governance")) return "Task Governance";
  if (pathname.startsWith("/assets")) return "Assets";
  if (pathname.startsWith("/reports")) return "Reports";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Scenes";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-border bg-background px-4 py-5 lg:border-b-0 lg:border-r">
        <div className="space-y-1 px-2">
          <div className="text-sm font-bold tracking-wide">SAGE-WEB</div>
          <p className="text-xs text-muted-foreground">
            Scene-first analysis workspace
          </p>
        </div>

        <nav className="mt-5 flex flex-col gap-1">
          {primaryNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-md px-3 py-2 transition-colors",
                  "text-sm text-muted-foreground hover:bg-muted hover:text-foreground",
                  active && "bg-muted font-semibold text-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0">
        <header className="flex items-center justify-between border-b bg-background/95 px-6 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">
              SAGE-WEB Beta
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {getPageTitle(pathname)}
          </span>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
