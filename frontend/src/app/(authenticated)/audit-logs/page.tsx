"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { auditApi } from "@/infrastructure/rbac/api";
import {
  DataPagination,
  PageLoader,
  EmptyState,
} from "@/presentation/components/shared";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { FileText, Activity, Users as UsersIcon, Shield } from "lucide-react";
import { format } from "date-fns";

const AUDIT_ACTIONS = [
  "USER_CREATED",
  "USER_UPDATED",
  "USER_DELETED",
  "USER_LOGGED_IN",
  "USER_LOGGED_OUT",
  "USER_PASSWORD_CHANGED",
  "USER_PASSWORD_RESET",
  "USER_LOCKED",
  "USER_UNLOCKED",
  "USER_ACTIVATED",
  "USER_DEACTIVATED",
  "ROLE_CREATED",
  "ROLE_UPDATED",
  "ROLE_DELETED",
  "PERMISSION_CREATED",
  "PERMISSION_UPDATED",
  "PERMISSION_DELETED",
];

export default function AuditLogsPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [action, setAction] = useState<string>("");
  const [entity, setEntity] = useState<string>("");

  const { data, isLoading } = useQuery({
    queryKey: ["audit-logs", page, limit, action, entity],
    queryFn: () =>
      auditApi.getAll({
        page,
        limit,
        ...(action && action !== "all" && { action }),
        ...(entity && entity !== "all" && { entity }),
      }),
  });

  const stats = useMemo(() => {
    if (!data?.data)
      return {
        total: 0,
        users: 0,
        entities: new Set<string>(),
        actions: new Set<string>(),
      };
    const logs = data.data;
    return {
      total: data.meta?.total ?? logs.length,
      users: new Set(logs.map((l) => l.userId)).size,
      entities: new Set(logs.map((l) => l.entity)).size,
      actions: new Set(logs.map((l) => l.action)).size,
    };
  }, [data]);

  const getActionColor = (action: string) => {
    if (action.includes("CREATED"))
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
    if (action.includes("DELETED"))
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    if (
      action.includes("UPDATED") ||
      action.includes("CHANGED") ||
      action.includes("RESET")
    )
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    if (action.includes("LOCKED") || action.includes("DEACTIVATED"))
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
    return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600";
  };

  return (
    <div className="p-6 space-y-6">
      {/* ── Page header + command bar ───────────────────────────────────── */}
      <div className="space-y-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Audit Logs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Track all system activities and changes
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Logs",
            value: stats.total,
            icon: FileText,
            iconBg: "bg-primary/10",
            iconColor: "text-primary",
          },
          {
            label: "Unique Users",
            value: stats.users,
            icon: UsersIcon,
            iconBg: "bg-blue-50 dark:bg-blue-950/30",
            iconColor: "text-blue-600",
          },
          {
            label: "Entity Types",
            value: stats.entities,
            icon: Shield,
            iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
            iconColor: "text-emerald-600",
          },
          {
            label: "Action Types",
            value: stats.actions,
            icon: Activity,
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

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select
          value={action}
          onValueChange={(v) => {
            setAction(v ?? "");
            setPage(1);
          }}
        >
          <SelectTrigger className="h-8 w-48 text-sm">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Actions</SelectItem>
            {AUDIT_ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>
                {a.replace(/_/g, " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={entity}
          onValueChange={(v) => {
            setEntity(v ?? "");
            setPage(1);
          }}
        >
          <SelectTrigger className="h-8 w-40 text-sm">
            <SelectValue placeholder="Filter by entity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Entities</SelectItem>
            <SelectItem value="User">User</SelectItem>
            <SelectItem value="Role">Role</SelectItem>
            <SelectItem value="Permission">Permission</SelectItem>
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-muted-foreground">
          Showing {data?.data?.length ?? 0} of {stats.total} records
        </span>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      {isLoading ? (
        <PageLoader />
      ) : !data?.data?.length ? (
        <EmptyState
          icon={FileText}
          title="No audit logs found"
          description="Activity logs will appear here as users perform actions"
        />
      ) : (
        <div className="rounded-md border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Date & Time
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    User
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Action
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Entity
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    Entity ID
                  </TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground">
                    IP Address
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((log) => (
                  <TableRow key={log.id} className="group hover:bg-muted/50">
                    <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                      {format(new Date(log.createdAt), "MMM d, yyyy HH:mm:ss")}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {log.user?.firstName} {log.user?.lastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {log.user?.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${getActionColor(log.action)} text-[11px] border`}
                      >
                        {log.action.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="text-[11px] font-normal"
                      >
                        {log.entity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono max-w-[120px] truncate">
                      {log.entityId || "—"}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.ipAddress || "—"}
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
    </div>
  );
}
