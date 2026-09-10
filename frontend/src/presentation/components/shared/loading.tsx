"use client";

import { Loader2, LoaderCircle, ShieldCheck } from "lucide-react";

export function PageLoader() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex size-16 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-2xl bg-primary/10" />

          <div className="relative flex size-16 items-center justify-center rounded-2xl border bg-card shadow-sm">
            <Loader2 className="size-7 animate-spin text-primary" />
          </div>
        </div>

        <div className="space-y-1 text-center">
          <p className="text-sm font-medium">Loading dashboard</p>
          <p className="text-xs text-muted-foreground">
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
          <div className="h-8 w-56 animate-pulse rounded-lg bg-muted" />
          <div className="h-4 w-80 animate-pulse rounded-md bg-muted" />
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-32 animate-pulse rounded-2xl border bg-card"
            />
          ))}
        </div>

        {/* Main content */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-2xl border bg-card lg:col-span-2" />
          <div className="h-80 animate-pulse rounded-2xl border bg-card" />
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
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-foreground"
    >
      <div
        aria-hidden="true"
        className="loading-grid absolute inset-0 opacity-70"
      />
      <div aria-hidden="true" className="loading-orbit loading-orbit-one" />
      <div aria-hidden="true" className="loading-orbit loading-orbit-two" />

      <section className="relative flex w-full max-w-sm flex-col items-center text-center">
        <div className="relative mb-8 flex size-20 items-center justify-center rounded-[1.75rem] border border-primary/20 bg-card/80 shadow-2xl shadow-primary/10 backdrop-blur-xl">
          <div className="absolute inset-2 rounded-2xl border border-primary/15" />
          <ShieldCheck
            className="size-8 text-primary"
            strokeWidth={1.6}
            aria-hidden="true"
          />
          <span className="absolute -right-1 -top-1 size-3 rounded-full bg-primary shadow-[0_0_18px_var(--primary)]" />
        </div>

        <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.28em] text-primary">
          Secure workspace
        </p>
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          Preparing your dashboard
        </h1>
        <p className="mt-3 max-w-xs text-pretty text-sm leading-6 text-muted-foreground">
          We&apos;re checking your session and bringing your workspace online.
        </p>

        <div className="mt-9 flex items-center gap-3 rounded-full border border-border/70 bg-card/70 px-4 py-2.5 text-xs text-muted-foreground shadow-lg backdrop-blur-md">
          <LoaderCircle
            className="size-4 animate-spin text-primary"
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
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
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
      {Icon && <Icon className="h-12 w-12 text-muted-foreground/30" />}
      <div>
        <h3 className="text-sm font-medium text-foreground">{title}</h3>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
