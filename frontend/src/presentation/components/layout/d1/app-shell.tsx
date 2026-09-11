"use client";

import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="bg-background flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AppHeader />
        <main className="bg-muted/30 fluent-scroll flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
