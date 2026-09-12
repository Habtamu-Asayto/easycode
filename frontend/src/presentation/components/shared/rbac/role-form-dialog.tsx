"use client";

import { ShieldCheck } from "lucide-react";

import type {
  CreateRoleRequest,
  RoleResponse,
  UpdateRoleRequest,
} from "@/domain/rbac/entities";

import { rolesApi } from "@/infrastructure/rbac/api";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import {
  FormDialogShell,
  FormDialogSection,
  FormDialogInfo,
} from "@/presentation/components/shared/form-dialog";

import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import { Label } from "@/presentation/components/ui/label";
import axios from "axios";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role?: RoleResponse | null;
  onSuccess: () => void;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
}: RoleFormDialogProps) {
  const queryClient = useQueryClient();

  const isEditing = Boolean(role);

  const [name, setName] = useState(role?.name ?? "");
  const [displayName, setDisplayName] = useState(role?.displayName ?? "");
  const [description, setDescription] = useState(role?.description ?? "");

  const mutation = useMutation({
    mutationFn: async () => {
      const trimmedName = name.trim();
      const trimmedDisplayName = displayName.trim();

      if (!trimmedName) {
        throw new Error("Role name is required.");
      }

      if (!trimmedDisplayName) {
        throw new Error("Role display name is required.");
      }

      if (isEditing && role) {
        const payload: UpdateRoleRequest = {
          name: trimmedName,
          displayName: trimmedDisplayName,
          description: description.trim() || undefined,
        };

        return rolesApi.update(role.id, payload);
      }

      const payload: CreateRoleRequest = {
        name: trimmedName,
        displayName: trimmedDisplayName,
        description: description.trim() || undefined,
        permissionIds: [],
      };

      return rolesApi.create(payload);
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["roles", "all"],
      });

      onOpenChange(false);
      onSuccess();
    },

    // onError: (error: unknown) => {
    //   console.error(error);
    // },

    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        console.table(error.response?.data?.errors);
      } else {
        console.error(error);
      }
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutation.mutate();
  };

  return (
    <FormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      eyebrow={isEditing ? "ROLE MANAGEMENT" : "ROLE CATALOG"}
      title={isEditing ? "Update Role" : "Create Role"}
      description={
        isEditing
          ? "Update the role information. Permission assignments are managed from the permission matrix."
          : "Create a new role and configure its permissions after creation."
      }
      icon={<ShieldCheck className="size-5" />}
      onSubmit={handleSubmit}
      loading={mutation.isPending}
      submitLabel={isEditing ? "Save changes" : "Create role"}
      loadingLabel={isEditing ? "Saving..." : "Creating..."}
    >
      <FormDialogInfo
        title={
          isEditing ? "Update role information" : "Create a new system role"
        }
      >
        {isEditing
          ? "Update the role identity and description. Permission assignments remain managed separately."
          : "Define a clear role name and description. You can assign permissions after the role has been created."}
      </FormDialogInfo>

      <FormDialogSection
        icon={<ShieldCheck className="text-muted-foreground size-4" />}
        title="Role Information"
        description="Define the role identity and responsibility"
      >
        <div className="space-y-4">
          {/* System Name */}
          <div className="space-y-2">
            <Label htmlFor="role-name">Role Name</Label>

            <Input
              id="role-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. regional_manager"
              required
              disabled={mutation.isPending}
              autoFocus
              className="bg-background h-11 rounded-xl"
            />

            <p className="text-muted-foreground text-xs">
              Internal role identifier. Use lowercase letters and underscores
              only.
            </p>
          </div>

          {/* Display Name */}
          <div className="space-y-2">
            <Label htmlFor="role-display-name">Display Name</Label>

            <Input
              id="role-display-name"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="e.g. Regional Manager"
              required
              disabled={mutation.isPending}
              className="bg-background h-11 rounded-xl"
            />

            <p className="text-muted-foreground text-xs">
              Human-readable name displayed throughout the system.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="role-description">Description</Label>

            <Textarea
              id="role-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Describe what this role is responsible for..."
              disabled={mutation.isPending}
              rows={4}
              className="bg-background rounded-xl"
            />
          </div>
        </div>
      </FormDialogSection>

      <FormDialogInfo
        variant="muted"
        title={
          isEditing ? "Ready to save changes?" : "Ready to create this role?"
        }
      >
        Review the role name and description before continuing. Permissions can
        be configured from the permission matrix.
      </FormDialogInfo>
    </FormDialogShell>
  );
}
