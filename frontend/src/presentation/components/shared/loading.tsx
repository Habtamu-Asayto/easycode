"use client";

import type { ElementType, ReactNode } from "react";
import { LoaderCircle } from "lucide-react";

const loaderMotion = "motion-safe:animate-spin";

export function PageLoader({
  text = "Smart Sooner", 
}: {
  text?: string;
}) {
  return (
    <div
      className="flex min-h-[400px] flex-col items-center justify-center gap-5 px-6 text-center"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex size-16 items-center justify-center rounded-2xl border border-border/80 bg-card shadow-sm">
        <span className="absolute inset-0 rounded-2xl bg-primary/5 motion-safe:animate-pulse" />
        <LoaderCircle className={`relative size-7 text-primary ${loaderMotion}`} />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-foreground">{text}</p>
        <div className="mx-auto h-1 w-32 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 rounded-full bg-primary motion-safe:animate-[loading_1.4s_ease-in-out_infinite]" />
        </div>
        <span className="sr-only">Please wait while the page loads.</span>
      </div>
    </div>
  );
}

export function InlineLoader({ text = "Smart Sooner" }: { text?: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-sm text-muted-foreground"
      role="status"
      aria-live="polite"
    >
      <LoaderCircle className={`size-4 text-primary ${loaderMotion}`} aria-hidden="true" />
      <span>{text}</span>
    </span>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: ElementType;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-4 px-6 text-center">
      {Icon && (
        <div className="flex size-14 items-center justify-center rounded-2xl border border-border/80 bg-muted/40 shadow-sm">
          <Icon className="size-6 text-muted-foreground" aria-hidden="true" />
        </div>
      )}
      <div className="max-w-sm space-y-1.5">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && <p className="text-sm leading-6 text-muted-foreground">{description}</p>}
      </div>
      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}

