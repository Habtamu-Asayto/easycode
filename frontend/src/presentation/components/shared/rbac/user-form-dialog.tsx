"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Check,
  Eye,
  EyeOff,
  Info,
  Loader2,
  MapPinHouse,
  PackageCheck,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { usersApi, rolesApi } from "@/infrastructure/rbac/api";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import { GeographyHierarchySelector } from "@/presentation/components/shared";

import type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/domain/rbac/entities";
import { FormDialogSection, FormDialogShell } from "../form-dialog";

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserResponse | null;
  onSuccess: () => void;
}

export function UserFormDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: UserFormDialogProps) {
  const isEdit = !!user;

  // ---------------------------------------------------------------------------
  // Form state
  // ---------------------------------------------------------------------------

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Geography
  const [geography, setGeography] = useState({
    regionId: "",
    zoneId: "",
    woredaId: "",
    kebeleId: "",
  });

  const setGeographyField = (key: string, value: string | boolean) => {
    if (typeof value !== "string") return;

    setGeography((current) => {
      switch (key) {
        case "regionId":
          return {
            regionId: value,
            zoneId: "",
            woredaId: "",
            kebeleId: "",
          };

        case "zoneId":
          return {
            ...current,
            zoneId: value,
            woredaId: "",
            kebeleId: "",
          };

        case "woredaId":
          return {
            ...current,
            woredaId: value,
            kebeleId: "",
          };

        case "kebeleId":
          return {
            ...current,
            kebeleId: value,
          };

        default:
          return current;
      }
    });
  };

  // ---------------------------------------------------------------------------
  // Dialog drag state
  // ---------------------------------------------------------------------------

  const [position, setPosition] = useState({ x: 0, y: 0 });

  const dragStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  // ---------------------------------------------------------------------------
  // Lookup data
  // ---------------------------------------------------------------------------

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles", "all"],
    queryFn: () => rolesApi.getAll({ limit: 100 }),
    enabled: open,
  });

  // ---------------------------------------------------------------------------
  // Initialize / reset form
  // ---------------------------------------------------------------------------
  console.log("EDIT USER OBJECT FULL:", JSON.stringify(user, null, 2));

  useEffect(() => {
    if (!open) return;

    setPosition({ x: 0, y: 0 });
    setShowPassword(false);

    if (user) {
      setFirstName(user.firstName ?? "");
      setLastName(user.lastName ?? "");
      setUsername(user.username ?? "");
      setEmail(user.email ?? "");
      setMobileNumber(user.mobileNumber ?? "");
      setPassword("");

      setSelectedRoles(user.roles?.map((role) => role.id) ?? []);

      setGeography({
        regionId: user.region?.id ?? "",
        zoneId: user.zone?.id ?? "",
        woredaId: user.woreda?.id ?? "",
        kebeleId: user.kebele?.id ?? "",
      });

      return;
    }

    setFirstName("");
    setLastName("");
    setUsername("");
    setEmail("");
    setMobileNumber("");
    setPassword("");

    setSelectedRoles([]);

    setGeography({
      regionId: "",
      zoneId: "",
      woredaId: "",
      kebeleId: "",
    });
  }, [open, user]);

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------

  const createMutation = useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.create(data),

    onSuccess: () => {
      toast.success("User created successfully");
      onSuccess();
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create user");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateUserRequest) => usersApi.update(user!.id, data),

    onSuccess: () => {
      toast.success("User updated successfully");
      onSuccess();
    },

    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to update user");
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  // ---------------------------------------------------------------------------
  // Drag handlers
  // ---------------------------------------------------------------------------

  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (isLoading) return;

    isDragging.current = true;

    dragStart.current = {
      x: event.clientX - position.x,
      y: event.clientY - position.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    setPosition({
      x: event.clientX - dragStart.current.x,
      y: event.clientY - dragStart.current.y,
    });
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  // ---------------------------------------------------------------------------
  // Role selection
  // ---------------------------------------------------------------------------

  const toggleRole = (roleId: string) => {
    setSelectedRoles((current) =>
      current.includes(roleId)
        ? current.filter((id) => id !== roleId)
        : [...current, roleId],
    );
  };

  // ---------------------------------------------------------------------------
  // Geography
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const geographyFields = {
      regionId: geography.regionId || null,
      zoneId: geography.zoneId || null,
      woredaId: geography.woredaId || null,
      kebeleId: geography.kebeleId || null,
    };

    if (isEdit) {
      updateMutation.mutate({
        firstName,
        lastName,
        email,
        mobileNumber: mobileNumber || null,
        roleIds: selectedRoles,
        ...geographyFields,
      });

      return;
    }

    createMutation.mutate({
      firstName,
      lastName,
      username,
      email,
      password,
      mobileNumber: mobileNumber || null,
      roleIds: selectedRoles,
      ...geographyFields,
    });
  };

  // ---------------------------------------------------------------------------
  // Close
  // ---------------------------------------------------------------------------

  const handleClose = () => {
    if (!isLoading) {
      onOpenChange(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------

  const selectedRoleCount = selectedRoles.length;
  const availableRoleCount = rolesData?.items?.length ?? 0;

  return (
    <FormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      eyebrow={isEdit ? "USER MANAGEMENT" : "USER DIRECTORY"}
      title={isEdit ? "Update User Account" : "Create User Account"}
      description={
        isEdit
          ? "Update account information, access roles, and geographic assignment."
          : "Create a new system user and configure their access and geographic assignment."
      }
      icon={<UserRound className="size-5" />}
      onSubmit={handleSubmit}
      loading={isLoading}
      submitLabel={isEdit ? "Save changes" : "Create User"}
      loadingLabel={isEdit ? "Saving..." : "Creating..."}
    >
      {/* Top accent */}
      <div className="bg-primary absolute inset-x-0 top-0 h-1" />
 
      {/* ----------------------------------------------------------------- */}
      {/* Form */}
      {/* ----------------------------------------------------------------- */}

      <div className="space-y-6 px-5 py-6 sm:px-7">

          {/* ------------------------------------------------------------- */}
          {/* Information banner */}
          {/* ------------------------------------------------------------- */}

          <div className="border-primary/20 bg-primary/[0.06] flex gap-3 rounded-2xl border p-4">
            <Info className="text-primary mt-0.5 size-5 shrink-0" />

            <div>
              <p className="text-sm font-medium">
                {isEdit ? "Update user information" : "Add a new system user"}
              </p>

              <p className="text-muted-foreground mt-1 text-sm leading-6">
                {isEdit
                  ? "Changes to roles and geographic assignment will take effect after saving."
                  : "Complete the account information, assign roles, and optionally associate the user with a geographic area."}
              </p>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* Personal information */}
          {/* ------------------------------------------------------------- */}

          <FormDialogSection
            icon={<UserRound className="text-muted-foreground size-4" />}
            title="Personal Information"
            description="Basic account and contact details"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {/* First name */}
              <div className="space-y-2">
                <Label htmlFor="user-first-name">First Name</Label>

                <Input
                  id="user-first-name"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Enter first name"
                  required
                  disabled={isLoading}
                  className="bg-background h-11 rounded-xl"
                />
              </div>

              {/* Last name */}
              <div className="space-y-2">
                <Label htmlFor="user-last-name">Last Name</Label>

                <Input
                  id="user-last-name"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Enter last name"
                  required
                  disabled={isLoading}
                  className="bg-background h-11 rounded-xl"
                />
              </div>
            </div>

            {/* Username only during creation */}
            {!isEdit && (
              <div className="space-y-2">
                <Label htmlFor="user-username">Username</Label>

                <Input
                  id="user-username"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="Enter username"
                  required
                  disabled={isLoading}
                  className="bg-background h-11 rounded-xl"
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>

                <Input
                  id="user-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="user@example.com"
                  required
                  disabled={isLoading}
                  className="bg-background h-11 rounded-xl"
                />
              </div>

              {/* Mobile */}
              <div className="space-y-2">
                <Label htmlFor="user-mobile">Mobile Number</Label>

                <Input
                  id="user-mobile"
                  value={mobileNumber}
                  onChange={(event) => setMobileNumber(event.target.value)}
                  placeholder="+251 9..."
                  disabled={isLoading}
                  className="bg-background h-11 rounded-xl"
                />
              </div>
            </div>
          </FormDialogSection>

          {/* ------------------------------------------------------------- */}
          {/* Password */}
          {/* ------------------------------------------------------------- */}

          {!isEdit && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-muted flex size-8 items-center justify-center rounded-xl">
                  <ShieldCheck className="text-muted-foreground size-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Account Security</h3>

                  <p className="text-muted-foreground text-xs">
                    Initial authentication credentials
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="user-password">Password</Label>

                <div className="relative">
                  <Input
                    id="user-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    disabled={isLoading}
                    className="bg-background h-11 rounded-xl pr-11"
                  />

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    tabIndex={-1}
                    disabled={isLoading}
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-muted-foreground hover:text-foreground absolute top-1/2 right-1 size-9 -translate-y-1/2 rounded-lg"
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </Button>
                </div>

                <p className="text-muted-foreground text-xs">
                  Use at least 8 characters with uppercase, lowercase, number,
                  and special character.
                </p>
              </div>
            </section>
          )}

          {/* ------------------------------------------------------------- */}
          {/* Geography */}
          {/* ------------------------------------------------------------- */}

          <FormDialogSection
            icon={<MapPinHouse className="text-muted-foreground size-4" />}
            title="Geography Assignment"
            description="Associate the user with their administrative area"
          >
            <div className="bg-muted/20 rounded-2xl border p-4">
              <GeographyHierarchySelector
                fields={geography}
                setField={setGeographyField}
                isLoading={isLoading}
                level={4}
              />

              <div className="bg-background/60 mt-4 flex items-start gap-2 rounded-xl border border-dashed p-3">
                <Info className="text-muted-foreground mt-0.5 size-4 shrink-0" />

                <p className="text-muted-foreground text-xs leading-5">
                  Geography selections are hierarchical. Select a region before
                  choosing a zone, then a woreda and kebele.
                </p>
              </div>
            </div>
          </FormDialogSection>

          {/* ------------------------------------------------------------- */}
          {/* Roles */}
          {/* ------------------------------------------------------------- */}

          <section className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="bg-muted flex size-8 items-center justify-center rounded-xl">
                  <ShieldCheck className="text-muted-foreground size-4" />
                </div>

                <div>
                  <h3 className="text-sm font-semibold">Role Assignment</h3>

                  <p className="text-muted-foreground text-xs">
                    Configure system access
                  </p>
                </div>
              </div>

              <div className="bg-muted/50 text-muted-foreground rounded-full border px-2.5 py-1 text-xs font-medium">
                {selectedRoleCount} / {availableRoleCount} selected
              </div>
            </div>

            <div className="bg-muted/20 overflow-hidden rounded-2xl border">
              <ScrollArea className="h-44">
                <div className="space-y-1 p-2">
                  {rolesLoading ? (
                    <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      Loading roles...
                    </div>
                  ) : rolesData?.items?.length ? (
                    rolesData.items.map((role) => {
                      const selected = selectedRoles.includes(role.id);

                      return (
                        <label
                          key={role.id}
                          className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all ${
                            selected
                              ? "border-primary/30 bg-primary/[0.07]"
                              : "hover:border-border hover:bg-background border-transparent"
                          } `}
                        >
                          <Checkbox
                            checked={selected}
                            onCheckedChange={() => toggleRole(role.id)}
                            disabled={isLoading}
                            className="mt-0.5"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium">
                                {role.name.replace(/_/g, " ")}
                              </span>

                              {selected && (
                                <Check className="text-primary size-4 shrink-0" />
                              )}
                            </div>

                            {role.description && (
                              <p className="text-muted-foreground mt-0.5 text-xs leading-5">
                                {role.description}
                              </p>
                            )}
                          </div>
                        </label>
                      );
                    })
                  ) : (
                    <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
                      No roles available.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </section>

          {/* Bottom information */}
          <div className="bg-muted/20 flex items-start gap-3 rounded-2xl border p-4">
            <PackageCheck className="text-muted-foreground mt-0.5 size-5 shrink-0" />

            <div>
              <p className="text-sm font-medium">
                Ready to {isEdit ? "save changes" : "create the user"}?
              </p>

              <p className="text-muted-foreground mt-1 text-xs leading-5">
                Review the account details, role assignments, and geographic
                access before continuing.
              </p>
            </div>
          </div>
        </div> 
    </FormDialogShell>
  );
}
