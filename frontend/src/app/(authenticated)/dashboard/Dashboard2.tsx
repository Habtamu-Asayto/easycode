"use client";

import { useAuth } from "@/presentation/hooks/use-auth";

import { ArrowUpRight, Sparkles } from "lucide-react";

import { StatCards } from "@/presentation/components/layout/d2/stat-cards";
import { PatientFlowChart } from "@/presentation/components/layout/d2/patient-flow-chart";
import { DepartmentChart } from "@/presentation/components/layout/d2/department-chart";
import { AppointmentsChart } from "@/presentation/components/layout/d2/appointments-chart";
import { AppointmentQueue } from "@/presentation/components/layout/d2/appointment-queue";
import { ActivityFeed } from "@/presentation/components/layout/d2/activity-feed";
import { DoctorRoster } from "@/presentation/components/layout/d2/doctor-roster";

export default function Dashboard2() {
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
    <div className="mx-auto flex max-w-[1400px] flex-col gap-6">
      {/* Welcome banner */}
      <section className="animate-fade-up overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary to-[var(--chart-3)] p-6 text-primary-foreground sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
              <Sparkles className="size-3.5" />
              Live overview
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-3xl">
              Good morning, Dr. Reyes
            </h1>
            <p className="mt-1.5 max-w-lg text-sm text-primary-foreground/85">
              Your clinic is running smoothly. 428 patients seen today across 5
              departments, with 12 appointments still in the queue.
            </p>
          </div>
          <a
            href="#"
            className="inline-flex items-center gap-1.5 rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold backdrop-blur-sm transition-colors hover:bg-white/25"
          >
            Full report
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </section>

      {/* KPI cards */}
      <StatCards />

      {/* Charts row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <PatientFlowChart />
        </div>
        <DepartmentChart />
      </div>

      {/* Secondary row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AppointmentsChart />
        </div>
        <DoctorRoster />
      </div>

      {/* Bottom row */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AppointmentQueue />
        </div>
        <ActivityFeed />
      </div>
    </div>
  );
}
