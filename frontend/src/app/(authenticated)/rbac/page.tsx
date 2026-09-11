"use client";
import {
  Activity,
  AlertTriangle,
  Check,
  ChevronRight,
  Database,
  Download,
  Eye,
  FileKey2,
  Filter,
  ListFilter,
  LockKeyhole,
  Save,
  Search,
  UserRoundCheck,
  Users,
  X,
  MoreHorizontal,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import {
  SearchInput,
  PageLoader,
  EmptyState,
} from "@/presentation/components/shared";

import { Badge } from "@/presentation/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { rolesApi, permissionsApi, auditApi } from "@/infrastructure/rbac/api";

import type {
  CreatePermissionRequest,
  PermissionResponse,
  RoleResponse,
} from "@/domain/rbac/entities";

import { Button } from "@/presentation/components/ui/button";
import { RoleFormDialog } from "./role-form-dialog";
import { PermissionDialog } from "./permision-dialog-form";

const ROLE_COLORS = [
  "blue",
  "violet",
  "amber",
  "emerald",
  "rose",
  "cyan",
] as const;

type RoleColor = (typeof ROLE_COLORS)[number];

function getRoleColor(index: number): RoleColor {
  return ROLE_COLORS[index % ROLE_COLORS.length];
}

function getInitials(role: RoleResponse) {
  return role.name.slice(0, 2).toUpperCase();
}

function formatAction(action: string) {
  return action
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function RolesPage() {
  const queryClient = useQueryClient();

  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [pendingPermissionIds, setPendingPermissionIds] = useState<string[]>(
    [],
  );
  const [savedPermissionIds, setSavedPermissionIds] = useState<string[]>([]);

  const [query, setQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState("all");
  const [expanded, setExpanded] = useState<string[]>([]);
  const [compare, setCompare] = useState(false);
  const [compareRoleId, setCompareRoleId] = useState<string | null>(null);

  const [showAddPermission, setShowAddPermission] = useState(false);
  const [notice, setNotice] = useState("");

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleResponse | null>(null);

  const [roleActionError, setRoleActionError] = useState("");
  const [roleActionSuccess, setRoleActionSuccess] = useState("");
  function openCreateRoleDialog() {
    setEditingRole(null);
    setRoleActionError("");
    setRoleDialogOpen(true);
  }

  function openEditRoleDialog(role: RoleResponse) {
    setEditingRole(role);
    setRoleActionError("");
    setRoleDialogOpen(true);
  }

  const toggleRoleMutation = useMutation({
    mutationFn: async (role: RoleResponse) => {
      return rolesApi.update(role.id, {
        isActive: !role.isActive,
      });
    },

    onSuccess: async (_, role) => {
      await queryClient.invalidateQueries({
        queryKey: ["roles", "all"],
      });

      setRoleActionSuccess(
        `${role.name} has been ${role.isActive ? "deactivated" : "activated"}.`,
      );

      setRoleActionError("");
    },

    onError: (error: unknown) => {
      setRoleActionSuccess("");

      setRoleActionError(
        error instanceof Error
          ? error.message
          : "Failed to update role status.",
      );
    },
  });

  const deleteRoleMutation = useMutation({
    mutationFn: (roleId: string) => rolesApi.delete(roleId),

    onSuccess: async (_, roleId) => {
      await queryClient.invalidateQueries({
        queryKey: ["roles", "all"],
      });

      setRoleActionSuccess("Role deleted successfully.");
      setRoleActionError("");

      if (selectedRoleId === roleId) {
        setSelectedRoleId(null);
      }
    },

    onError: (error: unknown) => {
      setRoleActionSuccess("");

      setRoleActionError(
        error instanceof Error ? error.message : "Failed to delete role.",
      );
    },
  });

  function handleDeleteRole(role: RoleResponse) {
    if (role.isSystem) {
      setRoleActionError(
        `"${role.name}" is a system role and cannot be deleted.`,
      );
      setRoleActionSuccess("");
      return;
    }

    const confirmed = window.confirm(
      `Delete the role "${role.name}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    deleteRoleMutation.mutate(role.id);
  }

  const [permissionForm, setPermissionForm] = useState<CreatePermissionRequest>(
    {
      name: "",
      description: "",
      module: "",
      action: "",
    },
  );

  const rolesQuery = useQuery({
    queryKey: ["roles", "all"],
    queryFn: () => rolesApi.getAll({ limit: 100 }),
  });

  const permissionsQuery = useQuery({
    queryKey: ["permissions", "all"],
    queryFn: () => permissionsApi.getAll({ limit: 100 }),
  });

  const auditQuery = useQuery({
    queryKey: ["audit-logs", "roles"],
    queryFn: () =>
      auditApi.getAll({
        limit: 5,
        entity: "Role",
      }),
  });

  const roles = rolesQuery.data?.items ?? [];
  const permissions = permissionsQuery.data?.items ?? [];
  const auditLogs = auditQuery.data?.items ?? [];

  /*
   * Select the first role automatically.
   */
  const activeRoleId = selectedRoleId ?? roles[0]?.id ?? null;

  const role = roles.find((item) => item.id === activeRoleId) ?? null;

  /*
   * When the selected role changes, the matrix is initialized
   * from the actual permissions returned by the backend.
   */
  const selectRole = (nextRoleId: string) => {
    const nextRole = roles.find((item) => item.id === nextRoleId);

    if (!nextRole) return;

    const ids = nextRole.permissions.map((permission) => permission.id);

    setSelectedRoleId(nextRoleId);
    setPendingPermissionIds(ids);
    setSavedPermissionIds(ids);
    setCompareRoleId(null);
  };

  /*
   * Initialize the first role.
   */
  useEffect(() => {
    if (!selectedRoleId && roles.length > 0) {
      const firstRole = roles[0];

      setSelectedRoleId(firstRole.id);

      const ids = firstRole.permissions.map((permission) => permission.id);

      setPendingPermissionIds(ids);
      setSavedPermissionIds(ids);
    }
  }, [roles, selectedRoleId]);

  const modules = useMemo(() => {
    const map = new Map<
      string,
      {
        id: string;
        name: string;
        description: string;
        permissions: PermissionResponse[];
      }
    >();

    permissions.forEach((permission) => {
      const moduleId = permission.module;

      if (!map.has(moduleId)) {
        map.set(moduleId, {
          id: moduleId,
          name: moduleId,
          description: `${moduleId} permissions`,
          permissions: [],
        });
      }

      map.get(moduleId)!.permissions.push(permission);
    });

    return Array.from(map.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [permissions]);

  const visibleModules = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return modules.filter((module) => {
      const matchesModule =
        moduleFilter === "all" || module.id === moduleFilter;

      if (!matchesModule) return false;

      if (!normalized) return true;

      return (
        module.name.toLowerCase().includes(normalized) ||
        module.description.toLowerCase().includes(normalized) ||
        module.permissions.some(
          (permission) =>
            permission.name.toLowerCase().includes(normalized) ||
            permission.action.toLowerCase().includes(normalized) ||
            permission.description?.toLowerCase().includes(normalized),
        )
      );
    });
  }, [modules, moduleFilter, query]);

  const updateRoleMutation = useMutation({
    mutationFn: async () => {
      if (!role) {
        throw new Error("No role selected.");
      }

      return rolesApi.update(role.id, {
        permissionIds: pendingPermissionIds,
      });
    },

    onSuccess: () => {
      setSavedPermissionIds([...pendingPermissionIds]);

      queryClient.invalidateQueries({
        queryKey: ["roles", "all"],
      });

      setNotice("Permission policy saved with an audit record.");

      window.setTimeout(() => {
        setNotice("");
      }, 3500);
    },

    onError: (error) => {
      setNotice(
        error instanceof Error
          ? error.message
          : "Failed to save permission policy.",
      );
    },
  });

  const createPermissionMutation = useMutation({
    mutationFn: (payload: CreatePermissionRequest) =>
      permissionsApi.create(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["permissions", "all"],
      });

      queryClient.invalidateQueries({
        queryKey: ["roles", "all"],
      });

      setShowAddPermission(false);

      setPermissionForm({
        name: "",
        description: "",
        module: "",
        action: "",
      });

      setNotice("Permission added to the permission catalog.");

      window.setTimeout(() => {
        setNotice("");
      }, 3500);
    },

    onError: (error) => {
      setNotice(
        error instanceof Error ? error.message : "Failed to create permission.",
      );
    },
  });

  const hasChanges = useMemo(() => {
    if (pendingPermissionIds.length !== savedPermissionIds.length) {
      return true;
    }

    const saved = new Set(savedPermissionIds);

    return pendingPermissionIds.some((id) => !saved.has(id));
  }, [pendingPermissionIds, savedPermissionIds]);

  const grantedCount = pendingPermissionIds.length;

  const togglePermission = (permissionId: string) => {
    setPendingPermissionIds((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
  };

  const toggleModule = (moduleId: string) => {
    const module = modules.find((item) => item.id === moduleId);

    if (!module) return;

    const modulePermissionIds = module.permissions.map(
      (permission) => permission.id,
    );

    const allSelected = modulePermissionIds.every((id) =>
      pendingPermissionIds.includes(id),
    );

    setPendingPermissionIds((current) => {
      if (allSelected) {
        return current.filter((id) => !modulePermissionIds.includes(id));
      }

      return Array.from(new Set([...current, ...modulePermissionIds]));
    });
  };

  const discardChanges = () => {
    setPendingPermissionIds([...savedPermissionIds]);
  };

  const addPermission = () => {
    if (
      !permissionForm.name.trim() ||
      !permissionForm.module.trim() ||
      !permissionForm.action.trim()
    ) {
      setNotice("Permission name, module, and action are required.");
      return;
    }

    createPermissionMutation.mutate({
      name: permissionForm.name.trim(),
      module: permissionForm.module.trim(),
      action: permissionForm.action.trim(),
      description: permissionForm.description?.trim() || undefined,
    });
  };

  const compareRole = roles.find((item) => item.id === compareRoleId) ?? null;

  const totalPermissionCount = permissions.length;

  const activePermissionCount = permissions.filter(
    (permission) => permission.isActive,
  ).length;

  const inactivePermissionCount = totalPermissionCount - activePermissionCount;

  const customPermissionCount = permissions.filter(
    (permission) => !permission.isActive,
  ).length;

  const policyHealth =
    totalPermissionCount === 0
      ? 0
      : Math.round((activePermissionCount / totalPermissionCount) * 100);

  if (rolesQuery.isLoading || permissionsQuery.isLoading) {
    return <PageLoader />;
  }

  if (!roles.length) {
    return (
      <main className="space-y-6 p-4 sm:p-6">
        <PageHeader
          onAddPermission={() => setShowAddPermission(true)}
          onAddRole={openCreateRoleDialog}
        />

        <EmptyState
          icon={ShieldCheck}
          title="No roles found"
          description="Create your first role before managing permission policies."
        />

        <PermissionDialog
          open={showAddPermission}
          onOpenChange={setShowAddPermission}
          form={permissionForm}
          setForm={setPermissionForm}
          onSubmit={addPermission}
          loading={createPermissionMutation.isPending}
        />

        <RoleFormDialog
          open={roleDialogOpen}
          onOpenChange={setRoleDialogOpen}
          role={editingRole}
          onSuccess={() => {
            setRoleActionSuccess("Role created successfully.");
            setRoleActionError("");
          }}
        />
      </main>
    );
  }

  if (!permissions.length) {
    return (
      <div className="space-y-6 p-6">
        <PageHeader
          onAddPermission={() => setShowAddPermission(true)}
          onAddRole={openCreateRoleDialog}
        />

        <EmptyState
          icon={FileKey2}
          title="No permissions found"
          description="Create the first permission to build your role policies."
        />

        <PermissionDialog
          open={showAddPermission}
          onOpenChange={setShowAddPermission}
          form={permissionForm}
          setForm={setPermissionForm}
          onSubmit={addPermission}
          loading={createPermissionMutation.isPending}
        />

        <RoleFormDialog
          open={roleDialogOpen}
          onOpenChange={setRoleDialogOpen}
          role={editingRole}
          onSuccess={() => {
            setRoleActionSuccess(
              editingRole
                ? "Role updated successfully."
                : "Role created successfully.",
            );
            setRoleActionError("");
          }}
        />
      </div>
    );
  }

  return (
    <main className="space-y-6 p-4 sm:p-6">
      <PageHeader
        onAddPermission={() => setShowAddPermission(true)}
        onAddRole={openCreateRoleDialog}
      />
      {(roleActionSuccess || roleActionError) && (
        <div
          role={roleActionError ? "alert" : "status"}
          className={
            roleActionError
              ? "border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-4 py-3 text-sm"
              : "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-400"
          }
        >
          {roleActionError || roleActionSuccess}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Roles"
          value={String(roles.length)}
          detail="Least privilege managed"
          icon={ShieldCheck}
        />

        <StatCard
          label="Active users"
          value={String(
            roles.reduce((total, item) => total + (item.userCount ?? 0), 0),
          )}
          detail={`Across ${roles.length} role groups`}
          icon={Users}
        />

        <StatCard
          label="Permission catalog"
          value={String(totalPermissionCount)}
          detail={`${customPermissionCount} inactive definitions`}
          icon={FileKey2}
        />

        <StatCard
          label="Policy health"
          value={`${policyHealth}%`}
          detail={`${inactivePermissionCount} inactive permissions`}
          icon={Activity}
        />
      </section>

      <Card>
        <CardContent className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30">
              <ShieldCheck className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-semibold">Policy health is strong</p>

              <p className="text-muted-foreground text-xs">
                {activePermissionCount} active permissions across{" "}
                {modules.length} modules.
              </p>
            </div>
          </div>

          <div className="text-muted-foreground flex flex-wrap gap-4 text-xs">
            <span className="flex items-center gap-1.5">
              <UserRoundCheck className="h-3.5 w-3.5" />
              {roles.length} role groups
            </span>

            <span className="flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              {inactivePermissionCount} inactive
            </span>

            <span className="flex items-center gap-1.5">
              <Database className="h-3.5 w-3.5" />
              Audit enabled
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
        <RoleDirectory
          roles={roles}
          selectedRoleId={activeRoleId}
          onSelect={selectRole}
          onAddRole={openCreateRoleDialog}
          onEditRole={openEditRoleDialog}
          onToggleRole={(role) => toggleRoleMutation.mutate(role)}
          onDeleteRole={handleDeleteRole}
        />

        <PermissionMatrix
          role={role}
          permissions={permissions}
          modules={visibleModules}
          pendingPermissionIds={pendingPermissionIds}
          compare={compare}
          compareRole={compareRole}
          query={query}
          moduleFilter={moduleFilter}
          expanded={expanded}
          onCompareChange={setCompare}
          onCompareRoleChange={setCompareRoleId}
          onQueryChange={setQuery}
          onModuleFilterChange={setModuleFilter}
          onTogglePermission={togglePermission}
          onToggleModule={toggleModule}
          onToggleExpanded={(moduleId) => {
            setExpanded((current) =>
              current.includes(moduleId)
                ? current.filter((id) => id !== moduleId)
                : [...current, moduleId],
            );
          }}
          roles={roles}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <CoverageCard
          modules={modules}
          roles={roles}
          permissions={permissions}
        />

        <AuditActivityCard logs={auditLogs} />
      </div>

      {hasChanges && (
        <div className="bg-background/95 sticky bottom-4 z-30 flex flex-col gap-3 rounded-xl border p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-amber-500" />

            <span>
              <strong>
                {
                  pendingPermissionIds.filter(
                    (id) => !savedPermissionIds.includes(id),
                  ).length
                }
              </strong>{" "}
              permission changes pending review
            </span>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={discardChanges}
              disabled={updateRoleMutation.isPending}
            >
              Discard
            </Button>

            <Button
              onClick={() => updateRoleMutation.mutate()}
              disabled={updateRoleMutation.isPending}
            >
              <Save className="mr-2 h-4 w-4" />

              {updateRoleMutation.isPending ? "Saving..." : "Save policy"}
            </Button>
          </div>
        </div>
      )}

      {notice && (
        <div
          role="status"
          className="bg-background fixed right-4 bottom-4 z-50 flex max-w-md items-center gap-3 rounded-lg border px-4 py-3 text-sm shadow-lg"
        >
          <Check className="h-4 w-4 text-emerald-600" />

          <span className="flex-1">{notice}</span>

          <Button variant="ghost" size="icon-sm" onClick={() => setNotice("")}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <PermissionDialog
        open={showAddPermission}
        onOpenChange={setShowAddPermission}
        form={permissionForm}
        setForm={setPermissionForm}
        onSubmit={addPermission}
        loading={createPermissionMutation.isPending}
      />
      <RoleFormDialog
        open={roleDialogOpen}
        onOpenChange={setRoleDialogOpen}
        role={editingRole}
        onSuccess={() => {
          setRoleActionSuccess(
            editingRole
              ? "Role updated successfully."
              : "Role created successfully.",
          );

          setRoleActionError("");
        }}
      />
    </main>
  );
}

/* -------------------------------------------------------------------------- */
/* Header                                                                     */
/* -------------------------------------------------------------------------- */

function PageHeader({
  onAddPermission,
  onAddRole,
}: {
  onAddPermission: () => void;
  onAddRole: () => void;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-primary mb-1 text-xs font-semibold tracking-[0.16em]">
          ENTERPRISE PERMISSIONS
        </p>

        <div className="flex items-center gap-2">
          <ShieldCheck className="text-primary h-6 w-6" />

          <h1 className="text-2xl font-semibold tracking-tight">
            Access control
          </h1>
        </div>

        <p className="text-muted-foreground mt-1 max-w-2xl text-sm">
          Govern identity, delegated access, and permission boundaries across
          the FMS platform.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export audit
        </Button>

        <Button variant="outline" onClick={onAddRole}>
          <ShieldCheck className="mr-2 h-4 w-4" />
          Add role
        </Button>

        <Button onClick={onAddPermission}>
          <Plus className="mr-2 h-4 w-4" />
          Add permission
        </Button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat Card                                                                  */
/* -------------------------------------------------------------------------- */

function StatCard({
  label,
  value,
  detail,
  icon: Icon,
}: {
  label: string;
  value: string;
  detail: string;
  icon: typeof ShieldCheck;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="bg-primary/10 text-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-lg">
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
            {label}
          </p>

          <p className="mt-0.5 text-2xl font-bold">{value}</p>

          <p className="text-muted-foreground truncate text-xs">{detail}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Role Directory                                                             */
/* -------------------------------------------------------------------------- */

function RoleDirectory({
  roles,
  selectedRoleId,
  onSelect,
  onAddRole,
  onEditRole,
  onToggleRole,
  onDeleteRole,
}: {
  roles: RoleResponse[];
  selectedRoleId: string | null;
  onSelect: (id: string) => void;
  onAddRole: () => void;
  onEditRole: (role: RoleResponse) => void;
  onToggleRole: (role: RoleResponse) => void;
  onDeleteRole: (role: RoleResponse) => void;
}) {
  return (
    <Card className="h-fit">
      <CardHeader className="border-b">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="text-base">Role directory</CardTitle>

            <p className="text-muted-foreground mt-1 text-xs">
              Scoped access groups and ownership
            </p>
          </div>

          <Button variant="ghost" size="icon-sm" aria-label="Role options">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-2">
        <div className="space-y-1">
          {roles.map((role, index) => {
            const selected = role.id === selectedRoleId;
            const color = getRoleColor(index);

            return (
              <div
                key={role.id}
                className={[
                  "group flex w-full items-center gap-3 rounded-lg p-2 transition-colors",
                  selected
                    ? "bg-primary/10 text-foreground"
                    : "hover:bg-muted/60",
                ].join(" ")}
              >
                {/* Role selection button */}
                <button
                  type="button"
                  onClick={() => onSelect(role.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 rounded-md p-1 text-left"
                >
                  <div
                    className={[
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                      color === "blue" &&
                        "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300",
                      color === "violet" &&
                        "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
                      color === "amber" &&
                        "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
                      color === "emerald" &&
                        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
                      color === "rose" &&
                        "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
                      color === "cyan" &&
                        "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {getInitials(role)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">
                      {role.name}
                    </p>

                    <p className="text-muted-foreground truncate text-xs">
                      {role.description || "No description"}
                    </p>
                  </div>

                  <div className="hidden text-right sm:block">
                    <p className="text-sm font-semibold">
                      {role.userCount ?? 0}
                    </p>

                    <p className="text-muted-foreground text-[10px]">users</p>
                  </div>

                  <ChevronRight
                    className={[
                      "h-4 w-4 shrink-0 transition-transform",
                      selected
                        ? "text-primary translate-x-0.5"
                        : "text-muted-foreground",
                    ].join(" ")}
                  />
                </button>

                {/* Role actions */}
                <details className="relative shrink-0">
                  <summary
                    className="hover:bg-muted flex h-8 w-8 cursor-pointer list-none items-center justify-center rounded-md"
                    aria-label={`Actions for ${role.name}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </summary>

                  <div className="bg-popover absolute right-0 z-30 mt-1 w-44 rounded-lg border p-1 shadow-lg">
                    <button
                      type="button"
                      onClick={() => onEditRole(role)}
                      className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit role
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleRole(role)}
                      className="hover:bg-muted flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      {role.isActive ? "Deactivate" : "Activate"}
                    </button>

                    {!role.isSystem && (
                      <>
                        <div className="my-1 border-t" />

                        <button
                          type="button"
                          onClick={() => onDeleteRole(role)}
                          className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete role
                        </button>
                      </>
                    )}
                  </div>
                </details>
              </div>
            );
          })}
        </div>
        <Button variant="outline" className="mt-3 w-full" onClick={onAddRole}>
          <Plus className="mr-2 h-4 w-4" />
          Add new role
        </Button>

        <div className="text-muted-foreground mt-3 flex items-center gap-2 border-t pt-3 text-xs">
          <ShieldCheck className="h-3.5 w-3.5" />
          Roles are governed by the organization super admin
        </div>
      </CardContent>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Permission Matrix                                                          */
/* -------------------------------------------------------------------------- */

function PermissionMatrix({
  role,
  permissions,
  modules,
  pendingPermissionIds,
  compare,
  compareRole,
  query,
  moduleFilter,
  expanded,
  onCompareChange,
  onCompareRoleChange,
  onQueryChange,
  onModuleFilterChange,
  onTogglePermission,
  onToggleModule,
  onToggleExpanded,
  roles,
}: {
  role: RoleResponse | null;
  permissions: PermissionResponse[];
  modules: {
    id: string;
    name: string;
    description: string;
    permissions: PermissionResponse[];
  }[];
  pendingPermissionIds: string[];
  compare: boolean;
  compareRole: RoleResponse | null;
  query: string;
  moduleFilter: string;
  expanded: string[];
  onCompareChange: (value: boolean) => void;
  onCompareRoleChange: (value: string | null) => void;
  onQueryChange: (value: string) => void;
  onModuleFilterChange: (value: string) => void;
  onTogglePermission: (id: string) => void;
  onToggleModule: (id: string) => void;
  onToggleExpanded: (id: string) => void;
  roles: RoleResponse[];
}) {
  if (!role) return null;

  const actionOptions = Array.from(
    new Set(permissions.map((permission) => permission.action)),
  ).sort();

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">{role.name}</CardTitle>

              <Badge
                variant={role.isActive ? "default" : "secondary"}
                className="text-[10px]"
              >
                {role.isActive ? "Active" : "Inactive"}
              </Badge>

              {role.isSystem && (
                <Badge variant="outline" className="text-[10px]">
                  System role
                </Badge>
              )}
            </div>

            <p className="text-muted-foreground mt-1 text-xs">
              {role.description || "No description"} ·{" "}
              {pendingPermissionIds.length} of {permissions.length} permissions
              enabled
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={compare}
                onChange={(event) => onCompareChange(event.target.checked)}
                className="accent-primary"
              />
              Compare
            </label>

            <Button variant="ghost" size="icon-sm" aria-label="Matrix options">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {compare && (
        <div className="bg-muted/40 flex flex-wrap items-center gap-2 border-b px-4 py-2.5 text-xs">
          <Eye className="h-4 w-4" />

          <span>Comparing</span>

          <strong>{role.name}</strong>

          <span>with</span>

          <Select
            value={compareRole?.id ?? ""}
            onValueChange={(value) => onCompareRoleChange(value || null)}
          >
            <SelectTrigger className="h-7 w-auto min-w-36">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent>
              {roles
                .filter((item) => item.id !== role.id)
                .map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon-sm"
            className="ml-auto"
            onClick={() => onCompareChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row">
        <SearchInput
          value={query}
          onChange={onQueryChange}
          placeholder="Search modules or permissions..."
          className="flex-1"
        />

        <Select
          value={moduleFilter}
          onValueChange={(value) => {
            onModuleFilterChange(value ?? "all");
          }}
        >
          <SelectTrigger className="w-full sm:w-48">
            <ListFilter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All modules</SelectItem>

            {modules.map((module) => (
              <SelectItem key={module.id} value={module.id}>
                {module.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          <div className="bg-muted/40 grid grid-cols-[minmax(280px,1fr)_100px] border-b px-4 py-2.5 text-xs font-medium sm:grid-cols-[minmax(280px,1fr)_repeat(6,80px)]">
            <span>Module / permission</span>

            {actionOptions.map((action) => (
              <span key={action} className="hidden text-center sm:block">
                {formatAction(action)}
              </span>
            ))}

            <span className="sm:hidden">Access</span>
          </div>

          {modules.length === 0 ? (
            <div className="p-8">
              <EmptyState
                icon={Search}
                title="No matching permissions"
                description="Try a different search or module filter."
              />
            </div>
          ) : (
            modules.map((module) => {
              const isExpanded = expanded.includes(module.id);

              const selectedCount = module.permissions.filter((permission) =>
                pendingPermissionIds.includes(permission.id),
              ).length;

              const allSelected =
                module.permissions.length > 0 &&
                selectedCount === module.permissions.length;

              const partial = selectedCount > 0 && !allSelected;

              return (
                <div key={module.id} className="border-b last:border-b-0">
                  <div className="flex items-center gap-3 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => onToggleExpanded(module.id)}
                      className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    >
                      <ChevronRight
                        className={[
                          "text-muted-foreground h-4 w-4 shrink-0 transition-transform",
                          isExpanded && "rotate-90",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      />

                      <div className="bg-primary/10 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-xs font-bold">
                        {module.name.slice(0, 1).toUpperCase()}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {module.name}
                        </p>

                        <p className="text-muted-foreground truncate text-xs">
                          {module.description} · {module.permissions.length}{" "}
                          permissions
                        </p>
                      </div>
                    </button>

                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onToggleModule(module.id)}
                        className={[
                          "flex h-5 w-5 items-center justify-center rounded border transition-colors",
                          allSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : partial
                              ? "border-primary bg-primary/10"
                              : "border-input",
                        ].join(" ")}
                        aria-label={`Toggle all ${module.name} permissions`}
                      >
                        {allSelected ? (
                          <Check className="h-3.5 w-3.5" />
                        ) : partial ? (
                          <span className="bg-primary h-1.5 w-1.5 rounded-sm" />
                        ) : null}
                      </button>

                      <span className="text-muted-foreground w-10 text-right text-xs">
                        {selectedCount}/{module.permissions.length}
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-muted/20">
                      {module.permissions.map((permission) => {
                        const checked = pendingPermissionIds.includes(
                          permission.id,
                        );

                        const comparisonChecked =
                          compareRole?.permissions.some(
                            (item) => item.id === permission.id,
                          ) ?? false;

                        return (
                          <div
                            key={permission.id}
                            className="flex items-center gap-3 border-t px-4 py-2.5 pl-12"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium">
                                {permission.name}
                              </p>

                              <p className="text-muted-foreground truncate text-xs">
                                {permission.description || "No description"}
                              </p>
                            </div>

                            <Badge
                              variant="secondary"
                              className="hidden shrink-0 text-[10px] sm:inline-flex"
                            >
                              {formatAction(permission.action)}
                            </Badge>

                            {compare && compareRole && (
                              <div
                                className="hidden items-center gap-1 text-[10px] sm:flex"
                                title={`In ${compareRole.name}`}
                              >
                                <Eye className="text-muted-foreground h-3 w-3" />

                                <span
                                  className={
                                    comparisonChecked
                                      ? "text-emerald-600"
                                      : "text-muted-foreground"
                                  }
                                >
                                  {comparisonChecked ? "On" : "Off"}
                                </span>
                              </div>
                            )}

                            <button
                              type="button"
                              onClick={() => onTogglePermission(permission.id)}
                              className={[
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors",
                                checked
                                  ? "bg-primary border-primary text-primary-foreground"
                                  : "border-input hover:border-primary",
                              ].join(" ")}
                              aria-label={`${checked ? "Disable" : "Enable"} ${permission.name}`}
                            >
                              {checked && <Check className="h-3.5 w-3.5" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/* Coverage                                                                   */
/* -------------------------------------------------------------------------- */

function CoverageCard({
  modules,
  roles,
  permissions,
}: {
  modules: {
    id: string;
    name: string;
    description: string;
    permissions: PermissionResponse[];
  }[];
  roles: RoleResponse[];
  permissions: PermissionResponse[];
}) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Permission catalog</CardTitle>

            <p className="text-muted-foreground mt-1 text-xs">
              Coverage and permission definitions
            </p>
          </div>

          <Badge variant="secondary">{permissions.length} definitions</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-5 p-4">
        <div className="grid grid-cols-3 gap-3">
          <Metric value={permissions.length} label="total definitions" />

          <Metric
            value={permissions.filter((p) => !p.isActive).length}
            label="inactive"
          />

          <Metric value={modules.length} label="modules covered" />
        </div>

        <div className="space-y-4">
          {modules.slice(0, 8).map((module) => {
            const total = module.permissions.length * roles.length;

            const assigned = roles.reduce(
              (count, role) =>
                count +
                module.permissions.filter((permission) =>
                  role.permissions.some((item) => item.id === permission.id),
                ).length,
              0,
            );

            const percentage =
              total === 0 ? 0 : Math.round((assigned / total) * 100);

            return (
              <div key={module.id}>
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium">{module.name}</span>

                  <strong>{percentage}%</strong>
                </div>

                <div className="bg-muted h-2 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full transition-all"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg border p-3">
      <p className="text-xl font-bold">{value}</p>
      <p className="text-muted-foreground text-[11px]">{label}</p>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Audit Activity                                                             */
/* -------------------------------------------------------------------------- */

function AuditActivityCard({
  logs,
}: {
  logs: {
    id: string;
    action: string;
    entity: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  }[];
}) {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Audit-ready activity</CardTitle>

            <p className="text-muted-foreground mt-1 text-xs">
              Latest RBAC changes
            </p>
          </div>

          <Button variant="ghost" size="icon-sm" aria-label="Audit options">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {!logs.length ? (
          <div className="text-muted-foreground py-8 text-center text-sm">
            No RBAC activity recorded yet.
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-3">
                <div className="bg-primary/10 text-primary flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                  <LockKeyhole className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm">
                    <strong>
                      {log.user
                        ? `${log.user.firstName} ${log.user.lastName}`
                        : "System"}
                    </strong>{" "}
                    {log.action.toLowerCase()} <strong>{log.entity}</strong>
                  </p>

                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {formatDate(log.createdAt)}
                    {log.user?.email
                      ? ` · ${log.user.email}`
                      : " · System action"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
