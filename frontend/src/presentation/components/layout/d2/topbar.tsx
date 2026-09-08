"use client";

import { useEffect, useState } from "react";
import { Menu, Search, Bell, Moon, Sun, Plus } from "lucide-react";

import { cn } from "@/lib/utils";

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function Topbar({
  onMenu,
  theme,
  onToggleTheme,
}: {
  onMenu: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  const now = useClock();

  const dateLabel = now
    ? now.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    : "";
  const timeLabel = now
    ? now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : "";

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          onClick={onMenu}
          className="grid size-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          <Menu className="size-4.5" />
        </button>

        {/* Search */}
        <label className="relative hidden max-w-md flex-1 items-center sm:flex">
          <Search className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search patients, doctors, records…"
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-16 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 hover:border-ring/40 focus:border-ring focus:ring-4 focus:ring-ring/10"
          />
          <kbd className="absolute right-3 hidden rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground md:inline">
            ⌘K
          </kbd>
        </label>

        <div className="flex-1 sm:hidden" />

        {/* Live clock */}
        <div className="hidden items-center gap-3 rounded-xl border border-border bg-card px-3.5 py-1.5 md:flex">
          <div className="flex flex-col leading-none">
            <span className="text-[11px] font-medium text-muted-foreground">
              {dateLabel}
            </span>
            <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
              {timeLabel}
            </span>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:ml-0">
          <button className="hidden h-10 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-px active:translate-y-0 sm:flex">
            <Plus className="size-4" />
            New appointment
          </button>

          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="size-4.5" />
            ) : (
              <Moon className="size-4.5" />
            )}
          </button>

          {/* Notifications */}
          <button
            className="relative grid size-10 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="size-4.5" />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive ring-2 ring-card" />
          </button>

          {/* Avatar */}
          <button
            className="flex items-center gap-2.5 rounded-xl border border-border bg-card py-1 pl-1 pr-2.5 transition-colors hover:border-ring/40"
            aria-label="Account menu"
          >
            <span
              className={cn(
                "grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[var(--chart-1)] to-[var(--chart-4)] text-xs font-bold text-white",
              )}
            >
              DR
            </span>
            <span className="hidden flex-col items-start leading-none lg:flex">
              <span className="text-xs font-semibold text-foreground">
                Dr. Reyes
              </span>
              <span className="text-[10px] text-muted-foreground">
                Chief of Staff
              </span>
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
