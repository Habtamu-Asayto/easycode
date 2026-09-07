"use client";

import { useAuth } from "@/presentation/hooks/use-auth";
import { Badge } from "@/presentation/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/presentation/components/ui/avatar";
import { Settings, LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export function AppHeader() {
  const { user } = useAuth();

  const initials = user
    ? `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase()
    : "U";

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  return (
    <div className="flex justify-end items-center gap-4 border-b border-border bg-background px-4 py-2 relative">
      {/* Profile dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button className="flex items-center gap-2 rounded px-2 py-1 hover:bg-accent transition-colors" />
          }
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-[11px] font-semibold text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <span className="hidden text-[13px] font-medium text-foreground md:inline-block">
            {user?.firstName}
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
            <div className="mt-1 flex flex-wrap gap-1">
              {user?.roles?.map((role) => (
                <Badge
                  key={role}
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0"
                >
                  {role.replace("_", " ")}
                </Badge>
              ))}
            </div>
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            render={<Link href="/settings" />}
            className="flex items-center gap-2"
          >
            <User className="h-4 w-4" />
            Profile
          </DropdownMenuItem>

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
  );
}