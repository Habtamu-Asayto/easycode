"use client";

import type { LucideIcon } from "lucide-react";

type StatsCardTone = "primary" | "success" | "warning" | "danger";

interface StatsCardProps {
  label: string;
  value: number | string;
  description: string;
  icon: LucideIcon;
  tone?: StatsCardTone;
}

const toneStyles: Record<
  StatsCardTone,
  {
    glow: string;
    iconBox: string;
    icon: string;
    descriptionIcon: string;
  }
> = {
  primary: {
    glow: "bg-primary/5",
    iconBox: "bg-primary/10 text-primary",
    icon: "text-primary",
    descriptionIcon: "text-primary",
  },

  success: {
    glow: "bg-emerald-500/5",
    iconBox:
      "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: "text-emerald-500",
    descriptionIcon: "text-emerald-500",
  },

  warning: {
    glow: "bg-amber-500/5",
    iconBox:
      "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: "text-amber-500",
    descriptionIcon: "text-amber-500",
  },

  danger: {
    glow: "bg-destructive/5",
    iconBox: "bg-destructive/10 text-destructive",
    icon: "text-destructive",
    descriptionIcon: "text-destructive",
  },
};

export function StatsCard({
  label,
  value,
  description,
  icon: Icon,
  tone = "primary",
}: StatsCardProps) {
  const styles = toneStyles[tone];

  return (
    <div className="group border-border/70 bg-card relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      {/* Decorative glow */}
      <div
        className={`absolute -top-8 -right-8 size-24 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150 ${styles.glow}`}
      />

      {/* Content */}
      <div className="relative flex items-start justify-between gap-4">
        {/* Text */}
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium">
            {label}
          </p>

          <p className="mt-2 text-3xl font-semibold tracking-tight">
            {typeof value === "number"
              ? value.toLocaleString()
              : value}
          </p>

          <div className="text-muted-foreground mt-3 flex items-center gap-1.5 text-[11px]">
            <Icon className={`size-3.5 ${styles.descriptionIcon}`} />

            <span>{description}</span>
          </div>
        </div>

        {/* Icon */}
        <div
          className={`flex size-11 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105 ${styles.iconBox}`}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}