"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { scenePrimaryNav, sceneSecondaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function SceneShell({
  sceneId,
  children,
}: {
  sceneId: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const mainNav = scenePrimaryNav(sceneId);
  const supportNav = sceneSecondaryNav(sceneId);

  return (
    <section className="space-y-4">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Scene Workspace
            </p>
            <h2 className="mt-2 text-2xl font-semibold">{sceneId}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              主链路：Overview → Workbench → Results；支撑视图：Assets / Task
              Runs / Audit。
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            场景级容器先行，任务上下文由页面内部上下文条承担。
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {mainNav.map((item) => {
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

      <details className="rounded-lg border bg-card px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
          More ({supportNav.length})
        </summary>
        <div className="mt-3 flex flex-wrap gap-2">
          {supportNav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs text-muted-foreground transition",
                  active &&
                    "border-primary/40 bg-primary/10 font-semibold text-primary",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </details>

      <div className="rounded-lg border bg-card p-6">{children}</div>
    </section>
  );
}
