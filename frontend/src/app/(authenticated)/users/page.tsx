"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  KeyRound,
  Lock,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Unlock,
  UserCheck,
  UserCog,
  UserX,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import { usersApi } from "@/infrastructure/rbac/api";

import {
  DataPagination,
  SearchInput,
  ConfirmDialog,
  PageLoader2,
  EmptyState,
} from "@/presentation/components/shared";

import { useAuth } from "@/presentation/hooks";
import { PermissionGate } from "@/presentation/guards";

import { Button } from "@/presentation/components/ui/button";
import { Badge } from "@/presentation/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";

import type { UserResponse } from "@/domain/rbac/entities";

// import { UserFormDialog } from "./user-form-dialog";
import { UserFormDialog } from "../../../presentation/components/shared/rbac/user-form-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function getErrorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object" && "response" in error) {
    const response = (
      error as {
        response?: {
          data?: {
            message?: string | string[];
          };
        };
      }
    ).response;

    const message = response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

function getFullName(user: UserResponse) {
  return `${user.firstName} ${user.lastName}`.trim();
}

function getInitials(user: UserResponse) {
  return `${user.firstName?.charAt(0) ?? ""}${
    user.lastName?.charAt(0) ?? ""
  }`.toUpperCase();
}

function formatRoleName(role: string) {
  return role.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function getGeography(user: UserResponse) {
  const parts = [
    user.kebele?.name,
    user.woreda?.name,
    user.zone?.name,
    user.region?.name,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : null;
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  /* ------------------------------------------------------------------------ */
  /* State                                                                    */
  /* ------------------------------------------------------------------------ */

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserResponse | null>(null);

  const [deleteUser, setDeleteUser] = useState<UserResponse | null>(null);

  const [resetPwUser, setResetPwUser] = useState<UserResponse | null>(null);

  /* ------------------------------------------------------------------------ */
  /* Permissions                                                              */
  /* ------------------------------------------------------------------------ */

  const canCreate = hasPermission("users:create");
  const canUpdate = hasPermission("users:update");
  const canDelete = hasPermission("users:delete");

  /* ------------------------------------------------------------------------ */
  /* Users query                                                              */
  /* ------------------------------------------------------------------------ */

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: ["users", page, limit, search],

    queryFn: () =>
      usersApi.getAll({
        page,
        limit,
        search,
      }),

    placeholderData: (previousData) => previousData,
  });

  const users = data?.items ?? [];

  const totalUsers = data?.meta?.total ?? users.length;

  /* ------------------------------------------------------------------------ */
  /* Statistics                                                               */
  /* ------------------------------------------------------------------------ */

  const stats = useMemo(() => {
    const active = users.filter(
      (user) => user.isActive && !user.isLocked,
    ).length;

    const inactive = users.filter((user) => !user.isActive).length;

    const locked = users.filter((user) => user.isLocked).length;

    const withRoles = users.filter((user) => user.roles?.length).length;

    return {
      total: totalUsers,
      active,
      inactive,
      locked,
      withRoles,
    };
  }, [users, totalUsers]);

  /* ------------------------------------------------------------------------ */
  /* Delete                                                                   */
  /* ------------------------------------------------------------------------ */

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),

    onSuccess: () => {
      toast.success("User deleted successfully");

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      setDeleteUser(null);
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to delete user"));
    },
  });

  /* ------------------------------------------------------------------------ */
  /* Activate / Deactivate                                                    */
  /* ------------------------------------------------------------------------ */

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => usersApi.toggleActive(id),

    onSuccess: (_, id) => {
      const user = users.find((item) => item.id === id);

      toast.success(
        user?.isActive
          ? "User deactivated successfully"
          : "User activated successfully",
      );

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to update user status"));
    },
  });

  /* ------------------------------------------------------------------------ */
  /* Unlock                                                                   */
  /* ------------------------------------------------------------------------ */

  const unlockMutation = useMutation({
    mutationFn: (id: string) => usersApi.unlock(id),

    onSuccess: () => {
      toast.success("User account unlocked successfully");

      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, "Failed to unlock user account"));
    },
  });

  /* ------------------------------------------------------------------------ */
  /* Handlers                                                                 */
  /* ------------------------------------------------------------------------ */

  const handleCreate = () => {
    setEditUser(null);
    setFormOpen(true);
  };

  const handleEdit = (user: UserResponse) => {
    setEditUser(user);
    setFormOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRefresh = async () => {
    await refetch();
    toast.success("Users refreshed");
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: ["users"],
    });

    setFormOpen(false);
    setEditUser(null);
  };

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="bg-background text-foreground min-h-full">
      <div className="mx-auto w-full max-w-[1600px] space-y-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ================================================================== */}
        {/* Header                                                             */}
        {/* ================================================================== */}

        <section className="border-border/70 bg-card relative overflow-hidden rounded-2xl border shadow-sm">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="bg-primary/5 absolute -top-28 -right-24 size-72 rounded-full blur-3xl" />

            <div className="bg-primary/5 absolute -bottom-28 -left-24 size-72 rounded-full blur-3xl" />

            <div className="bg-primary/[0.025] absolute top-1/2 right-1/3 size-32 rounded-full blur-2xl" />
          </div>

          <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
            <div className="flex min-w-0 items-start gap-4">
              <div className="border-primary/15 bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm">
                <Users className="size-6" />
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase">
                    Management
                  </span>

                  <ChevronRight className="text-muted-foreground size-3.5" />

                  <span className="text-muted-foreground text-xs">Users</span>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  User Management
                </h1>

                <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm leading-6">
                  Manage users, roles, account status, security, and
                  geographical assignments from one place.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isFetching}
                className="h-9 gap-2 rounded-lg"
              >
                <RefreshCw
                  className={`size-3.5 ${isFetching ? "animate-spin" : ""}`}
                />

                <span className="hidden sm:inline">Refresh</span>
              </Button>

              {canCreate && (
                <PermissionGate permission="users:create">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreate}
                    className="h-9 gap-2 rounded-lg shadow-sm"
                  >
                    <Plus className="size-4" />
                    New User
                  </Button>
                </PermissionGate>
              )}
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* Statistics                                                         */}
        {/* ================================================================== */}

        <section
          aria-label="User statistics"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          {/* Total */}
          <div className="group border-border/70 bg-card relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="bg-primary/5 absolute -top-8 -right-8 size-24 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-medium">
                  Total Users
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {stats.total.toLocaleString()}
                </p>

                <div className="text-muted-foreground mt-3 flex items-center gap-1.5 text-[11px]">
                  <Users className="text-primary size-3.5" />
                  <span>Registered accounts</span>
                </div>
              </div>

              <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105">
                <Users className="size-5" />
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="group border-border/70 bg-card relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute -top-8 -right-8 size-24 rounded-full bg-emerald-500/5 blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-medium">
                  Active Users
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {stats.active.toLocaleString()}
                </p>

                <div className="text-muted-foreground mt-3 flex items-center gap-1.5 text-[11px]">
                  <CheckCircle2 className="size-3.5 text-emerald-500" />
                  <span>Ready to access</span>
                </div>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-transform duration-300 group-hover:scale-105 dark:text-emerald-400">
                <UserCheck className="size-5" />
              </div>
            </div>
          </div>

          {/* Inactive */}
          <div className="group border-border/70 bg-card relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="absolute -top-8 -right-8 size-24 rounded-full bg-amber-500/5 blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-medium">
                  Inactive Users
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {stats.inactive.toLocaleString()}
                </p>

                <div className="text-muted-foreground mt-3 flex items-center gap-1.5 text-[11px]">
                  <UserX className="size-3.5 text-amber-500" />
                  <span>Access disabled</span>
                </div>
              </div>

              <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 transition-transform duration-300 group-hover:scale-105 dark:text-amber-400">
                <UserX className="size-5" />
              </div>
            </div>
          </div>

          {/* Locked */}
          <div className="group border-border/70 bg-card relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
            <div className="bg-destructive/5 absolute -top-8 -right-8 size-24 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150" />

            <div className="relative flex items-start justify-between">
              <div>
                <p className="text-muted-foreground text-xs font-medium">
                  Locked Accounts
                </p>

                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {stats.locked.toLocaleString()}
                </p>

                <div className="text-muted-foreground mt-3 flex items-center gap-1.5 text-[11px]">
                  <Lock className="text-destructive size-3.5" />
                  <span>Security attention</span>
                </div>
              </div>

              <div className="bg-destructive/10 text-destructive flex size-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-105">
                <Lock className="size-5" />
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================== */}
        {/* Main Records                                                       */}
        {/* ================================================================== */}

        <section className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-sm">
          {/* Section header */}
          <div className="border-border/70 border-b px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="text-primary size-4" />

                  <h2 className="text-base font-semibold">User accounts</h2>
                </div>

                <p className="text-muted-foreground mt-1 text-xs">
                  Search, manage, secure, and maintain system users.
                </p>
              </div>

              <div className="text-muted-foreground flex items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-500" />
                  System operational
                </span>

                {isFetching && (
                  <>
                    <span className="text-border">•</span>

                    <span className="text-primary inline-flex items-center gap-1.5">
                      <RefreshCw className="size-3 animate-spin" />
                      Updating
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Toolbar */}
          <div className="border-border/70 bg-muted/20 border-b px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full lg:max-w-md">
                <SearchInput
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search users by name, username or email..."
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div className="border-border/70 bg-background text-muted-foreground hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs sm:flex">
                  <Search className="size-3.5" />

                  <span>{search ? `Searching "${search}"` : "All users"}</span>
                </div>

                <div className="border-border/70 bg-background inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs">
                  <span className="text-foreground font-semibold">
                    {users.length}
                  </span>

                  <span className="text-muted-foreground">of {totalUsers}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ================================================================= */}
          {/* Loading / Error / Empty                                           */}
          {/* ================================================================= */}

          {isLoading ? (
            <div className="min-h-[420px]">
              <PageLoader2 />
            </div>
          ) : isError ? (
            <div className="flex min-h-[420px] flex-col items-center justify-center px-6 text-center">
              <div className="bg-destructive/10 text-destructive flex size-14 items-center justify-center rounded-2xl">
                <CircleAlert className="size-7" />
              </div>

              <h3 className="mt-5 text-base font-semibold">
                Unable to load users
              </h3>

              <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
                {getErrorMessage(
                  error,
                  "Something went wrong while loading user accounts.",
                )}
              </p>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-5 gap-2"
              >
                <RefreshCw className="size-4" />
                Try again
              </Button>
            </div>
          ) : !users.length ? (
            <div className="min-h-[420px]">
              <EmptyState
                icon={Users}
                title="No users found"
                description={
                  search
                    ? "Try a different search term or clear the search."
                    : "Get started by adding your first system user."
                }
                action={
                  canCreate ? (
                    <PermissionGate permission="users:create">
                      <Button
                        size="sm"
                        onClick={handleCreate}
                        className="gap-2"
                      >
                        <Plus className="size-4" />
                        New User
                      </Button>
                    </PermissionGate>
                  ) : undefined
                }
              />
            </div>
          ) : (
            <>
              {/* ============================================================= */}
              {/* Table                                                         */}
              {/* ============================================================= */}

              <div className="relative overflow-x-auto">
                {isFetching && !isLoading && (
                  <div className="bg-primary/10 absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden">
                    <div className="bg-primary h-full w-1/3 animate-[loading_1.2s_ease-in-out_infinite]" />
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow className="border-border/70 bg-muted/30 hover:bg-muted/30">
                      <TableHead className="text-muted-foreground h-11 min-w-[260px] px-5 text-[10px] font-bold tracking-[0.14em] uppercase">
                        User
                      </TableHead>

                      <TableHead className="text-muted-foreground h-11 min-w-[230px] px-5 text-[10px] font-bold tracking-[0.14em] uppercase">
                        Contact
                      </TableHead>

                      <TableHead className="text-muted-foreground h-11 min-w-[180px] px-5 text-[10px] font-bold tracking-[0.14em] uppercase">
                        Roles
                      </TableHead>

                      <TableHead className="text-muted-foreground h-11 min-w-[230px] px-5 text-[10px] font-bold tracking-[0.14em] uppercase">
                        Geography
                      </TableHead>

                      <TableHead className="text-muted-foreground h-11 min-w-[120px] px-5 text-[10px] font-bold tracking-[0.14em] uppercase">
                        Status
                      </TableHead>

                      <TableHead className="text-muted-foreground h-11 min-w-[150px] px-5 text-[10px] font-bold tracking-[0.14em] uppercase">
                        Last Login
                      </TableHead>

                      <TableHead className="w-[56px] px-3" />
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {users.map((user, index) => {
                      const geography = getGeography(user);

                      return (
                        <TableRow
                          key={user.id}
                          className="group border-border/60 hover:bg-primary/[0.025] transition-all duration-200"
                          style={{
                            animationDelay: `${index * 35}ms`,
                          }}
                        >
                          {/* ------------------------------------------------- */}
                          {/* User                                              */}
                          {/* ------------------------------------------------- */}

                          <TableCell className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative shrink-0">
                                <div className="border-primary/15 bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl border text-xs font-bold shadow-sm transition-transform duration-200 group-hover:scale-105">
                                  {getInitials(user)}
                                </div>

                                {user.isActive && !user.isLocked && (
                                  <span className="border-card absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-emerald-500" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <div
                                  onClick={() => handleEdit(user)}
                                  className="group text-foreground hover:text-primary w-fit max-w-full cursor-pointer truncate text-sm font-semibold transition-colors duration-200"
                                >
                                  <span className="relative">
                                    {getFullName(user)}
                                    <span className="bg-primary absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-200 group-hover:w-full" />
                                  </span>
                                </div>

                                <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 text-xs">
                                  <UserCog className="size-3" />

                                  <span className="truncate">
                                    @{user.username}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </TableCell>

                          {/* ------------------------------------------------- */}
                          {/* Contact                                           */}
                          {/* ------------------------------------------------- */}

                          <TableCell className="px-5 py-4">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 text-xs">
                                <Mail className="text-muted-foreground size-3.5 shrink-0" />

                                <span className="truncate">{user.email}</span>
                              </div>

                              {user.mobileNumber ? (
                                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                  <Phone className="size-3.5 shrink-0" />

                                  <span>{user.mobileNumber}</span>
                                </div>
                              ) : (
                                <div className="text-muted-foreground/60 text-[11px]">
                                  No mobile number
                                </div>
                              )}
                            </div>
                          </TableCell>

                          {/* ------------------------------------------------- */}
                          {/* Roles                                             */}
                          {/* ------------------------------------------------- */}

                          <TableCell className="px-5 py-4">
                            {user.roles?.length ? (
                              <div className="flex max-w-[240px] flex-wrap gap-1.5">
                                {user.roles.slice(0, 2).map((role) => (
                                  <Badge
                                    key={role.id}
                                    variant="secondary"
                                    className="rounded-md px-2 py-1 text-[10px] font-semibold"
                                  >
                                    <ShieldCheck className="mr-1 size-3" />

                                    {formatRoleName(role.name)}
                                  </Badge>
                                ))}

                                {user.roles.length > 2 && (
                                  <Badge
                                    variant="outline"
                                    className="rounded-md px-2 py-1 text-[10px]"
                                  >
                                    +{user.roles.length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground/60 text-xs">
                                No roles assigned
                              </span>
                            )}
                          </TableCell>

                          {/* ------------------------------------------------- */}
                          {/* Geography                                         */}
                          {/* ------------------------------------------------- */}

                          <TableCell className="px-5 py-4">
                            <div className="flex max-w-[260px] items-start gap-2">
                              <MapPin className="text-muted-foreground mt-0.5 size-3.5 shrink-0" />

                              {geography ? (
                                <span
                                  title={geography}
                                  className="text-muted-foreground line-clamp-2 text-xs leading-5"
                                >
                                  {geography}
                                </span>
                              ) : (
                                <span className="text-muted-foreground/60 text-xs">
                                  Not assigned
                                </span>
                              )}
                            </div>
                          </TableCell>

                          {/* ------------------------------------------------- */}
                          {/* Status                                            */}
                          {/* ------------------------------------------------- */}

                          <TableCell className="px-5 py-4">
                            {user.isLocked ? (
                              <Badge
                                variant="destructive"
                                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                              >
                                <Lock className="size-3" />
                                Locked
                              </Badge>
                            ) : user.isActive ? (
                              <Badge className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/30">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                Active
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold"
                              >
                                <span className="bg-muted-foreground/50 size-1.5 rounded-full" />
                                Inactive
                              </Badge>
                            )}
                          </TableCell>

                          {/* ------------------------------------------------- */}
                          {/* Last Login                                        */}
                          {/* ------------------------------------------------- */}

                          <TableCell className="px-5 py-4">
                            {user.lastLoginAt ? (
                              <div className="space-y-0.5">
                                <div className="text-xs font-medium">
                                  {format(
                                    new Date(user.lastLoginAt),
                                    "MMM d, yyyy",
                                  )}
                                </div>

                                <div className="text-muted-foreground flex items-center gap-1.5 text-[11px]">
                                  <Clock3 className="size-3" />

                                  {format(new Date(user.lastLoginAt), "HH:mm")}
                                </div>
                              </div>
                            ) : (
                              <span className="text-muted-foreground/60 text-xs">
                                Never
                              </span>
                            )}
                          </TableCell>

                          {/* ------------------------------------------------- */}
                          {/* Actions                                           */}
                          {/* ------------------------------------------------- */}

                          <TableCell className="px-3 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="hover:bg-muted size-8 rounded-lg opacity-60 transition-all duration-200 group-hover:opacity-100 hover:opacity-100"
                                    aria-label={`Actions for ${getFullName(user)}`}
                                  />
                                }
                              >
                                <MoreHorizontal className="size-4" />
                              </DropdownMenuTrigger>

                              <DropdownMenuContent
                                align="end"
                                className="w-52 rounded-xl"
                              >
                                {/* Edit */}
                                {canUpdate && (
                                  <PermissionGate permission="users:update">
                                    <DropdownMenuItem
                                      onClick={() => handleEdit(user)}
                                      className="gap-2 rounded-lg"
                                    >
                                      <Pencil className="size-3.5" />
                                      Edit User
                                    </DropdownMenuItem>
                                  </PermissionGate>
                                )}

                                {/* Reset password */}
                                {canUpdate && (
                                  <PermissionGate permission="users:update">
                                    <DropdownMenuItem
                                      onClick={() => setResetPwUser(user)}
                                      className="gap-2 rounded-lg"
                                    >
                                      <KeyRound className="size-3.5" />
                                      Reset Password
                                    </DropdownMenuItem>
                                  </PermissionGate>
                                )}

                                {canUpdate && <DropdownMenuSeparator />}

                                {/* Activate / deactivate */}
                                {canUpdate && (
                                  <PermissionGate permission="users:update">
                                    <DropdownMenuItem
                                      disabled={toggleActiveMutation.isPending}
                                      onClick={() =>
                                        toggleActiveMutation.mutate(user.id)
                                      }
                                      className="gap-2 rounded-lg"
                                    >
                                      {user.isActive ? (
                                        <>
                                          <UserX className="size-3.5" />
                                          Deactivate User
                                        </>
                                      ) : (
                                        <>
                                          <UserCheck className="size-3.5" />
                                          Activate User
                                        </>
                                      )}
                                    </DropdownMenuItem>
                                  </PermissionGate>
                                )}

                                {/* Unlock */}
                                {canUpdate && user.isLocked && (
                                  <PermissionGate permission="users:update">
                                    <DropdownMenuItem
                                      disabled={unlockMutation.isPending}
                                      onClick={() =>
                                        unlockMutation.mutate(user.id)
                                      }
                                      className="gap-2 rounded-lg"
                                    >
                                      <Unlock className="size-3.5" />
                                      Unlock Account
                                    </DropdownMenuItem>
                                  </PermissionGate>
                                )}

                                {/* Delete */}
                                {canDelete && (
                                  <>
                                    <DropdownMenuSeparator />

                                    <PermissionGate permission="users:delete">
                                      <DropdownMenuItem
                                        onClick={() => setDeleteUser(user)}
                                        className="text-destructive focus:text-destructive gap-2 rounded-lg"
                                      >
                                        <Trash2 className="size-3.5" />
                                        Delete User
                                      </DropdownMenuItem>
                                    </PermissionGate>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* ============================================================= */}
              {/* Footer                                                         */}
              {/* ============================================================= */}

              <div className="border-border/70 bg-muted/[0.12] border-t">
                <div className="flex flex-col gap-3 px-4 py-3 sm:px-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />

                      <span>
                        Showing{" "}
                        <strong className="text-foreground font-semibold">
                          {users.length}
                        </strong>{" "}
                        of{" "}
                        <strong className="text-foreground font-semibold">
                          {totalUsers}
                        </strong>{" "}
                        users
                      </span>
                    </div>

                    <div className="text-muted-foreground hidden items-center gap-1.5 text-[11px] md:flex">
                      <Clock3 className="size-3.5" />
                      Live data
                    </div>
                  </div>

                  {data?.meta && (
                    <DataPagination
                      meta={data.meta}
                      onPageChange={setPage}
                      onLimitChange={(newLimit) => {
                        setLimit(newLimit);
                        setPage(1);
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </section>
      </div>

      {/* ==================================================================== */}
      {/* User Form                                                            */}
      {/* ==================================================================== */}

      <UserFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);

          if (!open) {
            setEditUser(null);
          }
        }}
        user={editUser}
        onSuccess={handleFormSuccess}
      />

      {/* ==================================================================== */}
      {/* Reset Password                                                       */}
      {/* ==================================================================== */}

      <ResetPasswordDialog
        open={!!resetPwUser}
        onOpenChange={(open) => {
          if (!open) {
            setResetPwUser(null);
          }
        }}
        user={resetPwUser}
      />

      {/* ==================================================================== */}
      {/* Delete Confirmation                                                  */}
      {/* ==================================================================== */}

      <ConfirmDialog
        open={!!deleteUser}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteUser(null);
          }
        }}
        title="Delete User"
        description={
          deleteUser
            ? `Are you sure you want to permanently delete "${getFullName(
                deleteUser,
              )}"? This action cannot be undone.`
            : "Are you sure you want to delete this user?"
        }
        confirmLabel="Delete User"
        variant="destructive"
        onConfirm={() => {
          if (deleteUser) {
            deleteMutation.mutate(deleteUser.id);
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
