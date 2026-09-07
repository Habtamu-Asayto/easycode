"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rolesApi } from "@/infrastructure/rbac/api";
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
  Shield,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Key,
} from "lucide-react";
import { toast } from "sonner";
import type { RoleResponse } from "@/domain/rbac/entities";
import { RoleFormDialog } from "./role-form-dialog";
import { RoleDetailDialog } from "./role-detail-dialog";

export default function RolesPage() {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editRole, setEditRole] = useState<RoleResponse | null>(null);
  const [deleteRole, setDeleteRole] = useState<RoleResponse | null>(null);
  const [viewRole, setViewRole] = useState<RoleResponse | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["roles", page, limit, search],
    queryFn: () => rolesApi.getAll({ page, limit, search }),
  });

  const stats = useMemo(() => {
    if (!data?.data) return { total: 0, system: 0, active: 0, totalPerms: 0 };
    const roles = data.data;
    return {
      total: data.meta?.total ?? roles.length,
      system: roles.filter((r) => r.isSystem).length,
      active: roles.filter((r) => r.isActive).length,
      totalPerms: roles.reduce(
        (sum, r) => sum + (r.permissions?.length ?? 0),
        0,
      ),
    };
  }, [data]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),
    onSuccess: () => {
      toast.success("Role deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setDeleteRole(null);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete role");
    },
  });

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Role Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Define roles and manage permission assignments
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Roles",
            value: stats.total,
            icon: Shield,
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
          },
          {
            label: "System Roles",
            value: stats.system,
            icon: ShieldCheck,
            iconBg: "bg-blue-50 dark:bg-blue-950/30",
            iconColor: "text-blue-600",
          },
          {
            label: "Active",
            value: stats.active,
            icon: ShieldAlert,
            iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
            iconColor: "text-emerald-600",
          },
          {
            label: "Total Permissions",
            value: stats.totalPerms,
            icon: Key,
            iconBg: "bg-violet-50 dark:bg-violet-950/30",
            iconColor: "text-violet-600",
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
        <PermissionGate permission="roles:create">
          <Button
            size="sm"
            onClick={() => {
              setEditRole(null);
              setFormOpen(true);
            }}
            className="h-8 gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            New Role
          </Button>
        </PermissionGate>
        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Search roles..."
          className="w-72"
        />
        <span className="ml-auto text-xs text-muted-foreground">
          Showing {data?.data?.length ?? 0} of {stats.total} records
        </span>
      </div>

      {/* Content */}
      {isLoading ? (
        <PageLoader />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Shield}
          title="No roles found"
          description={
            search
              ? "Try a different search term"
              : "Get started by creating your first role"
          }
          action={
            hasPermission("roles:create") ? (
              <Button
                size="sm"
                onClick={() => {
                  setEditRole(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="mr-1.5 h-4 w-4" />
                New Role
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
                  <TableHead className="h-10 w-[200px] text-xs font-medium text-muted-foreground">
                    Role Name
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Description
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Permissions
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Users
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((role) => (
                  <TableRow key={role.id} className="group hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-medium text-foreground">
                          {role.name.replace("_", " ")}
                        </span>
                        {role.isSystem && (
                          <Badge
                            variant="outline"
                            className="text-[10px] px-1.5 py-0"
                          >
                            System
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground max-w-[300px] truncate">
                      {role.description || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="text-[11px] font-normal"
                      >
                        {role.permissions?.length || 0} permissions
                      </Badge>
                    </TableCell>
                    <TableCell className="text-[13px] text-muted-foreground">
                      {role.userCount ?? 0}
                    </TableCell>
                    <TableCell>
                      {role.isActive ? (
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 text-[11px] border border-emerald-200 dark:border-emerald-800">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[11px]">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
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
                          <DropdownMenuItem onClick={() => setViewRole(role)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          {!role.isSystem && (
                            <>
                              <PermissionGate permission="roles:update">
                                <DropdownMenuItem
                                  onClick={() => {
                                    setEditRole(role);
                                    setFormOpen(true);
                                  }}
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit Role
                                </DropdownMenuItem>
                              </PermissionGate>
                              <DropdownMenuSeparator />
                              <PermissionGate permission="roles:delete">
                                <DropdownMenuItem
                                  onClick={() => setDeleteRole(role)}
                                  className="text-destructive focus:text-destructive"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete Role
                                </DropdownMenuItem>
                              </PermissionGate>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
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

      <RoleFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        role={editRole}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["roles"] });
          setFormOpen(false);
        }}
      />

      <RoleDetailDialog
        open={!!viewRole}
        onOpenChange={(open) => !open && setViewRole(null)}
        role={viewRole}
      />

      <ConfirmDialog
        open={!!deleteRole}
        onOpenChange={(open) => !open && setDeleteRole(null)}
        title="Delete Role"
        description={`Are you sure you want to delete the "${deleteRole?.name}" role? Users with this role will lose its permissions.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => deleteRole && deleteMutation.mutate(deleteRole.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
