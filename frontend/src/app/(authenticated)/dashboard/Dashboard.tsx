"use client";

import { useAuth } from "@/presentation/hooks/use-auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Package,
  Truck,
  Factory,
  Users,
  Activity,
  MapPin,
} from "lucide-react";
import Link from "next/link";
 
export default function Dashboard() 
{
  // ── Mock Data ─────────────────────────────────────────────────────────────────
  const kpiCards = [
    {
      title: "Title One",
      value: "71.6M",
      unit: "Uni 1",
      change: "+12.5%",
      trend: "up" as const,
      icon: Factory,
      color: "text-teal-600",
      bg: "bg-teal-50 dark:bg-teal-950/30",
    },
    {
      title: "Title 2",
      value: "2.9M",
      unit: "Unit 2",
      change: "+8.3%",
      trend: "up" as const,
      icon: Package,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      title: "Title 3",
      value: "45.2K",
      unit: "Unit 3",
      change: "+5.1%",
      trend: "up" as const,
      icon: Truck,
      color: "text-cyan-600",
      bg: "bg-cyan-50 dark:bg-cyan-950/30",
    },
    {
      title: "Title 4",
      value: "1,284",
      unit: "Unit 4",
      change: "-2.4%",
      trend: "down" as const,
      icon: Users,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
  ];

  const quarterlyData = [
    { quarter: "Q1 2024", urea: 15200, dap: 8400, nps: 6200, total: 29800 },
    { quarter: "Q2 2024", urea: 18500, dap: 9200, nps: 7100, total: 34800 },
    { quarter: "Q3 2024", urea: 22100, dap: 11300, nps: 8400, total: 41800 },
    { quarter: "Q4 2024", urea: 19800, dap: 10100, nps: 7800, total: 37700 },
    { quarter: "Q1 2025", urea: 24300, dap: 12500, nps: 9200, total: 46000 },
    { quarter: "Q2 2025", urea: 26700, dap: 13800, nps: 10100, total: 50600 },
  ];

  const regionDistribution = [
    { name: "Oromia" , value: 32, color: "#0d9488" },
    { name: "Amhara", value: 24, color: "#059669" },
    { name: "SNNP", value: 18, color: "#0891b2" },
    { name: "Tigray", value: 12, color: "#7c3aed" },
    { name: "Sidama", value: 8, color: "#2563eb" },
    { name:"Other", value: 6, color: "#94a3b8" },
  ];

  const fertilizerBreakdown = [
    { name: "Urea", value: 45, color: "#0d9488" },
    { name: "DAP", value: 28, color: "#059669" },
    { name: "NPS", value: 18, color: "#0891b2" },
    { name:"Blended", value: 9, color: "#7c3aed" },
  ];

  const recentActivities = [
    {
      action: "ROLE_CREATED",
      entity: "Role",
      user: "Admin User",
      time: "2 min ago",
      detail:"Created new role",
    },
    {
      action: "USER_CREATED",
      entity: "User",
      user: "Admin User",
      time: "15 min ago",
      detail: "Added new user" + 'Kebede Alemu',
    },
    {
      action: "PERMISSION_UPDATED",
      entity: "Permission",
      user: "Super Admin",
      time: "1 hr ago",
      detail: `"Updated permission": distribution:manage`,
    },
    {
      action: "USER_LOGGED_IN",
      entity: "User",
      user: "Tigist Bekele",
      time: "2 hrs ago",
      detail: `"Logged in from" Addis Ababa`,
    },
    {
      action: "ROLE_UPDATED",
      entity: "Role",
      user: "Admin User",
      time: "3 hrs ago",
      detail: `"Updated permissions for" 'zone_staff'`,
    },
  ];

  const topRegions = [
    {
      region: "oromia",
      allocated: 125000,
      distributed: 98500,
      percentage: 78.8,
    },
    {
      region:"amhara",
      allocated: 98000,
      distributed: 82300,
      percentage: 84.0,
    },
    {
      region: "snnp",
      allocated: 72000,
      distributed: 58400,
      percentage: 81.1,
    },
    {
      region: "tigray",
      allocated: 45000,
      distributed: 31200,
      percentage: 69.3,
    },
    {
      region: "sidama",
      allocated: 35000,
      distributed: 29800,
      percentage: 85.1,
    },
  ];

  const { user } = useAuth();

  const getActionColor = (action: string) => {
    if (action.includes("CREATED"))
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
    if (action.includes("DELETED"))
      return "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    if (action.includes("UPDATED"))
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
    if (action.includes("LOGGED"))
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
    return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600";
  };

  return (
    <div className="p-6 space-y-6">
      {/* ── Page header ─────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Welcome back, {user?.firstName}.{" "}
          Here&apos; your Fullstack sample dashboard
        </p>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────── */}
      <div>
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpiCards.map((kpi) => (
              <Card key={kpi.title} className="card-lift">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        {kpi.title}
                      </p>
                      <div className="mt-2 flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold text-foreground">
                          {kpi.value}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {kpi.unit}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-1">
                        {kpi.trend === "up" ? (
                          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                        )}
                        <span
                          className={`text-[12px] font-medium ${
                            kpi.trend === "up"
                              ? "text-emerald-600"
                              : "text-red-600"
                          }`}
                        >
                          {kpi.change}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          vs last quarter
                        </span>
                      </div>
                    </div>
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${kpi.bg}`}
                    >
                      <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Quarterly Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    Quarterly Fertilizer Data
                  </CardTitle>
                  <Badge variant="outline" className="text-[11px] font-normal">
                    2024-2025
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[320px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={quarterlyData}>
                      <defs>
                        <linearGradient
                          id="ureaGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#0d9488"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#0d9488"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="dapGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#059669"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#059669"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="npsGrad"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#0891b2"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#0891b2"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="quarter"
                        tick={{ fontSize: 12 }}
                        stroke="#9ca3af"
                      />
                      <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "12px" }} />
                      <Area
                        type="monotone"
                        dataKey="urea"
                        name="UREA"
                        stroke="#0d9488"
                        fill="url(#ureaGrad)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="dap"
                        name="DAP"
                        stroke="#059669"
                        fill="url(#dapGrad)"
                        strokeWidth={2}
                      />
                      <Area
                        type="monotone"
                        dataKey="nps"
                        name="NPS"
                        stroke="#0891b2"
                        fill="url(#npsGrad)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Region Distribution Pie */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Distribution By Region
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={regionDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {regionDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Share"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {regionDistribution.map((r) => (
                    <div
                      key={r.name}
                      className="flex items-center gap-2 text-[12px]"
                    >
                      <div
                        className="h-2.5 w-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: r.color }}
                      />
                      <span className="text-muted-foreground">{r.name}</span>
                      <span className="ml-auto font-medium text-foreground">
                        {r.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Row */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Regional Performance Bar Chart */}
            <Card className="lg:col-span-2">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    Regional Allocation vs Distribution
                  </CardTitle>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <div className="h-2.5 w-2.5 rounded-sm bg-teal-500" />
                            Allocated
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2.5 w-2.5 rounded-sm bg-emerald-400" />
                         Distributed
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topRegions} layout="vertical" barGap={2}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e5e7eb"
                        horizontal={false}
                      />
                      <XAxis
                        type="number"
                        tick={{ fontSize: 11 }}
                        stroke="#9ca3af"
                      />
                      <YAxis
                        dataKey="region"
                        type="category"
                        tick={{ fontSize: 12 }}
                        stroke="#9ca3af"
                        width={60}
                      />
                      <Tooltip
                        formatter={(value) =>
                          Number(value).toLocaleString() + " MT"
                        }
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar
                        dataKey="allocated"
                        name="Allocated"
                        fill="#0d9488"
                        radius={[0, 4, 4, 0]}
                      />
                      <Bar
                        dataKey="distributed"
                        name="Distributed"
                        fill="#34d399"
                        radius={[0, 4, 4, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-foreground">
                   Recent Activity
                  </CardTitle>
                  <Link
                    href="/audit-logs"
                    className="text-xs text-primary hover:underline"
                  >
                    View All
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivities.map((activity, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0"
                    >
                      <div className="mt-0.5">
                        <Activity className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${getActionColor(activity.action)} text-[10px] px-1.5 py-0 border`}
                          >
                            {activity.action.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <p className="mt-0.5 text-xs text-foreground truncate">
                          {activity.detail}
                        </p>
                        <p className="text-[10px] text-muted-foreground">
                          {activity.user} · {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fertilizer Type Breakdown + Quick Links */}
          <div className="grid gap-6 lg:grid-cols-4">
            {/* Fertilizer Breakdown */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground">
                  By Fertilizer Type
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[160px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={fertilizerBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={65}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {fertilizerBreakdown.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [`${value}%`, "Share"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 mt-1">
                  {fertilizerBreakdown.map((f) => (
                    <div
                      key={f.name}
                      className="flex items-center justify-between text-[12px]"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: f.color }}
                        />
                        <span className="text-muted-foreground">{f.name}</span>
                      </div>
                      <span className="font-medium text-foreground">
                        {f.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Access Links */}
            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Quick Access
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      title: "Create, edit, and manage user accounts",
                      description:"Create, edit, and manage user accounts",
                      icon: Users,
                      href: "/users",
                      color: "text-teal-600",
                      bg: "bg-teal-50 dark:bg-teal-950/30",
                    },
                    {
                      title: "Role Management",
                      description: "Define roles and assign permissions",
                      icon: Package,
                      href: "/roles",
                      color: "text-emerald-600",
                      bg: "bg-emerald-50 dark:bg-emerald-950/30",
                    },
                    {
                      title: "View and manage system permissions",
                      description: "View and manage system permissions",
                      icon: MapPin,
                      href: "/permissions",
                      color: "text-cyan-600",
                      bg: "bg-cyan-50 dark:bg-cyan-950/30",
                    },
                    {
                      title: "Audit Logs",
                      description: "Track system activities and changes",
                      icon: Activity,
                      href: "/audit-logs",
                      color: "text-violet-600",
                      bg: "bg-violet-50 dark:bg-violet-950/30",
                    },
                  ].map((link) => (
                    <Link key={link.href} href={link.href}>
                      <div className="flex items-start gap-3 rounded-md border p-3.5 transition-all hover:shadow-sm hover:border-primary/30 cursor-pointer h-full">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${link.bg}`}
                        >
                          <link.icon className={`h-4 w-4 ${link.color}`} />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-foreground">
                            {link.title}
                          </h4>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {link.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
