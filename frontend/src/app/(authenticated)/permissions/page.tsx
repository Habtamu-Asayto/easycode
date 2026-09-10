"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { permissionsApi } from "@/infrastructure/rbac/api";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/presentation/components/ui/table";
import {
  Key,
  LayoutGrid,
  List,
  CheckCircle,
  XCircle,
  Layers,
} from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import type { PermissionResponse } from "@/domain/rbac/entities";

export default function PermissionsPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data, isLoading } = useQuery({
    queryKey: ["permissions", "all"],
    queryFn: () => permissionsApi.getAll({ limit: 100 }),
  });

  const filtered = useMemo(() => {
    if (!data?.items) return [];
    if (!search) return data.items;
    const s = search.toLowerCase();
    return data.items.filter(
      (p) =>
        p.name.toLowerCase().includes(s) ||
        p.module.toLowerCase().includes(s) ||
        p.action.toLowerCase().includes(s) ||
        p.description?.toLowerCase().includes(s),
    );
  }, [data, search]);

  const grouped = useMemo(() => {
    const groups: Record<string, PermissionResponse[]> = {};
    filtered.forEach((p) => {
      if (!groups[p.module]) groups[p.module] = [];
      groups[p.module].push(p);
    });
    return groups;
  }, [filtered]);

  const permStats = useMemo(() => {
    if (!data?.items) return { total: 0, active: 0, inactive: 0, modules: 0 };
    const perms = data.items;
    return {
      total: perms.length,
      active: perms.filter((p) => p.isActive).length,
      inactive: perms.filter((p) => !p.isActive).length,
      modules: new Set(perms.map((p) => p.module)).size,
    };
  }, [data]);

  return (
    <div className="p-6 space-y-6">
      {/* ── Page header + command bar ───────────────────────────────────── */}
      <div className="space-y-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Permissions
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            View system permissions organized by module
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Permissions",
            value: permStats.total,
            icon: Key,
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
          },
          {
            label: "Active",
            value: permStats.active,
            icon: CheckCircle,
            iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
            iconColor: "text-emerald-600",
          },
          {
            label: "Inactive",
            value: permStats.inactive,
            icon: XCircle,
            iconBg: "bg-amber-50 dark:bg-amber-950/30",
            iconColor: "text-amber-600",
          },
          {
            label: "Modules",
            value: permStats.modules,
            icon: Layers,
            iconBg: "bg-blue-50 dark:bg-blue-950/30",
            iconColor: "text-blue-600",
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
        {/* View mode toggle */}
        <div className="flex items-center gap-0.5 rounded-md border p-0.5">
          <Button
            variant={viewMode === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={viewMode === "list" ? "secondary" : "ghost"}
            size="icon"
            className="h-7 w-7"
            onClick={() => setViewMode("list")}
          >
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>

        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="Search permissions..."
          className="w-72"
        />

        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} permission{filtered.length !== 1 ? "s" : ""} across{" "}
          {Object.keys(grouped).length} module
          {Object.keys(grouped).length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      {isLoading ? (
        <PageLoader />
      ) : !filtered.length ? (
        <EmptyState
          icon={Key}
          title="No permissions found"
          description={
            search ? "Try a different search term" : "No permissions configured"
          }
        />
      ) : viewMode === "grid" ? (
        <div className="overflow-auto">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.keys(grouped)
              .sort()
              .map((module) => (
                <Card key={module} className="card-lift">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-sm">
                      <span className="uppercase tracking-wider text-foreground">
                        {module}
                      </span>
                      <Badge
                        variant="secondary"
                        className="text-[11px] font-normal"
                      >
                        {grouped[module].length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1.5">
                      {grouped[module].map((perm) => (
                        <Badge
                          key={perm.id}
                          variant={perm.isActive ? "outline" : "secondary"}
                          className="text-[11px] font-normal"
                        >
                          {perm.action}
                          {!perm.isActive && (
                            <span className="ml-1 text-muted-foreground">
                              (inactive)
                            </span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ) : (
        <div className="rounded-md border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Module
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Action
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Description
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((perm) => (
                  <TableRow key={perm.id} className="group hover:bg-muted/50">
                    <TableCell className="text-sm font-medium text-foreground">
                      {perm.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-[11px] uppercase font-normal"
                      >
                        {perm.module}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-foreground">
                      {perm.action}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">
                      {perm.description || "—"}
                    </TableCell>
                    <TableCell>
                      {perm.isActive ? (
                        <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 text-[11px] border border-emerald-200 dark:border-emerald-800">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-[11px]">
                          Inactive
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
