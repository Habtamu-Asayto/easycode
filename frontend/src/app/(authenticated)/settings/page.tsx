"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Activity,
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  KeyRound,
  Languages,
  LockKeyhole,
  LogIn,
  Mail,
  MapPin,
  MonitorSmartphone,
  Palette,
  Phone,
  Shield,
  ShieldCheck,
  User,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { authApi, auditApi, usersApi } from "@/infrastructure/rbac/api";
import { useAuth } from "@/presentation/hooks";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";

import { Button } from "@/presentation/components/ui/button";

import { Input } from "@/presentation/components/ui/input";

import { Label } from "@/presentation/components/ui/label";

import { Badge } from "@/presentation/components/ui/badge";

import { Separator } from "@/presentation/components/ui/separator";

import { Switch } from "@/presentation/components/ui/switch";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/presentation/components/ui/tabs";

import { cn } from "@/lib/utils";

type SettingsSection = "profile" | "security" | "notifications" | "preferences";

const settingsItems = [
  {
    id: "profile" as const,
    label: "Profile",
    description: "Personal information",
    icon: UserRound,
  },
  {
    id: "security" as const,
    label: "Security",
    description: "Password & activity",
    icon: ShieldCheck,
  },
  {
    id: "notifications" as const,
    label: "Notifications",
    description: "Alerts & messages",
    icon: Bell,
  },
  {
    id: "preferences" as const,
    label: "Preferences",
    description: "Appearance & language",
    icon: Palette,
  },
];

