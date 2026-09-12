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
            ? "from-primary/15 via-primary/10 to-chart-2/10 text-primary ring-primary/20 dark:from-primary/25 dark:via-primary/15 dark:to-chart-2/15 dark:text-primary-foreground dark:ring-primary/25 bg-gradient-to-br shadow-sm ring-1"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground",
        )}
      >
        {isActive && !collapsed && (
          <span className="bg-primary absolute top-1/2 left-0 h-5 w-1 -translate-y-1/2 rounded-r-full" />
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
                ? "bg-primary/20 text-primary ring-primary/25 dark:bg-primary/30 dark:text-primary-foreground ring-1"
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
          "bg-foreground/40 fixed inset-0 z-40 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      <aside
        className={cn(
          "border-sidebar-border bg-sidebar text-sidebar-foreground fixed inset-y-0 left-0 z-50 flex flex-col border-r transition-[transform,width] duration-300 ease-out lg:sticky lg:top-0 lg:z-auto lg:h-screen lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "w-[76px]" : "w-72",
        )}
      >
        {/* Brand */}
        <div
          className={cn(
            "border-sidebar-border flex h-16 shrink-0 items-center border-b",
            collapsed ? "justify-center px-2" : "gap-3 px-5",
          )}
        >
          <span className="from-primary to-chart-2 text-primary-foreground shadow-primary/25 grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br shadow-lg">
            <HeartPulse className="size-5" strokeWidth={2.2} />
          </span>

          {!collapsed && (
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="text-sidebar-foreground truncate text-sm font-bold tracking-[0.14em]">
                MEDICARE
              </span>
              <span className="text-sidebar-foreground/50 truncate text-[9px] font-medium tracking-[0.22em] uppercase">
                Clinic Operations
              </span>
            </div>
          )}

          {!collapsed && (
            <button
              onClick={onToggleCollapse}
              aria-label="Collapse sidebar"
              className="text-sidebar-foreground/55 hover:bg-sidebar-accent hover:text-sidebar-foreground hidden size-8 place-items-center rounded-lg transition-colors lg:grid"
            >
              <PanelLeftClose className="size-4" />
            </button>
          )}

          <button
            onClick={onMobileClose}
            aria-label="Close menu"
            className="text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground grid size-8 place-items-center rounded-lg transition-colors lg:hidden"
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
              className="text-sidebar-foreground/55 hover:bg-sidebar-accent hover:text-sidebar-foreground grid size-8 place-items-center rounded-lg transition-colors"
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
                        "flex w-full items-center px-3 pt-4 pb-1",
                        cat.collapsible ? "cursor-pointer" : "cursor-default",
                      )}
                    >
                      <span className="text-sidebar-foreground/40 flex-1 text-left text-[10px] font-semibold tracking-[0.18em] uppercase">
                        {cat.label}
                      </span>
                      {cat.collapsible && (
                        <ChevronRight
                          className={cn(
                            "text-sidebar-foreground/40 size-3.5 transition-transform duration-200",
                            !isCatCollapsed && "rotate-90",
                          )}
                        />
                      )}
                    </button>
                  )}

                  {collapsed && (
                    <div className="my-2 flex justify-center">
                      <span className="bg-sidebar-border h-px w-6 rounded-full" />
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
              "border-sidebar-border bg-sidebar-accent/50 rounded-xl border shadow-sm",
              collapsed ? "flex justify-center p-2.5" : "p-3.5",
            )}
          >
            <div className={cn("flex items-center", collapsed ? "" : "gap-2")}>
              <span className="relative flex size-2">
                <span className="pulse-dot bg-success absolute inline-flex size-2 rounded-full" />
                <span className="bg-success relative inline-flex size-2 rounded-full" />
              </span>
              {!collapsed && (
                <span className="text-sidebar-foreground text-xs font-semibold">
                  All systems operational
                </span>
              )}
            </div>
            {!collapsed && (
              <p className="text-sidebar-foreground/50 mt-1.5 text-[11px] leading-4">
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
            { label: "Help & Support", icon: LifeBuoy, href: "/help" },
            { label: "Settings", icon: Settings, href: "/settings" },
          ].map(({ label, icon: Icon, href }) =>
            collapsed ? (
              <Tooltip key={label}>
                <TooltipTrigger render={<span className="inline-flex" />}>
                  <Link
                    href={href}
                    aria-label={label}
                    className="text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground grid size-11 place-items-center rounded-xl transition-colors"
                  >
                    <Icon className="size-[18px]" />
                  </Link>
                </TooltipTrigger>

                <TooltipContent side="right" sideOffset={10}>
                  {label}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Link
                key={label}
                href={href}
                className="text-sidebar-foreground/65 hover:bg-sidebar-accent hover:text-sidebar-foreground flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors"
              >
                <Icon className="size-[18px] shrink-0" />
                <span>{label}</span>
              </Link>
            ),
          )}
        </div>

        {/* Footer / user */}
        <div className="border-sidebar-border mt-2 border-t p-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  className={cn(
                    "hover:bg-sidebar-accent flex w-full items-center rounded-xl transition-colors",
                    collapsed
                      ? "mx-auto size-11 justify-center"
                      : "gap-2.5 px-2 py-2",
                  )}
                />
              }
            >
              <Avatar className="ring-primary/20 size-9 shrink-0 ring-2">
                <AvatarFallback className="from-primary to-chart-2 text-primary-foreground bg-gradient-to-br text-[11px] font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {!collapsed && (
                <div className="flex min-w-0 flex-1 flex-col items-start">
                  <span className="text-sidebar-foreground truncate text-[13px] leading-tight font-semibold">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="text-sidebar-foreground/55 truncate text-[11px] leading-tight">
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
                <p className="text-muted-foreground truncate text-xs">
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
