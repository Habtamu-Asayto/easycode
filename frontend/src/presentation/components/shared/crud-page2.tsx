"use client";

import { useMemo, useState, type ComponentType, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  Clock3,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";

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

import type { PaginationQuery, PaginationMeta } from "@/domain/rbac/entities";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface ColumnDef<T> {
  key: string;
  label: string;
  className?: string;
  render: (item: T) => ReactNode;
}

export interface StatDef {
  label: string;
  value: number;
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

interface CrudPageConfig<T extends { id: string; isActive: boolean }> {
  title: string;
  description: string;
  entityName: string;
  queryKey: string;
  permission: string;
  icon: ComponentType<{ className?: string }>;

  api: {
    getAll: (params: PaginationQuery & Record<string, unknown>) => Promise<{
      data: T[];
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

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown, fallback: string) {
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

// ─────────────────────────────────────────────────────────────────────────────
// Main CrudPage
// ─────────────────────────────────────────────────────────────────────────────

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

  // ─────────────────────────────────────────────────────────────────────────
  // Query
  // ─────────────────────────────────────────────────────────────────────────

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery({
    queryKey: [queryKey, page, limit, search, extraParams],

    queryFn: () =>
      api.getAll({
        page,
        limit,
        search,
        ...extraParams,
      }),

    placeholderData: (previousData) => previousData,
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Stats
  // ─────────────────────────────────────────────────────────────────────────

  const stats = useMemo(() => {
    if (!data?.data) {
      return [];
    }

    return getStats(data.data, data.meta?.total ?? data.data.length);
  }, [data, getStats]);

  // ─────────────────────────────────────────────────────────────────────────
  // Delete mutation
  // ─────────────────────────────────────────────────────────────────────────

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(id),

    onSuccess: () => {
      toast.success(`${entityName} deleted successfully`);

      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });

      setDeleteItem(null);
    },

    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, `Failed to delete ${entityName}`));
    },
  });

  // ─────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────

  const handleCreate = () => {
    setEditItem(null);
    setFormOpen(true);
  };

  const handleEdit = (item: T) => {
    setEditItem(item);
    setFormOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleRefresh = async () => {
    await refetch();
    toast.success(`${title} refreshed`);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [queryKey],
    });

    setFormOpen(false);
    setEditItem(null);
  };

  const totalRecords = data?.meta?.total ?? data?.data?.length ?? 0;

  const visibleRecords = data?.data?.length ?? 0;

  const canCreate = hasPermission(`${permission}:create`);

  const canUpdate = hasPermission(`${permission}:update`);

  const canDelete = hasPermission(`${permission}:delete`);

  // ─────────────────────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="bg-background text-foreground min-h-full">
      <div className="mx-auto w-full max-w-[1600px] space-y-7 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ──────────────────────────────────────────────────────────────── */}
        {/* Page Header */}
        {/* ──────────────────────────────────────────────────────────────── */}

        <section className="border-border/70 bg-card relative overflow-hidden rounded-2xl border shadow-sm">
          {/* Decorative background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden"
          >
            <div className="bg-primary/5 absolute -top-24 -right-20 size-64 rounded-full blur-3xl" />
            <div className="bg-primary/5 absolute -bottom-24 -left-20 size-64 rounded-full blur-3xl" />
          </div>

          <div className="relative flex flex-col gap-6 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:p-7">
            <div className="flex min-w-0 items-start gap-4">
              <div className="border-primary/15 bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-2xl border shadow-sm">
                <Icon className="size-6" />
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-primary text-[10px] font-bold tracking-[0.2em] uppercase">
                    Management
                  </span>

                  <ChevronRight className="text-muted-foreground size-3.5" />

                  <span className="text-muted-foreground text-xs">
                    {entityName}
                  </span>
                </div>

                <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  {title}
                </h1>

                <p className="text-muted-foreground mt-1.5 max-w-2xl text-sm leading-6">
                  {description}
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
                <PermissionGate permission={`${permission}:create`}>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleCreate}
                    className="h-9 gap-2 rounded-lg shadow-sm"
                  >
                    <Plus className="size-4" />
                    New {entityName}
                  </Button>
                </PermissionGate>
              )}
            </div>
          </div>
        </section>

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* Statistics */}
        {/* ──────────────────────────────────────────────────────────────── */}

        {stats.length > 0 && (
          <section
            aria-label={`${title} statistics`}
            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          >
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="group border-border/70 bg-card relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  animationDelay: `${index * 70}ms`,
                }}
              >
                <div
                  aria-hidden="true"
                  className="bg-primary/5 absolute -top-8 -right-8 size-24 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-150"
                />

                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-muted-foreground text-xs font-medium">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-semibold tracking-tight">
                      {stat.value.toLocaleString()}
                    </p>

                    <div className="text-muted-foreground mt-3 flex items-center gap-1.5 text-[11px]">
                      <TrendingUp className="size-3.5 text-emerald-500" />
                      <span>Current overview</span>
                    </div>
                  </div>

                  <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${stat.iconBg} transition-transform duration-300 group-hover:scale-105`}
                  >
                    <stat.icon className={`size-5 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* ──────────────────────────────────────────────────────────────── */}
        {/* Main Content */}
        {/* ──────────────────────────────────────────────────────────────── */}

        <section className="border-border/70 bg-card overflow-hidden rounded-2xl border shadow-sm">
          {/* Section heading */}
          <div className="border-border/70 border-b px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Activity className="text-primary size-4" />

                  <h2 className="text-base font-semibold">
                    {entityName} records
                  </h2>
                </div>

                <p className="text-muted-foreground mt-1 text-xs">
                  Manage, search and maintain your {entityName} data.
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

          {/* ──────────────────────────────────────────────────────────── */}
          {/* Toolbar */}
          {/* ──────────────────────────────────────────────────────────── */}

          <div className="border-border/70 bg-muted/20 border-b px-4 py-4 sm:px-5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="w-full lg:max-w-md">
                <SearchInput
                  value={search}
                  onChange={handleSearch}
                  placeholder={`Search ${entityName}s...`}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <div className="border-border/70 bg-background text-muted-foreground hidden items-center gap-2 rounded-lg border px-3 py-2 text-xs sm:flex">
                  <Search className="size-3.5" />

                  <span>
                    {search ? `Searching "${search}"` : `All ${entityName}s`}
                  </span>
                </div>

                <div className="border-border/70 bg-background inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs">
                  <span className="text-foreground font-semibold">
                    {visibleRecords}
                  </span>

                  <span className="text-muted-foreground">
                    of {totalRecords}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────── */}
          {/* Loading */}
          {/* ──────────────────────────────────────────────────────────── */}

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
                Unable to load {entityName}s
              </h3>

              <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
                {getErrorMessage(
                  error,
                  `Something went wrong while loading ${entityName} records.`,
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
          ) : !data?.data?.length ? (
            <div className="min-h-[420px]">
              <EmptyState
                icon={Icon}
                title={`No ${entityName}s found`}
                description={
                  search
                    ? "Try a different search term or clear the search."
                    : `Get started by adding your first ${entityName}.`
                }
                action={
                  canCreate ? (
                    <PermissionGate permission={`${permission}:create`}>
                      <Button
                        size="sm"
                        onClick={handleCreate}
                        className="gap-2"
                      >
                        <Plus className="size-4" />
                        New {entityName}
                      </Button>
                    </PermissionGate>
                  ) : undefined
                }
              />
            </div>
          ) : (
            <>
              {/* ─────────────────────────────────────────────────────── */}
              {/* Table */}
              {/* ─────────────────────────────────────────────────────── */}

              <div className="relative overflow-x-auto">
                {isFetching && !isLoading && (
                  <div className="bg-primary/10 absolute inset-x-0 top-0 z-10 h-0.5 overflow-hidden">
                    <div className="bg-primary h-full w-1/3 animate-[loading_1.2s_ease-in-out_infinite]" />
                  </div>
                )}

                <Table>
                  <TableHeader>
                    <TableRow className="border-border/70 bg-muted/30 hover:bg-muted/30">
                      {columns.map((column) => (
                        <TableHead
                          key={column.key}
                          className={`text-muted-foreground h-11 px-4 text-[10px] font-bold tracking-[0.14em] whitespace-nowrap uppercase first:pl-5 last:pr-5 sm:px-5 ${
                            column.className ?? ""
                          }`}
                        >
                          {column.label}
                        </TableHead>
                      ))}

                      <TableHead className="w-[56px] px-3" />
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {data.data.map((item, index) => (
                      <TableRow
                        key={item.id}
                        className="group border-border/60 hover:bg-primary/[0.025] transition-colors duration-200"
                        style={{
                          animationDelay: `${index * 35}ms`,
                        }}
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={column.key}
                            className="px-4 py-4 first:pl-5 last:pr-5 sm:px-5"
                          >
                            {column.render(item)}
                          </TableCell>
                        ))}

                        {/* Actions */}
                        <TableCell className="relative px-3 py-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              render={
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="hover:bg-muted size-8 rounded-lg opacity-70 transition-all duration-200 group-hover:opacity-100 hover:opacity-100"
                                  aria-label={`Actions for ${item.name}`}
                                />
                              }
                            >
                              <MoreHorizontal className="size-4" />
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="w-48 rounded-xl"
                            >
                              {canUpdate && (
                                <PermissionGate
                                  permission={`${permission}:update`}
                                >
                                  <DropdownMenuItem
                                    onClick={() => handleEdit(item)}
                                    className="gap-2 rounded-lg"
                                  >
                                    <Pencil className="size-3.5" />
                                    Edit {entityName}
                                  </DropdownMenuItem>
                                </PermissionGate>
                              )}

                              {canUpdate && canDelete && (
                                <DropdownMenuSeparator />
                              )}

                              {canDelete && (
                                <PermissionGate
                                  permission={`${permission}:delete`}
                                >
                                  <DropdownMenuItem
                                    onClick={() => setDeleteItem(item)}
                                    className="text-destructive focus:text-destructive gap-2 rounded-lg"
                                  >
                                    <Trash2 className="size-3.5" />
                                    Delete {entityName}
                                  </DropdownMenuItem>
                                </PermissionGate>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* ─────────────────────────────────────────────────────── */}
              {/* Footer / Pagination */}
              {/* ─────────────────────────────────────────────────────── */}

              <div className="border-border/70 bg-muted/[0.12] border-t">
                <div className="flex flex-col gap-3 px-4 py-3 sm:px-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <CheckCircle2 className="size-3.5 text-emerald-500" />

                      <span>
                        Showing{" "}
                        <strong className="text-foreground font-semibold">
                          {visibleRecords}
                        </strong>{" "}
                        of{" "}
                        <strong className="text-foreground font-semibold">
                          {totalRecords}
                        </strong>{" "}
                        records
                      </span>
                    </div>

                    <div className="text-muted-foreground hidden items-center gap-1.5 text-[11px] md:flex">
                      <Clock3 className="size-3.5" />
                      Live data
                    </div>
                  </div>

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
              </div>
            </>
          )}
        </section>
      </div>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Form Dialog */}
      {/* ─────────────────────────────────────────────────────────────────── */}

      {renderFormDialog({
        open: formOpen,
        onOpenChange: (open) => {
          setFormOpen(open);

          if (!open) {
            setEditItem(null);
          }
        },
        editItem,
        onSuccess: handleFormSuccess,
      })}

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* Delete Confirmation */}
      {/* ─────────────────────────────────────────────────────────────────── */}

      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteItem(null);
          }
        }}
        title={`Delete ${entityName}`}
        description={
          deleteItem
            ? `Are you sure you want to delete "${deleteItem.name}"? This action cannot be undone.`
            : `Are you sure you want to delete this ${entityName}?`
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (deleteItem) {
            deleteMutation.mutate(deleteItem.id);
          }
        }}
        loading={deleteMutation.isPending}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Active / Inactive Badge
// ─────────────────────────────────────────────────────────────────────────────

export function StatusBadge({ isActive }: { isActive: boolean }) {
  if (isActive) {
    return (
      <Badge className="inline-flex items-center gap-1.5 border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 dark:hover:bg-emerald-900/30">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Active
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold"
    >
      <span className="bg-muted-foreground/50 size-1.5 rounded-full" />
      Inactive
    </Badge>
  );
}
