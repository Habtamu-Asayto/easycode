"use client";

// import { AppShell } from "@/presentation/components/layout/d1";
import { AppShell } from "@/presentation/components/layout/d2/app-shell";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { PageLoader, CompleteLoader } from "@/presentation/components/shared";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === "loading") return <CompleteLoader />;

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
