 
"use client";

import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { cn } from "@/shared/utils";
import { useAuth } from "@/presentation/hooks/use-auth";
import { useSidebarStore } from "@/shared/stores";

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

import { navCategories, NavItem } from "./NavCategories";

import { LogOut, PanelLeftClose, PanelLeftOpen, Settings } from "lucide-react";

export function AppSidebar() {
  const pathname = usePathname();

  const { user, hasPermission, isSuperAdmin } = useAuth();
  const { isCollapsed, toggle } = useSidebarStore();

  const [collapsedCategories, setCollapsedCategories] = useState<
    Record<string, boolean>
  >({});

  const toggleCategory = useCallback((label: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  }, []);

  const filteredCategories = useMemo(() => {
    return navCategories
      .map((cat) => ({
        ...cat,
        items: cat.items.filter((item) => {
          if (isSuperAdmin) return true;

          if (item.permission && !hasPermission(item.permission)) {
            return false;
          }

          return true;
        }),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [isSuperAdmin, hasPermission]);

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const renderNavLink = (item: NavItem) => {
    const isActive =
      pathname === item.href ||
      pathname.startsWith(`${item.href}/`);

    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        className={cn(
          "relative flex items-center rounded transition-colors duration-100",
          isCollapsed
            ? "justify-center w-11 h-11 mx-auto"
            : "gap-3 px-3 py-2",
          isActive
            ? "bg-accent text-primary font-semibold"
            : "text-foreground/70 hover:bg-accent hover:text-foreground",
        )}
      >
        <Icon
          className={cn(
            "shrink-0 h-[18px] w-[18px]",
            isActive ? "text-primary" : "text-muted-foreground",
          )}
        />

        {!isCollapsed && (
          <span className="text-[13px] truncate">
            {item.label}
          </span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col bg-sidebar border-r border-sidebar-border transition-[width] duration-200 ease-out overflow-hidden",
        isCollapsed ? "w-[68px]" : "w-60",
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex h-12 shrink-0 items-center border-b border-sidebar-border",
          isCollapsed ? "justify-center px-2" : "px-4 gap-2.5",
        )}
      >
        {!isCollapsed ? (
          <>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary">
              🌿
            </div>

            <span className="text-sm font-semibold tracking-tight text-sidebar-foreground truncate flex-1">
              Ethiopian FMS
            </span>

            <button
              onClick={toggle}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded hover:bg-accent text-muted-foreground transition-colors"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            onClick={toggle}
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-accent text-muted-foreground transition-colors"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto fluent-scroll py-2">
        <div className={cn("space-y-1", isCollapsed ? "px-2" : "px-3")}>
          {filteredCategories.map((cat) => {
            const isCatCollapsed = !!collapsedCategories[cat.label];
            const showHeader = cat.label !== "Main";

            return (
              <div key={cat.label}>
                {showHeader && !isCollapsed && (
                  <button
                    onClick={() =>
                      cat.collapsible && toggleCategory(cat.label)
                    }
                    className={cn(
                      "flex w-full items-center pt-4 pb-1 px-3",
                      cat.collapsible && "cursor-pointer group",
                    )}
                  >
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 flex-1 text-left">
                      {cat.label}
                    </span>

                    {cat.collapsible && (
                      <span
                        className={cn(
                          "transition-transform duration-200",
                          !isCatCollapsed && "rotate-90",
                        )}
                      ></span>
                    )}
                  </button>
                )}

                <ul
                  className={cn(
                    "space-y-0.5 overflow-hidden transition-all duration-200",
                    showHeader && isCatCollapsed && !isCollapsed
                      ? "max-h-0 opacity-0"
                      : "max-h-[1000px] opacity-100",
                  )}
                >
                  {cat.items.map((item) => (
                    <li key={item.href}>
                      {isCollapsed ? (
                        <Tooltip>
                          <TooltipTrigger
                            render={<span className="block" />}
                          />

                          <TooltipContent side="right" sideOffset={8}>
                            {item.label}
                          </TooltipContent>

                          {renderNavLink(item)}
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

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className={cn(
                  "flex w-full items-center rounded transition-colors hover:bg-accent",
                  isCollapsed
                    ? "justify-center w-10 h-10 mx-auto"
                    : "gap-2.5 px-2 py-1.5",
                )}
              />
            }
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>

            {!isCollapsed && (
              <div className="flex flex-col items-start min-w-0 flex-1">
                <span className="truncate text-[13px] font-medium text-sidebar-foreground leading-tight">
                  {user?.firstName} {user?.lastName}
                </span>

                <span className="truncate text-[11px] text-muted-foreground leading-tight">
                  {user?.email}
                </span>
              </div>
            )}
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side={isCollapsed ? "right" : "top"}
            align="start"
            className="w-56"
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">
                {user?.firstName} {user?.lastName}
              </p>

              <p className="text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              render={<Link href="/settings" />}
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-destructive focus:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