function getErrorMessage(error: unknown): string {
  const err = error as {
    response?: {
      data?: {
        message?: string | string[];
        error?: string;
      };
    };
    message?: string;
  };

  const message = err?.response?.data?.message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  if (typeof message === "string") {
    return message;
  }

  if (err?.response?.data?.error) {
    return err.response.data.error;
  }

  if (err?.message) {
    return err.message;
  }

  return "Something went wrong. Please try again.";
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "Never";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getInitials(
  firstName?: string | null,
  lastName?: string | null,
): string {
  const first = firstName?.trim().charAt(0) ?? "";
  const last = lastName?.trim().charAt(0) ?? "";

  return `${first}${last}`.toUpperCase() || "U";
}

function formatAuditAction(action: string): string {
  return action
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function AccountSettingsPage() {
  const queryClient = useQueryClient();
  const { user: authUser } = useAuth();

  const [section, setSection] = useState<SettingsSection>("profile");
  const [mobileOpen, setMobileOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [language, setLanguage] = useState("system");
  const [theme, setTheme] = useState("system");

  /*
   * --------------------------------------------------------------------------
   * PROFILE
   * --------------------------------------------------------------------------
   */

  const profileQuery = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: authApi.getProfile,
  });

  const profile = profileQuery.data?.data ?? null;
  /*
   * useAuth() is still used as requested for authenticated identity.
   *
   * auth/profile is treated as the authoritative editable profile because
   * it comes directly from the backend.
   */
 
  const profileMutation = useMutation({
    mutationFn: async () => {
      if (!profile?.id) {
        throw new Error("Authenticated user profile was not found.");
      }

      return usersApi.update(profile.id, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        mobileNumber: mobileNumber.trim() || null,
      });
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["auth", "profile"],
      });

      /*
       * Refresh any user-dependent queries as well.
       */
      await queryClient.invalidateQueries({
        queryKey: ["users"],
      });

      toast.success("Profile updated successfully.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const profileChanged = useMemo(() => {
    if (!profile) return false;

    return (
      firstName.trim() !== (profile.firstName ?? "") ||
      lastName.trim() !== (profile.lastName ?? "") ||
      email.trim() !== (profile.email ?? "") ||
      mobileNumber.trim() !== (profile.mobileNumber ?? "")
    );
  }, [profile, firstName, lastName, email, mobileNumber]);

  /*
   * --------------------------------------------------------------------------
   * SECURITY / AUDIT
   * --------------------------------------------------------------------------
   */

  const auditQuery = useQuery({
    queryKey: ["audit-logs", "me", profile?.id],
    queryFn: () => auditApi.getAll({ userId: profile!.id }),
    enabled: Boolean(profile?.id),
  });

  const auditLogs = auditQuery.data?.items ?? [];

  const passwordMutation = useMutation({
    mutationFn: authApi.changePassword,

    onSuccess: async () => {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordDialogOpen(false);

      await queryClient.invalidateQueries({
        queryKey: ["audit-logs", "me", profile?.id],
      });

      toast.success("Password changed successfully.");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please complete all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirmation do not match.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must contain at least 8 characters.");
      return;
    }

    passwordMutation.mutate({
      currentPassword,
      newPassword,
    });
  };

  /*
   * --------------------------------------------------------------------------
   * PROFILE HELPERS
   * --------------------------------------------------------------------------
   */

  const initials = getInitials(profile?.firstName, profile?.lastName);

  const fullName =
    `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim() || "User";

  const locationParts = [
    profile?.region?.name,
    profile?.zone?.name,
    profile?.woreda?.name,
    profile?.kebele?.name,
  ].filter(Boolean);
  /*
   * --------------------------------------------------------------------------
   * RENDER
   * --------------------------------------------------------------------------
   */

  return (
    <div className="bg-muted/20 min-h-full">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* ---------------------------------------------------------------- */}
        {/* HEADER                                                            */}
        {/* ---------------------------------------------------------------- */}

        <div className="mb-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Account settings
            </h1>

            <p className="text-muted-foreground text-sm">
              Manage your profile, security and account preferences.
            </p>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* SETTINGS LAYOUT                                                   */}
        {/* ---------------------------------------------------------------- */}

        <div className="bg-background overflow-hidden rounded-2xl border shadow-sm">
          <div className="flex min-h-[680px] flex-col lg:flex-row">
            {/* ============================================================ */}
            {/* DESKTOP SIDEBAR                                                */}
            {/* ============================================================ */}

            <aside className="bg-muted/20 hidden w-[250px] shrink-0 border-r p-3 lg:block">
              <div className="sticky top-4">
                <div className="mb-4 px-3 py-2">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Settings
                  </p>
                </div>

                <nav className="space-y-1">
                  {settingsItems.map((item) => {
                    const Icon = item.icon;
                    const active = section === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSection(item.id)}
                        className={cn(
                          "group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all",
                          active
                            ? "bg-background ring-border shadow-sm ring-1"
                            : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
                        )}
                      >
                        <div
                          className={cn(
                            "flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                            active
                              ? "bg-primary text-primary-foreground"
                              : "bg-background text-muted-foreground group-hover:text-foreground",
                          )}
                        >
                          <Icon className="size-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "text-sm font-medium",
                              active && "text-foreground",
                            )}
                          >
                            {item.label}
                          </p>

                          <p className="text-muted-foreground truncate text-[11px]">
                            {item.description}
                          </p>
                        </div>

                        {active && (
                          <ChevronRight className="text-muted-foreground size-4" />
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* ============================================================ */}
            {/* MOBILE SETTINGS NAV                                            */}
            {/* ============================================================ */}

            <div className="border-b p-3 lg:hidden">
              <button
                type="button"
                onClick={() => setMobileOpen((value) => !value)}
                className="bg-muted/20 flex w-full items-center justify-between rounded-xl border p-3"
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const activeItem = settingsItems.find(
                      (item) => item.id === section,
                    );

                    const Icon = activeItem?.icon ?? UserRound;

                    return (
                      <>
                        <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-lg">
                          <Icon className="size-4" />
                        </div>

                        <div className="text-left">
                          <p className="text-sm font-medium">
                            {activeItem?.label}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {activeItem?.description}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <ChevronRight
                  className={cn(
                    "size-4 transition-transform",
                    mobileOpen && "rotate-90",
                  )}
                />
              </button>

              {mobileOpen && (
                <div className="mt-2 space-y-1">
                  {settingsItems.map((item) => {
                    const Icon = item.icon;
                    const active = section === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSection(item.id);
                          setMobileOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-xl p-3 text-left",
                          active
                            ? "bg-primary/10 text-primary"
                            : "hover:bg-muted",
                        )}
                      >
                        <Icon className="size-4" />

                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-muted-foreground text-xs">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ============================================================ */}
            {/* CONTENT                                                        */}
            {/* ============================================================ */}

            <main className="min-w-0 flex-1">
              {/* ========================================================== */}
              {/* PROFILE                                                      */}
              {/* ========================================================== */}

              {section === "profile" && (
                <section className="p-5 sm:p-7 lg:p-8">
                  <div className="mb-7">
                    <h2 className="text-xl font-semibold">Profile</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Manage your personal information and account details.
                    </p>
                  </div>

                  {profileQuery.isLoading ? (
                    <div className="space-y-5">
                      <div className="bg-muted h-28 animate-pulse rounded-2xl" />
                      <div className="bg-muted h-56 animate-pulse rounded-2xl" />
                    </div>
                  ) : profileQuery.isError ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <X className="text-destructive mb-3 size-8" />
                        <p className="font-medium">
                          Unable to load your profile
                        </p>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {getErrorMessage(profileQuery.error)}
                        </p>

                        <Button
                          className="mt-5"
                          variant="outline"
                          onClick={() => profileQuery.refetch()}
                        >
                          Try again
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-6">
                      {/* Account identity */}

                      <Card className="overflow-hidden">
                        <CardContent className="p-0">
                          <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-6">
                            {/* Avatar */}
                            <div className="bg-primary text-primary-foreground flex size-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-semibold shadow-sm">
                              {initials}
                            </div>

                            {/* Identity */}
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-semibold">
                                  {fullName}
                                </h3>

                                <Badge
                                  variant={
                                    profile?.isActive ? "default" : "secondary"
                                  }
                                >
                                  {profile?.isActive ? "Active" : "Inactive"}
                                </Badge>

                                {profile?.isLocked && (
                                  <Badge variant="destructive">Locked</Badge>
                                )}
                              </div>

                              <p className="text-muted-foreground mt-1 text-sm">
                                @{profile?.username}
                              </p>

                              <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                                <span className="flex items-center gap-1.5">
                                  <Mail className="size-3.5" />
                                  {profile?.email}
                                </span>

                                {profile?.mobileNumber && (
                                  <span className="flex items-center gap-1.5">
                                    <Phone className="size-3.5" />
                                    {profile.mobileNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Personal information */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Personal information
                          </CardTitle>
                          <CardDescription>
                            Update the information associated with your account.
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">
                          <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">First name</Label>

                              <Input
                                id="firstName"
                                value={firstName}
                                onChange={(event) =>
                                  setFirstName(event.target.value)
                                }
                                disabled={profileMutation.isPending}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="lastName">Last name</Label>

                              <Input
                                id="lastName"
                                value={lastName}
                                onChange={(event) =>
                                  setLastName(event.target.value)
                                }
                                disabled={profileMutation.isPending}
                              />
                            </div>
                          </div>

                          <div className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-2">
                              <Label htmlFor="email">Email</Label>

                              <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                  setEmail(event.target.value)
                                }
                                disabled={profileMutation.isPending}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="mobileNumber">
                                Mobile number
                              </Label>

                              <Input
                                id="mobileNumber"
                                value={mobileNumber}
                                placeholder="Not provided"
                                onChange={(event) =>
                                  setMobileNumber(event.target.value)
                                }
                                disabled={profileMutation.isPending}
                              />
                            </div>
                          </div>

                          <Separator />

                          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <p className="text-sm font-medium">Username</p>
                              <p className="text-muted-foreground text-xs">
                                Your username cannot be changed from this page.
                              </p>
                            </div>

                            <div className="bg-muted/50 rounded-lg px-3 py-2 text-sm font-medium">
                              @{profile?.username}
                            </div>
                          </div>

                          <div className="flex justify-end pt-2">
                            <Button
                              disabled={
                                !profileChanged || profileMutation.isPending
                              }
                              onClick={() => profileMutation.mutate()}
                            >
                              {profileMutation.isPending
                                ? "Saving..."
                                : "Save changes"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Roles and assignment */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-base">
                            Access & assignment
                          </CardTitle>
                          <CardDescription>
                            Information currently assigned to your account.
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-5">
                          <div>
                            <p className="mb-2 text-sm font-medium">Roles</p>

                            <div className="flex flex-wrap gap-2">
                              {profile?.roles?.length ? (
                                profile.roles.map((role) => (
                                  <Badge
                                    key={role.id}
                                    variant="secondary"
                                    className="rounded-lg px-3 py-1"
                                  >
                                    {role.displayName || role.name}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted-foreground text-sm">
                                  No roles assigned
                                </span>
                              )}
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <p className="mb-3 text-sm font-medium">
                              Geographic assignment
                            </p>

                            {locationParts.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {locationParts.map((location, index) => (
                                  <div
                                    key={`${location}-${index}`}
                                    className="bg-muted/20 flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                                  >
                                    {index === 0 && (
                                      <MapPin className="text-muted-foreground size-3.5" />
                                    )}
                                    {location}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-muted-foreground rounded-xl border border-dashed p-4 text-sm">
                                No geographic assignment is currently associated
                                with this account.
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </section>
              )}

              {/* ========================================================== */}
              {/* SECURITY                                                      */}
              {/* ========================================================== */}

              {section === "security" && (
                <section className="p-5 sm:p-7 lg:p-8">
                  <div className="mb-7">
                    <h2 className="text-xl font-semibold">Security</h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      Protect your account and review recent security activity.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Security overview */}
                    <Card>
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600">
                            <ShieldCheck className="size-6" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="font-semibold">Account security</p>

                            <p className="text-muted-foreground mt-1 text-sm">
                              Your account security information is based on the
                              current authenticated account.
                            </p>
                          </div>

                          <Badge
                            variant={
                              profile?.isLocked ? "destructive" : "secondary"
                            }
                            className="w-fit"
                          >
                            {profile?.isLocked
                              ? "Account locked"
                              : "Account protected"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Password */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <KeyRound className="size-4" />
                          Password
                        </CardTitle>

                        <CardDescription>
                          Change your account password. Your current password is
                          required.
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="bg-muted/20 flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              Account password
                            </p>

                            <p className="text-muted-foreground mt-1 text-xs">
                              Password changes are processed by the backend.
                            </p>
                          </div>

                          <Button
                            variant="outline"
                            onClick={() => setPasswordDialogOpen(true)}
                          >
                            Change password
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Account activity */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Activity className="size-4" />
                          Security activity
                        </CardTitle>

                        <CardDescription>
                          Recent audit events recorded for your account.
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        {auditQuery.isLoading ? (
                          <div className="space-y-3">
                            {[1, 2, 3].map((item) => (
                              <div
                                key={item}
                                className="bg-muted h-16 animate-pulse rounded-xl"
                              />
                            ))}
                          </div>
                        ) : auditQuery.isError ? (
                          <div className="rounded-xl border border-dashed p-6 text-center">
                            <p className="text-sm font-medium">
                              Unable to load security activity
                            </p>

                            <p className="text-muted-foreground mt-1 text-xs">
                              {getErrorMessage(auditQuery.error)}
                            </p>
                          </div>
                        ) : auditLogs.length === 0 ? (
                          <div className="rounded-xl border border-dashed p-8 text-center">
                            <Activity className="text-muted-foreground mx-auto mb-3 size-7" />

                            <p className="text-sm font-medium">
                              No audit activity available
                            </p>

                            <p className="text-muted-foreground mt-1 text-xs">
                              No security events have been returned for this
                              account.
                            </p>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {auditLogs.map((log) => (
                              <div
                                key={log.id}
                                className="hover:bg-muted/40 flex gap-4 rounded-xl p-3 transition-colors"
                              >
                                <div className="bg-muted mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg">
                                  {log.action
                                    .toLowerCase()
                                    .includes("login") ? (
                                    <LogIn className="size-4" />
                                  ) : (
                                    <Activity className="size-4" />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                                    <p className="text-sm font-medium">
                                      {formatAuditAction(log.action)}
                                    </p>

                                    <span className="text-muted-foreground flex items-center gap-1 text-xs">
                                      <Clock3 className="size-3" />
                                      {formatDate(log.createdAt)}
                                    </span>
                                  </div>

                                  <p className="text-muted-foreground mt-1 text-xs">
                                    {log.entity}
                                    {log.entityId ? ` · ${log.entityId}` : ""}
                                  </p>

                                  {(log.ipAddress || log.userAgent) && (
                                    <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                                      {log.ipAddress && (
                                        <span>IP: {log.ipAddress}</span>
                                      )}

                                      {log.userAgent && (
                                        <span className="max-w-full truncate">
                                          {log.userAgent}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Backend capability notice */}
                    <Card className="border-dashed">
                      <CardContent className="flex gap-4 p-5">
                        <MonitorSmartphone className="text-muted-foreground mt-0.5 size-5 shrink-0" />

                        <div>
                          <p className="text-sm font-medium">
                            Sessions & trusted devices
                          </p>

                          <p className="text-muted-foreground mt-1 text-sm">
                            The current RBAC API does not expose active sessions
                            or trusted-device management. No device information
                            is being fabricated here.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              )}

              {/* ========================================================== */}
              {/* NOTIFICATIONS                                                */}
              {/* ========================================================== */}

              {section === "notifications" && (
                <section className="p-5 sm:p-7 lg:p-8">
                  <div className="mb-7">
                    <h2 className="text-xl font-semibold">Notifications</h2>

                    <p className="text-muted-foreground mt-1 text-sm">
                      Control how your account receives notifications.
                    </p>
                  </div>

                  <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                      <div className="bg-muted mb-4 flex size-14 items-center justify-center rounded-2xl">
                        <Bell className="text-muted-foreground size-6" />
                      </div>

                      <h3 className="text-base font-semibold">
                        Notification preferences are not available yet
                      </h3>

                      <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
                        Your current RBAC API does not provide persisted
                        notification-preference endpoints. To keep this page
                        accurate, notification switches are intentionally not
                        stored only in browser state.
                      </p>

                      <Badge variant="secondary" className="mt-4">
                        Backend support required
                      </Badge>
                    </CardContent>
                  </Card>
                </section>
              )}

              {/* ========================================================== */}
              {/* PREFERENCES                                                  */}
              {/* ========================================================== */}

              {section === "preferences" && (
                <section className="p-5 sm:p-7 lg:p-8">
                  <div className="mb-7">
                    <h2 className="text-xl font-semibold">Preferences</h2>

                    <p className="text-muted-foreground mt-1 text-sm">
                      Configure appearance and language preferences.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {/* Appearance */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Palette className="size-4" />
                          Appearance
                        </CardTitle>

                        <CardDescription>
                          Choose how the application should appear.
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium">Theme</p>
                            <p className="text-muted-foreground mt-1 text-xs">
                              Current UI theme preference.
                            </p>
                          </div>

                          <Select
                            value={theme}
                            onValueChange={(value) => {
                              if (value !== null) {
                                setTheme(value);
                              }
                            }}
                          >
                            <SelectTrigger className="w-full sm:w-[180px]">
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="system">System</SelectItem>
                              <SelectItem value="light">Light</SelectItem>
                              <SelectItem value="dark">Dark</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Language */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                          <Languages className="size-4" />
                          Language
                        </CardTitle>

                        <CardDescription>
                          Select the language used by the application.
                        </CardDescription>
                      </CardHeader>

                      <CardContent>
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-medium">
                              Application language
                            </p>

                            <p className="text-muted-foreground mt-1 text-xs">
                              Language persistence is not currently exposed by
                              the RBAC API.
                            </p>
                          </div>

                          <Select value={language} onValueChange={(value)=>{
                            if(value !== null){
                              setLanguage(value)
                            }
                          }}>
                            <SelectTrigger className="w-full sm:w-[180px]">
                              <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                              <SelectItem value="system">
                                System default
                              </SelectItem>
                              <SelectItem value="en">English</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Accessibility */}
                    <Card className="border-dashed">
                      <CardContent className="flex gap-4 p-5">
                        <LockKeyhole className="text-muted-foreground mt-0.5 size-5 shrink-0" />

                        <div>
                          <p className="text-sm font-medium">
                            Accessibility preferences
                          </p>

                          <p className="text-muted-foreground mt-1 text-sm">
                            Persisted accessibility preferences are not
                            currently exposed by the backend, so no fake
                            settings are stored here.
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Persistence notice */}
                    <div className="bg-muted/20 flex items-start gap-3 rounded-xl border p-4">
                      <CheckCircle2 className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                      <p className="text-muted-foreground text-xs leading-5">
                        Theme and language controls are currently UI-level
                        controls only. Once user-preference endpoints are added
                        to the backend, they can be converted to React Query
                        mutations without changing this settings layout.
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>
      </div>

      {/* ================================================================== */}
      {/* CHANGE PASSWORD DIALOG                                             */}
      {/* ================================================================== */}

      <Dialog
        open={passwordDialogOpen}
        onOpenChange={(open) => {
          if (passwordMutation.isPending) return;

          setPasswordDialogOpen(open);

          if (!open) {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setShowCurrentPassword(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="bg-primary/10 text-primary mb-2 flex size-11 items-center justify-center rounded-xl">
              <KeyRound className="size-5" />
            </div>

            <DialogTitle>Change password</DialogTitle>

            <DialogDescription>
              Enter your current password and choose a new password for your
              account.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>

              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  disabled={passwordMutation.isPending}
                  autoComplete="current-password"
                  className="pr-20"
                />

                <button
                  type="button"
                  onClick={() => setShowCurrentPassword((value) => !value)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium"
                >
                  {showCurrentPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>

              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  disabled={passwordMutation.isPending}
                  autoComplete="new-password"
                  className="pr-20"
                />

                <button
                  type="button"
                  onClick={() => setShowNewPassword((value) => !value)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium"
                >
                  {showNewPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="text-muted-foreground text-xs">
                Use at least 8 characters.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>

              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  disabled={passwordMutation.isPending}
                  autoComplete="new-password"
                  className="pr-20"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 text-xs font-medium"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setPasswordDialogOpen(false)}
              disabled={passwordMutation.isPending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handlePasswordChange}
              disabled={passwordMutation.isPending}
            >
              {passwordMutation.isPending ? "Updating..." : "Update password"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
