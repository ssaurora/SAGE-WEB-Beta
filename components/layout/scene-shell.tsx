"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sceneNav } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

export function SceneShell({
  sceneId,
  children,
}: {
  sceneId: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const nav = sceneNav(sceneId);

  return (
    <section className="space-y-4">
      <div className="flex flex-col gap-4 rounded-lg border bg-card p-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Scene Detail
          </p>
          <h2 className="mt-2 text-2xl font-semibold">
            {sceneId} · Watershed analysis
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            场景级容器先行，为后续 Workbench、Tasks、Results 提供统一承载。
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Current State</p>
              <p className="mt-1 text-sm font-semibold">Ready to Run</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Required Inputs</p>
              <p className="mt-1 text-sm font-semibold">2 missing</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Latest Task</p>
              <p className="mt-1 text-sm font-semibold">Running</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {nav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-full border px-4 py-2 text-sm text-muted-foreground transition",
                active &&
                  "border-primary/40 bg-primary/10 font-semibold text-primary",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="rounded-lg border bg-card p-6">{children}</div>
    </section>
  );
}
