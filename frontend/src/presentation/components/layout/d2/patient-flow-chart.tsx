"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { patientFlow } from "@/lib/sample.data";

const series = [
  { key: "outpatient", label: "Outpatient", color: "var(--chart-1)" },
  { key: "admitted", label: "Admitted", color: "var(--chart-2)" },
  { key: "discharged", label: "Discharged", color: "var(--chart-4)" },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="border-border bg-popover rounded-xl border px-3 py-2 shadow-lg">
      <p className="text-foreground mb-1.5 text-xs font-semibold">{label}</p>
      <div className="flex flex-col gap-1">
        {payload.map((p: any) => (
          <div key={p.dataKey} className="flex items-center gap-2 text-xs">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: p.color }}
            />
            <span className="text-muted-foreground capitalize">
              {p.dataKey}
            </span>
            <span className="text-foreground ml-auto font-mono font-semibold">
              {p.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PatientFlowChart() {
  return (
    <Card className="animate-fade-up" style={{ animationDelay: "120ms" }}>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Patient Flow</CardTitle>
            <p className="text-muted-foreground mt-1 text-xs">
              Admissions, discharges & outpatient volume
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              {series.map((s) => (
                <div
                  key={s.key}
                  className="text-muted-foreground flex items-center gap-1.5 text-xs"
                >
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: s.color }}
                  />
                  {s.label}
                </div>
              ))}
            </div>
            <Badge variant="outline">This week</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={patientFlow}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
            >
              <defs>
                {series.map((s) => (
                  <linearGradient
                    key={s.key}
                    id={`flow-${s.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={s.color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={s.color} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
              />
              {series.map((s) => (
                <Area
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  stroke={s.color}
                  strokeWidth={2.5}
                  fill={`url(#flow-${s.key})`}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
