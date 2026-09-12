"use client";

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { RefreshCw } from "lucide-react";

interface ManagementPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: LucideIcon;
  onRefresh?: () => void;
  refreshing?: boolean;
  action?: ReactNode;
}

export function ManagementPageHeader({
  eyebrow,
  title,
  description,
  icon: Icon,
  onRefresh,
  refreshing = false,
  action,
}: ManagementPageHeaderProps) {
  return (
    <section className="border-border/70 bg-card relative overflow-hidden rounded-2xl border shadow-sm">
      {/* Decorative background */}
      <div className="bg-primary/5 absolute -top-20 -right-20 size-48 rounded-full blur-3xl" />
      <div className="bg-primary/[0.03] absolute -bottom-24 -left-20 size-48 rounded-full blur-3xl" />

      <div className="relative flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left side */}
        <div className="flex min-w-0 items-start gap-4">
          {/* Icon */}
          {Icon && (
            <div className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl">
              <Icon className="size-6" />
            </div>
          )}

          <div className="min-w-0">
            {eyebrow && (
              <div className="text-primary mb-1 flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] uppercase">
                <span>{eyebrow}</span>
                <span className="bg-primary/30 size-1 rounded-full" />
                <span className="text-muted-foreground/70 tracking-normal">
                  Administration
                </span>
              </div>
            )}

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h1>

            {description && (
              <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm leading-6">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={refreshing}
              className="border-border/70 bg-background hover:bg-muted inline-flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium transition-colors disabled:pointer-events-none disabled:opacity-60"
            >
              <RefreshCw
                className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          )}

          {action}
        </div>
      </div>
    </section>
  );
}