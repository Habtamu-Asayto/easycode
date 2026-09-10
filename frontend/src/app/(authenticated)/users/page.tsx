"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/infrastructure/rbac/api";
import {
  DataPagination,
  SearchInput,
  ConfirmDialog,
  PageLoader,
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
import {
  Plus,
  MoreHorizontal,
  Pencil,
  Trash2,
  KeyRound,
  Unlock,
  ToggleLeft,
  Users,
  UserCheck,
  UserX,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import type { UserResponse } from "@/domain/rbac/entities";
import { UserFormDialog } from "./user-form-dialog";
import { ResetPasswordDialog } from "./reset-password-dialog";

export default function UsersPage() {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserResponse | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserResponse | null>(null);
  const [resetPwUser, setResetPwUser] = useState<UserResponse | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["users", page, limit, search],
    queryFn: () => usersApi.getAll({ page, limit, search }),
  });

  const stats = useMemo(() => {
    if (!data?.items) return { total: 0, active: 0, inactive: 0, locked: 0 };
    const users = data.items;
    return {
      total: data.meta?.total ?? users.length,
      active: users.filter((u) => u.isActive && !u.isLocked).length,
      inactive: users.filter((u) => !u.isActive).length,
      locked: users.filter((u) => u.isLocked).length,
    };
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersApi.delete(id),
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setDeleteUser(null);
    },
    onError: () => toast.error("Failed to delete user"),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: (id: string) => usersApi.toggleActive(id),
    onSuccess: () => {
      toast.success("User status updated");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Failed to update user status"),
  });

  const unlockMutation = useMutation({
    mutationFn: (id: string) => usersApi.unlock(id),
    onSuccess: () => {
      toast.success("User unlocked successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Failed to unlock user"),
  });

  const handleEdit = (user: UserResponse) => {
    setEditUser(user);
    setFormOpen(true);
  };

  const handleCreate = () => {
    setEditUser(null);
    setFormOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          User Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage system users and their roles
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Users",
            value: stats.total,
            icon: Users,
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
          },
          {
            label: "Active",
            value: stats.active,
            icon: UserCheck,
            iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
            iconColor: "text-emerald-600",
          },
          {
            label: "Inactive",
            value: stats.inactive,
            icon: UserX,
            iconBg: "bg-amber-50 dark:bg-amber-950/30",
            iconColor: "text-amber-600",
          },
          {
            label: "Locked",
            value: stats.locked,
            icon: Lock,
            iconBg: "bg-red-50 dark:bg-red-950/30",
            iconColor: "text-red-600",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-lg border bg-card p-4 flex items-center gap-4"
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
            >
              <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Command bar */}
      <div className="flex items-center gap-3">
        <PermissionGate permission="users:create">
          <Button size="sm" onClick={handleCreate} className="h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New User
          </Button>
        </PermissionGate>
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search by name or email..."
          className="w-72"
        />
        <span className="ml-auto text-xs text-muted-foreground">
          Showing {data?.items?.length ?? 0} of {stats.total} records
        </span>
      </div>

      {/* Content */}
      {isLoading ? (
        <PageLoader />
      ) : !data?.items?.length ? (
        <EmptyState
          icon={Users}
          title="No users found"
          description={
            search
              ? "Try a different search term"
              : "Get started by adding your first user"
          }
          action={
            hasPermission("users:create") ? (
              <Button size="sm" onClick={handleCreate}>
                <Plus className="mr-1.5 h-4 w-4" />
                New User
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="rounded-md border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="h-10 w-[250px] text-xs font-medium text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Email
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Roles
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Last Login
                  </TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((user) => (
                  <TableRow key={user.id} className="group hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                          {user.firstName[0]}
                          {user.lastName[0]}
                        </div>
                        <span className="text-[13px] font-medium text-foreground">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.roles?.map((r) => (
                          <Badge
                            key={r.id}
                            variant="outline"
                            className="text-[11px] font-normal"
                          >
                            {r.name.replace("_", " ")}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.isLocked ? (
                        <Badge variant="destructive" className="text-[11px]">
                          Locked
                        </Badge>
                      ) : user.isActive ? (
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 text-[11px] border border-emerald-200 dark:border-emerald-800">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[11px]">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {user.lastLoginAt
                        ? format(
                            new Date(user.lastLoginAt),
                            "MMM d, yyyy HH:mm",
                          )
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <PermissionGate permission="users:update">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                              />
                            }
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setResetPwUser(user)}
                            >
                              <KeyRound className="mr-2 h-4 w-4" />
                              Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                toggleActiveMutation.mutate(user.id)
                              }
                            >
                              <ToggleLeft className="mr-2 h-4 w-4" />
                              {user.isActive ? "Deactivate" : "Activate"}
                            </DropdownMenuItem>
                            {user.isLocked && (
                              <DropdownMenuItem
                                onClick={() => unlockMutation.mutate(user.id)}
                              >
                                <Unlock className="mr-2 h-4 w-4" />
                                Unlock Account
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <PermissionGate permission="users:delete">
                              <DropdownMenuItem
                                onClick={() => setDeleteUser(user)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </PermissionGate>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </PermissionGate>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {data.meta && (
            <DataPagination
              meta={data.meta}
              onPageChange={setPage}
              onLimitChange={(l) => {
                setLimit(l);
                setPage(1);
              }}
            />
          )}
        </div>
      )}

      {/* Dialogs */}
      <UserFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        user={editUser}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
          setFormOpen(false);
        }}
      />

      <ResetPasswordDialog
        open={!!resetPwUser}
        onOpenChange={(open) => !open && setResetPwUser(null)}
        user={resetPwUser}
      />

      <ConfirmDialog
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        title="Delete User"
        description={`Are you sure you want to delete "${deleteUser?.firstName} ${deleteUser?.lastName}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => deleteUser && deleteMutation.mutate(deleteUser.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
