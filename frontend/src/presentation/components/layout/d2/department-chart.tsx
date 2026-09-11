"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { departments } from "@/lib/sample.data";

export function DepartmentChart() {
  const total = departments.reduce((sum, d) => sum + d.value, 0);

  return (
    <Card className="animate-fade-up" style={{ animationDelay: "180ms" }}>
      <CardHeader>
        <CardTitle className="text-base">Department Load</CardTitle>
        <p className="text-muted-foreground mt-1 text-xs">
          Share of active cases
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={departments}
                cx="50%"
                cy="50%"
                innerRadius={58}
                outerRadius={82}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {departments.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-foreground font-mono text-2xl font-bold">
              {total}
            </span>
            <span className="text-muted-foreground text-[11px] tracking-wider uppercase">
              Active
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {departments.map((d) => (
            <div key={d.name} className="flex items-center gap-2.5 text-sm">
              <span
                className="size-2.5 rounded-full"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-muted-foreground">{d.name}</span>
              <span className="text-foreground ml-auto font-mono font-semibold">
                {d.value}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
