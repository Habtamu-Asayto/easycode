"use client";

import { Clock, ChevronRight } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Badge } from "@/presentation/components/ui/badge";
import { appointments, type Appointment } from "@/lib/sample.data";
import { cn } from "@/lib/utils";

const statusStyles: Record<
  Appointment["status"],
  { label: string; className: string }
> = {
  "in-progress": {
    label: "In progress",
    className: "bg-primary/12 text-primary",
  },
  confirmed: {
    label: "Confirmed",
    className: "bg-[var(--success)]/12 text-[var(--success)]",
  },
  waiting: {
    label: "Waiting",
    className: "bg-amber-500/12 text-amber-600 dark:text-amber-400",
  },
};

export function AppointmentQueue() {
  return (
    <Card className="animate-fade-up" style={{ animationDelay: "220ms" }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Today&apos;s Queue</CardTitle>
          <a
            href="#"
            className="text-primary flex items-center gap-0.5 text-xs font-medium hover:underline"
          >
            View all
            <ChevronRight className="size-3.5" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="flex flex-col">
          {appointments.map((appt) => {
            const status = statusStyles[appt.status];
            return (
              <li
                key={appt.id}
                className="border-border flex items-center gap-3 border-b py-3 last:border-0 last:pb-0"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[var(--chart-1)]/80 to-[var(--chart-3)]/80 text-xs font-bold text-white">
                  {appt.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-foreground truncate text-sm font-semibold">
                      {appt.patient}
                    </p>
                    <Badge
                      variant="outline"
                      className="hidden shrink-0 text-[10px] sm:inline-flex"
                    >
                      {appt.dept}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground truncate text-xs">
                    {appt.reason} · {appt.doctor}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="text-foreground flex items-center gap-1 font-mono text-xs font-semibold">
                    <Clock className="text-muted-foreground size-3" />
                    {appt.time}
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-medium",
                      status.className,
                    )}
                  >
                    {status.label}
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
