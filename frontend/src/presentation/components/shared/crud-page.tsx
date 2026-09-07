"use client";

import { useMemo, useState, type ReactNode } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  DataPagination,
  SearchInput,
  ConfirmDialog,
  PageLoader,
  EmptyState,
} from "@/presentation/components/shared";

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

import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";

import type { PaginationMeta, PaginationQuery } from "@/domain/shared/entities";

export interface ColumnDef<T> {
  key: string;
  label: string;
  className?: string;
  render: (item: T) => ReactNode;
}

export interface StatDef {
  label: string;
  value: number;
  icon: React.ComponentType<{
    className?: string;
  }>;
  iconBg: string;
  iconColor: string;
}

interface CrudPageConfig<
  T extends {
    id: string;
    isActive: boolean;
    name: string;
  },
> {
  title: string;
  description: string;
  entityName: string;
  queryKey: string;

  icon: React.ComponentType<{
    className?: string;
  }>;

  api: {
    getAll: (params?: PaginationQuery) => Promise<{
      items: T[];
      meta: PaginationMeta;
    }>;
    delete: (id: string) => Promise<unknown>;
  };

  columns: ColumnDef<T>[];

  getStats: (items: T[], total: number) => StatDef[];

  extraParams?: Record<string, unknown>;

  renderFormDialog: (props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editItem: T | null;
    onSuccess: () => void;
  }) => ReactNode;
}

export function CrudPage<
  T extends {
    id: string;
    isActive: boolean;
    name: string;
  },
>({
  title,
  description,
  entityName,
  queryKey,
  icon: Icon,
  api,
  columns,
  getStats,
  extraParams,
  renderFormDialog,
}: CrudPageConfig<T>) {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);

  const [editItem, setEditItem] = useState<T | null>(null);

  const [deleteItem, setDeleteItem] = useState<T | null>(null);

  // --------------------------------------------------
  // Get data
  // --------------------------------------------------

  const { data, isLoading } = useQuery({
    queryKey: [queryKey, page, limit, search, extraParams],

    queryFn: () =>
      api.getAll({
        page,
        limit,
        search,
        ...extraParams,
      }),
  });

  // --------------------------------------------------
  // Statistics
  // --------------------------------------------------

  const stats = useMemo(() => {
    if (!data?.items) {
      return [];
    }

    return getStats(data.items, data.meta?.total ?? data.items.length);
  }, [data, getStats]);

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });

      setDeleteItem(null);
    },
  });

  // --------------------------------------------------
  // Create
  // --------------------------------------------------

  const handleCreate = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  // --------------------------------------------------
  // Edit
  // --------------------------------------------------

  const handleEdit = (item: T) => {
    setEditItem(item);
    setFormOpen(true);
  };

  // --------------------------------------------------
  // Render
  // --------------------------------------------------

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>

        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {/* Statistics */}

      {stats.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-lg border bg-card p-4"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBg}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
              </div>

              <div>
                <p className="text-2xl font-bold">{stat.value}</p>

                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Command bar */}

      <div className="flex items-center gap-3">
        <Button size="sm" onClick={handleCreate} className="h-8 gap-1.5">
          <Plus className="h-3.5 w-3.5" />
          New {entityName}
        </Button>

        <SearchInput
          value={search}
          onChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          placeholder={`Search ${entityName}s...`}
          className="w-72"
        />

        <span className="ml-auto text-xs text-muted-foreground">
          Showing {data?.items?.length ?? 0} of {data?.meta?.total ?? 0} records
        </span>
      </div>

      {/* Content */}

      {isLoading ? (
        <PageLoader />
      ) : !data?.items?.length ? (
        <EmptyState
          icon={Icon}
          title={`No ${entityName}s found`}
          description={
            search
              ? "Try a different search term"
              : `Get started by adding your first ${entityName}`
          }
          action={
            <Button size="sm" onClick={handleCreate}>
              <Plus className="mr-1.5 h-4 w-4" />
              New {entityName}
            </Button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-md border bg-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  {columns.map((column) => (
                    <TableHead
                      key={column.key}
                      className={`h-10 text-xs font-medium text-muted-foreground ${
                        column.className ?? ""
                      }`}
                    >
                      {column.label}
                    </TableHead>
                  ))}

                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>

              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.id} className="group hover:bg-muted/50">
                    {columns.map((column) => (
                      <TableCell key={column.key}>
                        {column.render(item)}
                      </TableCell>
                    ))}

                    {/* Actions */}

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
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() => setDeleteItem(item)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}

          {data.meta && (
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
      )}

      {/* Create / Edit form */}

      {renderFormDialog({
        open: formOpen,
        onOpenChange: setFormOpen,
        editItem,
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [queryKey],
          });

          setFormOpen(false);
        },
      })}

      {/* Delete confirmation */}

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteItem(null);
          }
        }}
        title={`Delete ${entityName}`}
        description={`Are you sure you want to delete "${deleteItem?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() => {
          if (deleteItem) {
            deleteMutation.mutate(deleteItem.id);
          }
        }}
      />
    </div>
  );
}

// --------------------------------------------------
// Active / Inactive badge
// --------------------------------------------------

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
