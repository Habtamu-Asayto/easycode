"use client";

import { useState, useMemo, type ReactNode } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DataPagination,
  SearchInput,
  ConfirmDialog, 
  PageLoader,
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
import { Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { PaginationQuery, PaginationMeta } from "@/domain/rbac/entities";

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
export function CrudPage<
  T extends { id: string; isActive: boolean; name: string },
>({
  title,
  description,
  entityName,
  queryKey,
  permission,
  icon: Icon,
  api,
  columns,
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      {/* Stats */}
      {stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
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
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
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
        <span className="ml-auto text-xs text-muted-foreground">
          Showing {data?.data?.length ?? 0} of {data?.meta?.total ?? 0} records
        </span>
      </div>

      {/* Content */}
      {isLoading ? (
        <PageLoader2 />
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
        <div className="rounded-md border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  {columns.map((col) => (
                    <TableHead
                      key={col.key}
                      className={`h-10 text-xs font-medium text-muted-foreground ${col.className ?? ""}`}
                    >
                      {col.label}
                    </TableHead>
                  ))}
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-muted/50">
                    {columns.map((col) => (
                      <TableCell key={col.key}>{col.render(item)}</TableCell>
                    ))}
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
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </PermissionGate>
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
    <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 text-[11px] border border-emerald-200 dark:border-emerald-800">
      Active
    </Badge>
  ) : (
    <Badge variant="secondary" className="text-[11px]">
      Inactive
    </Badge>
  );
}
