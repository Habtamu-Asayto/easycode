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
    <header className="border-border/80 bg-background/85 sticky top-0 z-30 border-b backdrop-blur-xl">
      <div className="mx-auto flex min-h-[3.95rem] w-full items-center gap-3 px-4 sm:gap-4 sm:px-7">
        {/* Mobile / Sidebar menu */}
        <button
          type="button"
          onClick={onMenu}
          aria-label="Open navigation"
          className="border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground grid size-10 shrink-0 place-items-center rounded-xl border transition-colors lg:hidden"
        >
          <Menu className="size-4" />
        </button>
        {/* Search */}
        <label className="relative ml-auto flex max-w-xl min-w-0 flex-1 items-center md:ml-4">
          <Search className="text-muted-foreground pointer-events-none absolute left-3.5 size-4" />
          <input
            type="search"
            placeholder="Search patients, doctors, records..."
            aria-label="Search patients, doctors, records"
            className="border-border bg-card text-foreground placeholder:text-muted-foreground/70 hover:border-primary/30 focus:border-primary focus:ring-primary/10 h-11 w-full rounded-xl border pr-14 pl-10 text-sm transition-all outline-none focus:ring-4"
          />
          <kbd className="border-border bg-muted text-muted-foreground absolute right-3 hidden rounded-md border px-1.5 py-0.5 font-mono text-[10px] sm:inline">
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
            className="border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground grid size-11 place-items-center rounded-xl border transition-colors"
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
              className="border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground relative grid size-11 place-items-center rounded-xl border transition-colors"
            >
              <Bell className="size-4" />
              <span className="bg-destructive ring-card absolute top-2.5 right-2.5 size-2 rounded-full ring-2" />
            </button>
            {notificationsOpen && (
              <div className="border-border bg-popover text-popover-foreground absolute top-14 right-0 w-72 rounded-2xl border p-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Notifications</p>
                  <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[10px] font-semibold">
                    3 new
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  <div className="bg-muted/60 rounded-xl p-3">
                    <p className="text-xs font-medium"> Patient update </p>
                    <p className="text-muted-foreground mt-1 text-[11px] leading-4">
                      A patient record needs your attention.
                    </p>
                  </div>
                  <div className="bg-muted/60 rounded-xl p-3">
                    <p className="text-xs font-medium">Appointment reminder</p>
                    <p className="text-muted-foreground mt-1 text-[11px] leading-4">
                      You have an upcoming appointment.
                    </p>
                  </div>
                  <div className="bg-muted/60 rounded-xl p-3">
                    <p className="text-xs font-medium"> System update </p>
                    <p className="text-muted-foreground mt-1 text-[11px] leading-4">
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
                "border-border bg-card flex items-center gap-2 rounded-xl border p-1.5 pr-2.5 transition-colors",
                "hover:border-primary/30",
                profileOpen && "border-primary/40",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary text-[11px] font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-foreground hidden text-[13px] font-medium md:inline-block">
                {user?.firstName}
              </span>
              <ChevronDown className="text-muted-foreground hidden size-3.5 lg:block" />
            </button>
            {profileOpen && (
              <div className="border-border bg-popover text-popover-foreground absolute top-14 right-0 w-56 rounded-2xl border p-2 shadow-xl">
                <div className="rounded-xl px-3 py-2">
                  <p className="text-sm font-semibold">{user?.firstName}</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    {user?.roles}
                  </p>
                </div>
                <div className="bg-border my-1 h-px" />
                <button
                  type="button"
                  className="hover:bg-muted w-full rounded-lg px-3 py-2 text-left text-sm transition-colors"
                >
                  Account settings
                </button>
                <button
                  type="button"
                  className="hover:bg-muted w-full rounded-lg px-3 py-2 text-left text-sm transition-colors"
                >
                  Profile
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-destructive hover:bg-destructive/10 w-full rounded-lg px-3 py-2 text-left text-sm transition-colors"
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
