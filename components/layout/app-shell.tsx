"use client";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppRole } from "@/components/pages/app-role";
import { primaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

function getSectionLabel(pathname: string): string {
  if (pathname.startsWith("/scenes/")) return "Scene Workspace";
  if (pathname.startsWith("/task-governance")) return "Task Governance";
  if (pathname.startsWith("/assets")) return "Assets";
  if (pathname.startsWith("/results")) return "Results";
  if (pathname.startsWith("/settings")) return "Settings";
  return "Scenes";
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useAppRole();
  const modeLabel = role === "Viewer" ? "Read Only" : "Editable";
  const sectionLabel = getSectionLabel(pathname);

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
                title={item.description}
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
        <header className="flex items-center justify-between border-b bg-background px-6 py-2.5 lg:px-8">
          <div className="text-xs font-medium text-muted-foreground">
            {sectionLabel}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{role}</Badge>
            <Badge variant={role === "Viewer" ? "outline" : "default"}>
              {modeLabel}
            </Badge>
          </div>
        </header>

        <main className="p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
