"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { scenePrimaryNav, sceneSecondaryNav } from "@/config/navigation";
import { cn } from "@/lib/utils";

const MORE_OPEN_STORAGE_KEY = "sage-web.sceneShell.moreOpen";

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
  const hasActiveSupportNav = useMemo(
    () =>
      supportNav.some(
        (item) =>
          pathname === item.href || pathname.startsWith(`${item.href}/`),
      ),
    [pathname, supportNav],
  );
  const [isMoreOpen, setIsMoreOpen] = useState(hasActiveSupportNav);

  useEffect(() => {
    const saved = window.localStorage.getItem(MORE_OPEN_STORAGE_KEY);
    if (saved === "true") {
      setIsMoreOpen(true);
      return;
    }
    if (saved === "false") {
      setIsMoreOpen(false);
      return;
    }
    setIsMoreOpen(hasActiveSupportNav);
  }, [hasActiveSupportNav]);

  const onMoreToggle = (open: boolean) => {
    setIsMoreOpen(open);
    window.localStorage.setItem(MORE_OPEN_STORAGE_KEY, open ? "true" : "false");
  };

  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-2 rounded-lg border bg-card px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-xs text-muted-foreground">Scene</span>
          <span className="font-medium text-foreground">{sceneId}</span>
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
      </div>

      <details
        className="rounded-lg border bg-card px-4 py-2.5"
        open={isMoreOpen}
        onToggle={(event) => onMoreToggle(event.currentTarget.open)}
      >
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

      <div>{children}</div>
    </section>
  );
}
