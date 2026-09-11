"use client";

import {
  BarChart,
  Bar,
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
import { appointmentsByHour } from "@/lib/sample.data";

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
              style={{ backgroundColor: p.fill }}
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

export function AppointmentsChart() {
  return (
    <Card className="animate-fade-up" style={{ animationDelay: "160ms" }}>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base">Appointments by Hour</CardTitle>
            <p className="text-muted-foreground mt-1 text-xs">
              Booked vs completed today
            </p>
          </div>
          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[var(--chart-1)]" />
              Booked
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-[var(--chart-2)]" />
              Completed
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={appointmentsByHour}
              margin={{ top: 8, right: 8, left: -16, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="4 4"
                stroke="var(--border)"
                vertical={false}
              />
              <XAxis
                dataKey="hour"
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
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              />
              <Bar
                dataKey="booked"
                fill="var(--chart-1)"
                radius={[4, 4, 0, 0]}
                maxBarSize={22}
              />
              <Bar
                dataKey="completed"
                fill="var(--chart-2)"
                radius={[4, 4, 0, 0]}
                maxBarSize={22}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
