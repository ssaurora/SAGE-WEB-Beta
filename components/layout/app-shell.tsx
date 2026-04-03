"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { primaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_1fr]">
      <aside className="border-b border-border bg-[hsl(var(--surface-soft))] p-6 lg:border-b-0 lg:border-r">
        <div className="space-y-2">
          <div className="text-xl font-extrabold tracking-wide">SAGE-WEB</div>
          <p className="text-xs leading-6 text-muted-foreground">
            Scene-first · GIS-first · Governance-visible
          </p>
        </div>

        <nav className="mt-6 flex flex-col gap-2">
          {primaryNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg border border-transparent bg-background/70 px-4 py-3 transition hover:-translate-y-0.5 hover:border-border hover:shadow-sm",
                  active && "border-primary/30 bg-background shadow-sm",
                )}
              >
                <p className="text-sm font-semibold">{item.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            );
          })}
        </nav>

        <Separator className="my-6" />

        <div className="rounded-lg border bg-background/80 p-4">
          <p className="text-xs text-muted-foreground">Current page</p>
          <p className="mt-1 text-sm font-semibold">{getPageTitle(pathname)}</p>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="flex items-start justify-between gap-4 border-b bg-background/90 px-6 py-5 backdrop-blur lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {getPageTitle(pathname)}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              AI-guided analysis workbench with structured tasks, inputs, maps
              and results.
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary">Phase 0</Badge>
            <Badge variant="outline">Shell ready</Badge>
          </div>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
