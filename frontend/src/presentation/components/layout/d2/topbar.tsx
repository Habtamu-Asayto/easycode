"use client";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, Menu, Moon, Plus, Search, Sun } from "lucide-react";
import { useAuth } from "@/presentation/hooks";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback } from "../../ui/avatar";

export function Topbar({
  onMenu,
  theme,
  onToggleTheme,
}: {
  onMenu: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
}) {
  const { user } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(target)
      ) {
        setNotificationsOpen(false);
      }

      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border/80 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex  min-h-[3.95rem] w-full items-center gap-3 px-4 sm:gap-4 sm:px-7">
        {/* Mobile / Sidebar menu */}
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground lg:hidden"
        >
          <Menu className="size-4" />
        </button>
        {/* Search */}
        <label className="relative ml-auto flex min-w-0 max-w-xl flex-1 items-center md:ml-4">
          <Search className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search patients, doctors, records..."
            aria-label="Search patients, doctors, records"
            className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-14 text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/70 hover:border-primary/30 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
          <kbd className="absolute right-3 hidden rounded-md border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            ⌘K
          </kbd>
        </label>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Theme */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="grid size-11 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </button>

          {/* Notifications */}
          <div ref={notificationsRef} className="relative">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => {
                setNotificationsOpen((value) => !value);
                setProfileOpen(false);
              }}
              className="relative grid size-11 place-items-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              <Bell className="size-4" />
              <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-destructive ring-2 ring-card" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-14 w-72 rounded-2xl border border-border bg-popover p-4 text-popover-foreground shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Notifications</p>
                  <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    3 new
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="text-xs font-medium"> Patient update </p>
                    <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                      A patient record needs your attention.
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="text-xs font-medium">Appointment reminder</p>
                    <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                      You have an upcoming appointment.
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-3">
                    <p className="text-xs font-medium"> System update </p>
                    <p className="mt-1 text-[11px] leading-4 text-muted-foreground">
                      EMR synchronization completed successfully.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div ref={profileRef} className="relative">
            <button
              type="button"
              aria-label="Account menu"
              aria-expanded={profileOpen}
              onClick={() => {
                setProfileOpen((value) => !value);
                setNotificationsOpen(false);
              }}
              className={[
                "flex items-center gap-2 rounded-xl border border-border bg-card p-1.5 pr-2.5 transition-colors",
                "hover:border-primary/30",
                profileOpen && "border-primary/40",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-[13px] font-medium text-foreground md:inline-block">
                {user?.firstName}
              </span>
              <ChevronDown className="hidden size-3.5 text-muted-foreground lg:block" />
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-14 w-56 rounded-2xl border border-border bg-popover p-2 text-popover-foreground shadow-xl">
                <div className="rounded-xl px-3 py-2">
                  <p className="text-sm font-semibold">{ user?.firstName }</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    { user?.roles }
                  </p>
                </div>
                <div className="my-1 h-px bg-border" />
                <button
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                >
                  Account settings
                </button>
                <button
                  type="button"
                  className="w-full rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full rounded-lg px-3 py-2 text-left text-sm text-destructive transition-colors hover:bg-destructive/10"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
