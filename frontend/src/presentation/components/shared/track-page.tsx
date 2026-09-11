"use client";

import { useState, useMemo, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/presentation/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { PaginationQuery, PaginationMeta } from "@/domain/rbac/entities";
import { redirect } from "next/navigation";

// ── Types ─────────────────────────────────────────────────────────────────────
export interface ColumnDef<T> {
  key: string;
  label: string;
  className?: string;
  render: (item: T) => ReactNode;
}

export interface StatDef {
  label: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

interface CrudPageConfig<T extends { id: string; isActive: boolean }> {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** Entity name for messages, e.g. "fertilizer type" */
  entityName: string;
  /** React query cache key prefix */
  queryKey: string;
  /** Permission module, e.g. "geography" or "fertilizer-types" */
  permission: string;
  /** Lucide icon for empty state */
  icon: React.ComponentType<{ className?: string }>;

  /** API methods */
  api: {
    getAll: (params: PaginationQuery & Record<string, unknown>) => Promise<{
      data: T[];
      meta: PaginationMeta;
    }>;
    delete: (id: string) => Promise<unknown>;
  };

  /** Table column definitions */
  columns: ColumnDef<T>[];

  /** Stats cards — computed from current page data */
  getStats: (items: T[], total: number) => StatDef[];

  /** Extra query params passed to getAll (filters) */
  extraParams?: Record<string, unknown>;

  /** Render form dialog */
  renderFormDialog: (props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editItem: T | null;
    onSuccess: () => void;
  }) => ReactNode;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function TrackPage<
  T extends { id: string; isActive: boolean; name: string },
>({
  title,
  description,
  entityName,
  queryKey,
  permission,
  icon: Icon,
  api,
  getStats,
  extraParams,
  renderFormDialog,
}: CrudPageConfig<T>) {
  const queryClient = useQueryClient();
  const { hasPermission } = useAuth();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editItem, setEditItem] = useState<T | null>(null);
  const [deleteItem, setDeleteItem] = useState<T | null>(null);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    trackingNumber: "",
    origin: "",
    destination: "",
  });

  const statusColors: Record<string, string> = {
    IN_WAREHOUSE: "bg-blue-100 text-blue-800",
    IN_TRANSIT_UNION: "bg-amber-100 text-amber-800",
    IN_DISTRIBUTION: "bg-purple-100 text-purple-800",
    OUT_FOR_DELIVERY: "bg-green-100 text-green-800",
    DELIVERED: "bg-emerald-100 text-emerald-800",
    DELAYED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };

  function handleDetail() {
    redirect("./detail");
  }
  const { data, isLoading } = useQuery({
    queryKey: [queryKey, page, limit, search, extraParams],
    queryFn: () => api.getAll({ page, limit, search, ...extraParams }),
  });

  const stats = useMemo(() => {
    if (!data?.data) return [];
    return getStats(data.data, data.meta?.total ?? data.data.length);
  }, [data, getStats]);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(id),
    onSuccess: () => {
      toast.success(`${entityName} deleted successfully`);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      setDeleteItem(null);
    },
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message || `Failed to delete ${entityName}`,
      ),
  });

  const handleCreate = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditItem(item);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card flex items-center gap-4 rounded-lg border p-4"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>
              <div>
                <p className="text-foreground text-2xl font-bold">
                  {stat.value}
                </p>
                <p className="text-muted-foreground text-xs">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Command bar */}
      <div className="flex items-center gap-3">
        <PermissionGate permission={`${permission}:create`}>
          <Button size="sm" onClick={handleCreate} className="h-8 gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            New {entityName}
          </Button>
        </PermissionGate>

        <SearchInput
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder={`Search ${entityName}s...`}
          className="w-72"
        />
        <span className="text-muted-foreground ml-auto text-xs">
          Showing {data?.data?.length ?? 0} Tackings
        </span>
      </div>

      {/* Content */}
      {isLoading ? (
        <PageLoader />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={Icon}
          title={`No ${entityName}s found`}
          description={
            search
              ? "Try a different search term"
              : `Get started by adding your first ${entityName}`
          }
          action={
            hasPermission(`${permission}:create`) ? (
              <Button size="sm" onClick={handleCreate}>
                <Plus className="mr-1.5 h-4 w-4" />
                New {entityName}
              </Button>
            ) : undefined
          }
        />
      ) : (
        <div className="borde-0 bg-card overflow-hidden rounded-md">
          <div className="bg-muted/40 overflow-x-auto">
            {/* Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((item) => (
                <div
                  key={item.id}
                  className="bg-card cursor-pointer rounded-xl border p-5 transition-all hover:shadow-md"
                  onClick={() => console.log("go detail", item.id)} // replace with router if needed
                >
                  <div onClick={() => handleDetail()}>
                    {/* Tracking */}
                    <p className="text-muted-foreground text-xs font-medium">
                      TRACKING NUMBER
                    </p>
                    <p className="text-foreground font-mono text-base font-semibold">
                      {item.name}
                    </p>

                    {/* Status */}
                    <p className="text-muted-foreground mt-3 text-xs font-medium">
                      STATUS
                    </p>
                    <span
                      className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium ${
                        (item as any).status
                          ? statusColors[(item as any).status]
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {(item as any).status?.replace(/_/g, " ")}
                    </span>

                    {/* Details */}
                    <div className="mt-3 space-y-1 border-t pt-3">
                      <p className="text-muted-foreground text-xs">
                        From:{" "}
                        <span className="text-foreground">
                          {(item as any).origin}
                        </span>
                      </p>
                      <p className="text-muted-foreground text-xs">
                        To:{" "}
                        <span className="text-foreground">
                          {(item as any).destination}
                        </span>
                      </p>
                    </div>

                    {/* Date */}
                    <p className="text-muted-foreground mt-3 text-[11px]">
                      Created{" "}
                      {new Date((item as any).createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex justify-end">
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

                      <DropdownMenuContent align="end" className="w-40">
                        <PermissionGate permission={`${permission}:update`}>
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </PermissionGate>

                        <DropdownMenuSeparator />

                        <PermissionGate permission={`${permission}:delete`}>
                          <DropdownMenuItem
                            onClick={() => setDeleteItem(item)}
                            className="text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </PermissionGate>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Form Dialog */}
      {renderFormDialog({
        open: formOpen,
        onOpenChange: setFormOpen,
        editItem,
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: [queryKey] });
          setFormOpen(false);
        },
      })}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        title={`Delete ${entityName}`}
        description={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => deleteItem && deleteMutation.mutate(deleteItem.id)}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

// ── Helper: Active/Inactive Badge ─────────────────────────────────────────────
export function StatusBadge({ isActive }: { isActive: boolean }) {
  return isActive ? (
    <Badge className="border border-emerald-200 bg-emerald-50 text-[11px] text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
      Active
    </Badge>
  ) : (
    <Badge variant="secondary" className="text-[11px]">
      Inactive
    </Badge>
  );
}
