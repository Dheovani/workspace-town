"use client";

import { useState, type ReactNode } from "react";
import { Building2, PanelRightOpen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RoomShellProps = {
  appName: string;
  title: string;
  sidebarLabel: string;
  openSidebarLabel: string;
  closeSidebarLabel: string;
  children: ReactNode;
  sidebar: ReactNode;
};

export function RoomShell({
  appName,
  title,
  sidebarLabel,
  openSidebarLabel,
  closeSidebarLabel,
  children,
  sidebar,
}: RoomShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <main className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#dce5df] text-foreground">
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-emerald-950/30 bg-[#173f36] px-3 text-white shadow-sm sm:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-md bg-emerald-200 text-emerald-950 shadow-sm">
            <Building2 aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-xs text-emerald-100/75">{appName}</p>
            <h1 className="truncate text-sm font-semibold sm:text-base">
              {title}
            </h1>
          </div>
        </div>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-white hover:bg-white/10 hover:text-white lg:hidden"
          aria-label={openSidebarLabel}
          title={openSidebarLabel}
          onClick={() => setIsSidebarOpen(true)}
        >
          <PanelRightOpen aria-hidden="true" />
        </Button>
      </header>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        <section className="min-w-0 flex-1">{children}</section>

        {isSidebarOpen ? (
          <button
            type="button"
            className="absolute inset-0 z-10 bg-slate-950/35 lg:hidden"
            aria-label={closeSidebarLabel}
            onClick={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <aside
          aria-label={sidebarLabel}
          className={cn(
            "absolute inset-y-0 right-0 z-20 flex w-[min(21rem,calc(100vw-1rem))] shrink-0 flex-col overflow-y-auto border-l bg-white/95 shadow-2xl backdrop-blur-sm transition-transform lg:static lg:w-[21rem] lg:translate-x-0 lg:shadow-[-8px_0_24px_rgba(23,63,54,0.08)]",
            isSidebarOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b px-4 lg:hidden">
            <p className="text-sm font-semibold">{sidebarLabel}</p>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={closeSidebarLabel}
              title={closeSidebarLabel}
              onClick={() => setIsSidebarOpen(false)}
            >
              <X aria-hidden="true" />
            </Button>
          </div>
          {sidebar}
        </aside>
      </div>
    </main>
  );
}
