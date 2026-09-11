"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { doctors, type Doctor } from "@/lib/sample.data";
import { cn } from "@/lib/utils";

const statusMeta: Record<
  Doctor["status"],
  { label: string; dot: string; text: string }
> = {
  available: {
    label: "Available",
    dot: "bg-[var(--success)]",
    text: "text-[var(--success)]",
  },
  "in-surgery": {
    label: "In surgery",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
  off: {
    label: "Off duty",
    dot: "bg-muted-foreground/50",
    text: "text-muted-foreground",
  },
};

export function DoctorRoster() {
  return (
    <Card className="animate-fade-up" style={{ animationDelay: "300ms" }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">On-Call Staff</CardTitle>
          <span className="text-muted-foreground text-xs">
            {doctors.filter((d) => d.status === "available").length} available
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-1">
          {doctors.map((doc) => {
            const meta = statusMeta[doc.status];
            return (
              <li
                key={doc.name}
                className="border-border bg-background/40 flex items-center gap-3 rounded-xl border p-3"
              >
                <div className="relative">
                  <span className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-[var(--chart-2)]/80 to-[var(--chart-1)]/80 text-xs font-bold text-white">
                    {doc.initials}
                  </span>
                  <span
                    className={cn(
                      "ring-card absolute -right-0.5 -bottom-0.5 size-3 rounded-full ring-2",
                      meta.dot,
                    )}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground truncate text-sm font-semibold">
                    {doc.name}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {doc.specialty}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={cn("text-[11px] font-medium", meta.text)}>
                    {meta.label}
                  </span>
                  <span className="text-muted-foreground text-[11px]">
                    {doc.patients} patients
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
