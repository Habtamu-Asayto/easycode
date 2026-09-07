
"use client";

import { AppShell } from "@/presentation/components/layout";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();

  if (status === "loading") return <div>Loading...</div>;

  if (status === "unauthenticated") {
    redirect("/login");
  }

  return <AppShell>{children}</AppShell>;
}
