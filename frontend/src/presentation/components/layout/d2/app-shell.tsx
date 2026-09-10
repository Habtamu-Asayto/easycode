"use client";

import { useEffect, useState } from "react";

import { AppSidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Default theme: Light
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark";

      document.documentElement.classList.toggle(
        "dark",
        next === "dark",
      );

      document.documentElement.classList.toggle(
        "light",
        next === "light",
      );

      return next;
    });
  };

  // Desktop: collapse/expand sidebar
  // Mobile: open/close sidebar drawer
  const handleMenu = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setCollapsed((prev) => !prev);
    } else {
      setMobileOpen((prev) => !prev);
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          onMenu={handleMenu}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        <main className="min-w-0 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}