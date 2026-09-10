"use client";

import { useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  HeartPulse,
  ChevronRight,
  LifeBuoy,
  Settings,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { navCategories, currentUser, type NavItem } from "./NavCategories";

import { Avatar, AvatarFallback } from "@/presentation/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/presentation/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/presentation/components/ui/tooltip";
import Link from "next/link";

import { useAuth } from "@/presentation/hooks";
import { signOut } from "next-auth/react";

type AppSidebarProps = {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
};

export function AppSidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onMobileClose,
}: AppSidebarProps) {
  const { user, isSuperAdmin, hasPermission } = useAuth();
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const pathname = usePathname();

  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = useCallback((label: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  const filteredCategories = useMemo(() => {
    return navCategories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => {
          if (isSuperAdmin) return true;
          if (item.permission && !hasPermission(item.permission)) return false;
          return true;
        }),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [isSuperAdmin, hasPermission]);

  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "U";

  const renderNavLink = (item: NavItem) => {
    const isActive =
      pathname === item.href || pathname.startsWith(`${item.href}/`);

    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        onClick={onMobileClose}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "group relative flex w-full items-center rounded-xl text-sm font-medium transition-all duration-200",
          collapsed ? "h-11 w-11 justify-center" : "gap-3 px-3 py-2.5",
          isActive
            ? "bg-gradient-to-br from-primary/15 via-primary/10 to-chart-2/10 text-primary ring-1 ring-primary/20 shadow-sm dark:from-primary/25 dark:via-primary/15 dark:to-chart-2/15 dark:text-primary-foreground dark:ring-primary/25"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        )}
      >
        {isActive && !collapsed && (
          <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
        )}

        <Icon
          className={cn(
            "h-[18px] w-[18px] shrink-0 transition-colors",
            isActive
              ? "text-primary dark:text-primary-foreground"
              : "text-muted-foreground group-hover:text-sidebar-foreground",
          )}
          strokeWidth={2}
        />

        {!collapsed && (
          <span className="flex-1 truncate text-left">{item.label}</span>
        )}

        {!collapsed && item.badge ? (
          <span
            className={cn(
              "grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[10px] font-semibold",
              isActive
                ? "bg-primary/20 text-primary ring-1 ring-primary/25 dark:bg-primary/30 dark:text-primary-foreground"
                : "bg-sidebar-accent text-sidebar-accent-foreground",
            )}
          >
            {item.badge}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        aria-hidden={!mobileOpen}
        onClick={onMobileClose}
        className={cn(
          "fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[transform,width] duration-300 ease-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-[76px]" : "w-72",
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "flex h-16 shrink-0 items-center border-b border-sidebar-border",
            collapsed ? "justify-center px-2" : "gap-3 px-5",
          )}
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-chart-2 text-primary-foreground shadow-lg shadow-primary/25">
            <HeartPulse className="size-5" strokeWidth={2.2} />
          </span>

          {!collapsed && (
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-bold tracking-[0.14em] text-sidebar-foreground">
                MEDICARE
              </span>
              <span className="truncate text-[9px] font-medium uppercase tracking-[0.22em] text-sidebar-foreground/50">
                Clinic Operations
              </span>
            </div>
          )}

          {!collapsed && (
            <button
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              className="hidden size-8 place-items-center rounded-lg text-sidebar-foreground/55 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground lg:grid"
            >
              <PanelLeftClose className="size-4" />
            </button>
          )}

          <button
            onClick={onMobileClose}
            aria-label="Close menu"
            className="grid size-8 place-items-center rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground lg:hidden"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <div className="hidden justify-center px-2 pt-3 lg:flex">
            <button
              onClick={onToggleCollapse}
              aria-label="Expand sidebar"
              className="grid size-8 place-items-center rounded-lg text-sidebar-foreground/55 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
            >
              <PanelLeftOpen className="size-4" />
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className="fluent-scroll min-h-0 flex-1 overflow-y-auto py-3">
          <div className={cn("space-y-1", collapsed ? "px-3" : "px-3")}>
            {filteredCategories.map((cat) => {
              const isCatCollapsed = !!collapsedCategories[cat.label];
              const showHeader = cat.label !== "Main";

              return (
                <div key={cat.label} className="pb-1">
                   {showHeader && !collapsed && (
                    <button
                      type="button"
                      onClick={() =>
                        cat.collapsible && toggleCategory(cat.label)
                      }
                      className={cn(
                        "flex w-full items-center px-3 pb-1 pt-4",
                        cat.collapsible ? "cursor-pointer" : "cursor-default",
                      )}
                    >
                      <span className="flex-1 text-left text-[10px] font-semibold uppercase tracking-[0.18em] text-sidebar-foreground/40">
                        {cat.label}
                      </span>
                      {cat.collapsible && (
                        <ChevronRight
                          className={cn(
                            "size-3.5 text-sidebar-foreground/40 transition-transform duration-200",
                            !isCatCollapsed && "rotate-90",
                          )}
                        />
                      )}
                    </button>
                  )}

                  {collapsed && (
                    <div className="my-2 flex justify-center">
                      <span className="h-px w-6 rounded-full bg-sidebar-border" />
                    </div>
                  )}

                  <ul
                    className={cn(
                      "space-y-1 overflow-hidden transition-all duration-300",
                      cat.collapsible && isCatCollapsed && !collapsed
                        ? "max-h-0 opacity-0"
                        : "max-h-[600px] opacity-100",
                    )}
                  >
                    {cat.items.map((item) => (
                      <li
                        key={item.href}
                        className={collapsed ? "flex justify-center" : ""}
                      >
                        {collapsed ? (
                          <Tooltip>
                            <TooltipTrigger
                              render={<span className="inline-flex" />}
                            >
                              {renderNavLink(item)}
                            </TooltipTrigger>
                            <TooltipContent side="right" sideOffset={10}>
                              {item.label}
                              {item.badge ? ` · ${item.badge}` : ""}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          renderNavLink(item)
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </nav>

        {/* System status */}
        <div className="px-3">
          <div
            className={cn(
              "rounded-xl border border-sidebar-border bg-sidebar-accent/50 shadow-sm",
              collapsed ? "flex justify-center p-2.5" : "p-3.5",
            )}
          >
            <div className={cn("flex items-center", collapsed ? "" : "gap-2")}>
              <span className="relative flex size-2">
                <span className="pulse-dot absolute inline-flex size-2 rounded-full bg-success" />
                <span className="relative inline-flex size-2 rounded-full bg-success" />
              </span>
              {!collapsed && (
                <span className="text-xs font-semibold text-sidebar-foreground">
                  All systems operational
                </span>
              )}
            </div>
            {!collapsed && (
              <p className="mt-1.5 text-[11px] leading-4 text-sidebar-foreground/50">
                EMR synced · 3 wards live · updated 12s ago
              </p>
            )}
          </div>
        </div>

        {/* Utility links */}
        <div
          className={cn(
            "mt-2 flex flex-col gap-1 px-3",
            collapsed && "items-center",
          )}
        >
          {[
            { label: "Help & Support", icon: LifeBuoy },
            { label: "Settings", icon: Settings },
          ].map(({ label, icon: Icon }) =>
            collapsed ? (
              <Tooltip key={label}>
                <TooltipTrigger render={<span className="inline-flex" />}>
                  <button
                    type="button"
                    aria-label={label}
                    className="grid size-11 place-items-center rounded-xl text-sidebar-foreground/65 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                  >
                    <Icon className="size-[18px]" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  {label}
                </TooltipContent>
              </Tooltip>
            ) : (
              <button
                key={label}
                type="button"
                className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground/65 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
              >
                <Icon className="size-[18px] shrink-0" />
                <span>{label}</span>
              </button>
            ),
          )}
        </div>

        {/* Footer / user */}
        <div className="mt-2 border-t border-sidebar-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  className={cn(
                    "flex w-full items-center rounded-xl transition-colors hover:bg-sidebar-accent",
                    collapsed
                      ? "mx-auto size-11 justify-center"
                      : "gap-2.5 px-2 py-2",
                  )}
                />
              }
            >
              <Avatar className="size-9 shrink-0 ring-2 ring-primary/20">
                <AvatarFallback className="bg-gradient-to-br from-primary to-chart-2 text-[11px] font-semibold text-primary-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                <div className="flex min-w-0 flex-1 flex-col items-start">
                  <span className="truncate text-[13px] font-semibold leading-tight text-sidebar-foreground">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="truncate text-[11px] leading-tight text-sidebar-foreground/55">
                    {user?.roles}
                  </span>
                </div>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side={collapsed ? "right" : "top"}
              align="start"
              className="w-60"
            >
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.email}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <Settings className="size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                variant="destructive"
                className="gap-2"
              >
                <LogOut className="size-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>
    </>
  );
}
