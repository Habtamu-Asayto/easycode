"use client";

import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AppHeader />
        <main className="flex-1 overflow-y-auto bg-muted/30 fluent-scroll">
          {children}
        </main>
      </div>
    </div>
  );
}
