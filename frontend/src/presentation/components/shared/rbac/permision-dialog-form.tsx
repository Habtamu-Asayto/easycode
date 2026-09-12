"use client";

import {
  KeyRound,
} from "lucide-react";

import {
  FormDialogShell,
  FormDialogSection,
  FormDialogInfo,
} from "@/presentation/components/shared/form-dialog";

import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import { Label } from "@/presentation/components/ui/label";

import type { CreatePermissionRequest } from "@/domain/rbac";

interface PermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: CreatePermissionRequest;
  setForm: React.Dispatch<
    React.SetStateAction<CreatePermissionRequest>
  >;
  onSubmit: () => void;
  loading: boolean;
}

export function PermissionDialog({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  loading,
}: PermissionDialogProps) {
  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <FormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="PERMISSION CATALOG"
      title="Create Permission"
      description="Define a governed capability for FMS roles and modules."
      icon={<KeyRound className="size-5" />}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Create permission"
      loadingLabel="Creating..."
      maxWidth="sm:!w-[680px] lg:!w-[720px]"
    >
      <FormDialogInfo title="Define a system capability">
        A permission represents one specific action that can be granted
        to a role. Keep the module and action names consistent across FMS.
      </FormDialogInfo>

      <FormDialogSection
        icon={<KeyRound className="text-muted-foreground size-4" />}
        title="Permission Definition"
        description="Define what the permission allows"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="permission-name">
              Permission Name
            </Label>

            <Input
              id="permission-name"
              autoFocus
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="e.g. Export national reports"
              disabled={loading}
              required
              className="bg-background h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="permission-module">
              Module
            </Label>

            <Input
              id="permission-module"
              value={form.module}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  module: event.target.value,
                }))
              }
              placeholder="e.g. geography"
              disabled={loading}
              required
              className="bg-background h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="permission-action">
              Action
            </Label>

            <Input
              id="permission-action"
              value={form.action}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  action: event.target.value,
                }))
              }
              placeholder="e.g. create"
              disabled={loading}
              required
              className="bg-background h-11 rounded-xl"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="permission-description">
              Description
            </Label>

            <Textarea
              id="permission-description"
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Describe the exact business capability and boundary."
              rows={4}
              disabled={loading}
              className="bg-background rounded-xl"
            />
          </div>
        </div>
      </FormDialogSection>

      <FormDialogInfo
        variant="muted"
        title="Before creating the permission"
      >
        Make sure the permission represents one clear business action.
        For example, use separate permissions for viewing, creating,
        updating, and deleting resources.
      </FormDialogInfo>
    </FormDialogShell>
  );
}
