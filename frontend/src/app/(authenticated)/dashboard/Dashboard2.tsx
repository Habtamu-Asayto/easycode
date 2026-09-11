"use client";

import { ArrowUpRight, Sparkles } from "lucide-react";

import { StatCards } from "@/presentation/components/layout/d2/stat-cards";
import { PatientFlowChart } from "@/presentation/components/layout/d2/patient-flow-chart";
import { DepartmentChart } from "@/presentation/components/layout/d2/department-chart";
import { AppointmentsChart } from "@/presentation/components/layout/d2/appointments-chart";
import { AppointmentQueue } from "@/presentation/components/layout/d2/appointment-queue";
import { ActivityFeed } from "@/presentation/components/layout/d2/activity-feed";
import { DoctorRoster } from "@/presentation/components/layout/d2/doctor-roster";
import { useAuth } from "@/presentation/hooks/use-auth";

export default function Dashboard2() {
  const user = useAuth();
  return (
    <main className="w-full px-4 py-7">
      <div className="flex w-full flex-col gap-[clamp(1rem,1.2vw,2rem)] px-[clamp(1rem,1vw,2rem)]">
        {/* Welcome banner */}
        <section className="animate-fade-up border-border from-primary/15 via-primary/10 text-foreground dark:from-primary/25 dark:via-primary/15 relative overflow-hidden rounded-2xl border bg-gradient-to-br to-[var(--chart-3)]/10 p-6 shadow-sm transition-colors sm:p-7 lg:p-8 2xl:p-9 dark:to-[var(--chart-3)]/15">
          {/* Decorative glow */}
          <div className="bg-primary/10 dark:bg-primary/15 pointer-events-none absolute -top-20 -right-20 size-64 rounded-full blur-3xl 2xl:size-80" />

          <div className="pointer-events-none absolute -bottom-24 left-1/3 size-72 rounded-full bg-[var(--chart-3)]/10 blur-3xl dark:bg-[var(--chart-3)]/15" />

          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="min-w-0">
              {/* Badge */}
              <div className="border-primary/15 bg-background/60 text-primary dark:border-primary/20 dark:bg-background/40 mb-3 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium shadow-sm backdrop-blur-sm">
                <Sparkles className="size-3.5" />
                Live overview
              </div>

              {/* Heading */}
              <h1 className="text-foreground text-2xl font-bold tracking-tight text-balance sm:text-3xl lg:text-4xl 2xl:text-[2.6rem]">
                Good morning, {user.user?.firstName}.{" "}
              </h1>

              {/* Description */}
              <p className="text-muted-foreground mt-2 max-w-2xl text-sm leading-6 lg:text-[15px] 2xl:text-base 2xl:leading-7">
                Your clinic is running smoothly. 428 patients seen today across
                5 departments, with 12 appointments still in the queue.
              </p>
            </div>

            {/* Action */}
            <a
              href="#"
              className="border-primary/15 bg-background/60 text-foreground hover:bg-background/80 dark:border-primary/20 dark:bg-background/40 dark:hover:bg-background/60 inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-4 py-2.5 text-sm font-semibold shadow-sm backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md 2xl:px-5 2xl:py-3"
            >
              Full report
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </section>

        {/* KPI cards */}
        <section>
          <StatCards />
        </section>

        {/* Charts row */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-7 2xl:gap-8">
          <div className="min-w-0 lg:col-span-2">
            <PatientFlowChart />
          </div>

          <div className="min-w-0">
            <DepartmentChart />
          </div>
        </section>

        {/* Secondary row */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-7 2xl:gap-8">
          <div className="min-w-0 lg:col-span-2">
            <AppointmentsChart />
          </div>

          <div className="min-w-0">
            <DoctorRoster />
          </div>
        </section>

        {/* Bottom row */}
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-7 2xl:gap-8">
          <div className="min-w-0 lg:col-span-2">
            <AppointmentQueue />
          </div>

          <div className="min-w-0">
            <ActivityFeed />
          </div>
        </section>
      </div>
    </main>
  );
}
