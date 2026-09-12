"use client";

import type {
  CreateRoleRequest,
  RoleResponse,
  UpdateRoleRequest,
} from "@/domain/rbac/entities";

import { rolesApi } from "@/infrastructure/rbac/api";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../../presentation/components/ui/dialog";
import { Label } from "../../../presentation/components/ui/label";
import { Input } from "../../../presentation/components/ui/input";
import { Button } from "../../../presentation/components/ui/button";
import { Textarea } from "../../../presentation/components/ui/textarea";

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

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setName(role?.name ?? "");
    setDisplayName(role?.displayName ?? "");
    setDescription(role?.description ?? "");
    setError("");
  }, [open, role]);

  const mutation = useMutation({
    mutationFn: async () => {
      const trimmedName = name.trim();
      const trimmedDisplayName = displayName.trim();

      if (!trimmedName) {
        throw new Error("Role name is required.");
      }

      if (isEditing && role) {
        const payload: UpdateRoleRequest = {
          name: trimmedName,
          description: description.trim() || undefined,
        };

        return rolesApi.update(role.id, payload);
      }

      const payload: CreateRoleRequest = {
        name: trimmedName,
        displayName:trimmedDisplayName,
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

    onError: (error: unknown) => {
      setError(
        error instanceof Error
          ? error.message
          : isEditing
            ? "Failed to update the role."
            : "Failed to create the role.",
      );
    },
  });

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    mutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit role" : "Add new role"}
            </DialogTitle>

            <DialogDescription>
              {isEditing
                ? "Update the role information. Permission assignments are managed from the permission matrix."
                : "Create a new role. You can assign permissions after creating the role."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="role-name">Role name</Label>

              <Input
                id="role-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. Regional Manager"
                disabled={mutation.isPending}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-description">Description</Label>

              <Textarea
                id="role-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe what this role is responsible for..."
                disabled={mutation.isPending}
                rows={4}
              />
            </div>

            {error && (
              <div className="border-destructive/20 bg-destructive/10 text-destructive rounded-lg border px-3 py-2 text-sm">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={mutation.isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save changes"
                  : "Create role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
