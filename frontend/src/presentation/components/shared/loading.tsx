"use client";

import { Loader2, LoaderCircle, ShieldCheck } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex size-16 items-center justify-center">
          <div className="bg-primary/10 absolute inset-0 animate-ping rounded-2xl" />

          <div className="bg-card relative flex size-16 items-center justify-center rounded-2xl border shadow-sm">
            <Loader2 className="text-primary size-7 animate-spin" />
          </div>
        </div>

        <div className="space-y-1 text-center">
          <p className="text-sm font-medium">Loading dashboard</p>
          <p className="text-muted-foreground text-xs">
            Preparing your workspace...
          </p>
        </div>
      </div>
    </div>
  );
}

export function PageLoader2() {
  return (
    <div className="min-h-[calc(100vh-4rem)] p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="bg-muted h-8 w-56 animate-pulse rounded-lg" />
          <div className="bg-muted h-4 w-80 animate-pulse rounded-md" />
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-card h-32 animate-pulse rounded-2xl border"
            />
          ))}
        </div>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="bg-card h-80 animate-pulse rounded-2xl border lg:col-span-2" />
          <div className="bg-card h-80 animate-pulse rounded-2xl border" />
        </div>
      </div>
    </div>
  );
}

export function CompleteLoader() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="bg-background text-foreground relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6"
    >
      <div
        aria-hidden="true"
        className="loading-grid absolute inset-0 opacity-70"
      />
      <div aria-hidden="true" className="loading-orbit loading-orbit-one" />
      <div aria-hidden="true" className="loading-orbit loading-orbit-two" />

      <section className="relative flex w-full max-w-sm flex-col items-center text-center">
        <div className="border-primary/20 bg-card/80 shadow-primary/10 relative mb-8 flex size-20 items-center justify-center rounded-[1.75rem] border shadow-2xl backdrop-blur-xl">
          <div className="border-primary/15 absolute inset-2 rounded-2xl border" />
          <ShieldCheck
            className="text-primary size-8"
            strokeWidth={1.6}
            aria-hidden="true"
          />
          <span className="bg-primary absolute -top-1 -right-1 size-3 rounded-full shadow-[0_0_18px_var(--primary)]" />
        </div>

        <p className="text-primary mb-3 font-mono text-[11px] font-medium tracking-[0.28em] uppercase">
          Secure workspace
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          Preparing your dashboard
        </h1>
        <p className="text-muted-foreground mt-3 max-w-xs text-sm leading-6 text-pretty">
          We&apos;re checking your session and bringing your workspace online.
        </p>

        <div className="border-border/70 bg-card/70 text-muted-foreground mt-9 flex items-center gap-3 rounded-full border px-4 py-2.5 text-xs shadow-lg backdrop-blur-md">
          <LoaderCircle
            className="text-primary size-4 animate-spin"
            aria-hidden="true"
          />
          <span>Authenticating securely</span>
        </div>

        <span className="sr-only">Loading your authenticated workspace</span>
      </section>
    </main>
  );
}

export function InlineLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="text-muted-foreground flex items-center gap-2 text-sm">
      <Loader2 className="text-primary h-4 w-4 animate-spin" />
      <span>{text}</span>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-center">
      {Icon && <Icon className="text-muted-foreground/30 h-12 w-12" />}
      <div>
        <h3 className="text-foreground text-sm font-medium">{title}</h3>
        {description && (
          <p className="text-muted-foreground mt-1 text-xs">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
