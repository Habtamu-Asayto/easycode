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
      pathname === item.href || pathname.startsWith(`${item.href}/`);

    const Icon = item.icon;

    return (
      <Link
        href={item.href}
        className={cn(
          "relative flex items-center rounded transition-colors duration-100",
          isCollapsed ? "mx-auto h-11 w-11 justify-center" : "gap-3 px-3 py-2",
          isActive
            ? "bg-accent text-primary font-semibold"
            : "text-foreground/70 hover:bg-accent hover:text-foreground",
        )}
      >
        <Icon
          className={cn(
            "h-[18px] w-[18px] shrink-0",
            isActive ? "text-primary" : "text-muted-foreground",
          )}
        />

        {!isCollapsed && (
          <span className="truncate text-[13px]">{item.label}</span>
        )}
      </Link>
    );
  };

  return (
    <aside
      className={cn(
        "bg-sidebar border-sidebar-border flex h-full shrink-0 flex-col overflow-hidden border-r transition-[width] duration-200 ease-out",
        isCollapsed ? "w-[68px]" : "w-60",
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "border-sidebar-border flex h-12 shrink-0 items-center border-b",
          isCollapsed ? "justify-center px-2" : "gap-2.5 px-4",
        )}
      >
        {!isCollapsed ? (
          <>
            <div className="bg-primary flex h-7 w-7 shrink-0 items-center justify-center rounded">
              🌿
            </div>

            <span className="text-sidebar-foreground flex-1 truncate text-sm font-semibold tracking-tight">
              Ethiopian FMS
            </span>

            <button
              onClick={toggle}
              className="hover:bg-accent text-muted-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded transition-colors"
            >
              <PanelLeftClose className="h-4 w-4" />
            </button>
          </>
        ) : (
          <button
            onClick={toggle}
            className="hover:bg-accent text-muted-foreground flex h-8 w-8 items-center justify-center rounded transition-colors"
          >
            <PanelLeftOpen className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="fluent-scroll flex-1 overflow-y-auto py-2">
        <div className={cn("space-y-1", isCollapsed ? "px-2" : "px-3")}>
          {filteredCategories.map((cat) => {
            const isCatCollapsed = !!collapsedCategories[cat.label];
            const showHeader = cat.label !== "Main";

            return (
              <div key={cat.label}>
                {showHeader && !isCollapsed && (
                  <button
                    onClick={() => cat.collapsible && toggleCategory(cat.label)}
                    className={cn(
                      "flex w-full items-center px-3 pt-4 pb-1",
                      cat.collapsible && "group cursor-pointer",
                    )}
                  >
                    <span className="text-muted-foreground/70 flex-1 text-left text-[10px] font-semibold tracking-wider uppercase">
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
                          <TooltipTrigger render={<span className="block" />} />

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
      <div className="border-sidebar-border border-t p-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                className={cn(
                  "hover:bg-accent flex w-full items-center rounded transition-colors",
                  isCollapsed
                    ? "mx-auto h-10 w-10 justify-center"
                    : "gap-2.5 px-2 py-1.5",
                )}
              />
            }
          >
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {!isCollapsed && (
              <div className="flex min-w-0 flex-1 flex-col items-start">
                <span className="text-sidebar-foreground truncate text-[13px] leading-tight font-medium">
                  {user?.firstName} {user?.lastName}
                </span>

                <span className="text-muted-foreground truncate text-[11px] leading-tight">
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

              <p className="text-muted-foreground text-xs">{user?.email}</p>
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
