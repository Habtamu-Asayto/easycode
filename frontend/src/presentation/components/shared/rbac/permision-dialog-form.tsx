"use client";

import { useMemo, useState } from "react";
import { Check, KeyRound, ShieldCheck } from "lucide-react";

import {
  FormDialogShell,
  FormDialogSection,
  FormDialogInfo,
} from "@/presentation/components/shared/form-dialog";

import { Input } from "@/presentation/components/ui/input";
import { Textarea } from "@/presentation/components/ui/textarea";
import { Label } from "@/presentation/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";

import type {
  CreatePermissionRequest,
  PermissionResponse,
} from "@/domain/rbac";

import {
  PERMISSION_ACTIONS,
  buildPermissionDisplayName,
  buildPermissionName,
  formatPermissionLabel,
  normalizePermissionModule,
} from "./permission-catalog";

interface PermissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  form: CreatePermissionRequest;

  setForm: React.Dispatch<React.SetStateAction<CreatePermissionRequest>>;

  onSubmit: () => void;
  loading: boolean;

  permissions?: PermissionResponse[];
}

export function PermissionDialog({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  loading,
  permissions = [],
}: PermissionDialogProps) { 
  const modules = useMemo(() => {
    return Array.from(
      new Set(
        permissions
          .map((permission) => permission.module?.trim().toLowerCase())
          .filter(Boolean),
      ),
    ).sort((a, b) => a.localeCompare(b));
  }, [permissions]);

  const permissionName = buildPermissionName(form.module, form.action);

  const displayName = buildPermissionDisplayName(form.module, form.action);

  const selectedAction = PERMISSION_ACTIONS.find(
    (action) => action.value === form.action,
  );

  const duplicate = permissions.some(
    (permission) =>
      permission.name?.toLowerCase() === permissionName.toLowerCase(),
  );
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (duplicate || !permissionName) {
      return;
    }

    onSubmit();
  };

  const updateModule = (module: string) => {
    const normalized = normalizePermissionModule(module);

    setForm((current) => ({
      ...current,
      module: normalized,
      name: buildPermissionName(normalized, current.action),
      displayName: buildPermissionDisplayName(normalized, current.action),
    }));
  };

  const updateAction = (action: string) => {
    setForm((current) => ({
      ...current,
      action,
      name: buildPermissionName(current.module, action),
      displayName: buildPermissionDisplayName(current.module, action),
    }));
  };
  const [creatingModule, setCreatingModule] = useState(false);
  const [newModule, setNewModule] = useState("");
  const handleNewModuleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = normalizePermissionModule(event.target.value);

    setNewModule(value);

    setForm((current) => ({
      ...current,
      module: value,
      name: buildPermissionName(value, current.action),
      displayName: buildPermissionDisplayName(value, current.action),
    }));
  };

  const handleCreateNewModule = () => {
    const normalized = normalizePermissionModule(newModule);

    if (!normalized) {
      return;
    }

    setForm((current) => ({
      ...current,
      module: normalized,
      name: buildPermissionName(normalized, current.action),
      displayName: buildPermissionDisplayName(normalized, current.action),
    }));

    setNewModule("");
    setCreatingModule(false);
  };

  return (
    <FormDialogShell
      open={open}
      onOpenChange={onOpenChange}
      eyebrow="PERMISSION CATALOG"
      title="Create Permission"
      description="Define a governed capability that can be assigned to FMS roles."
      icon={<KeyRound className="size-5" />}
      onSubmit={handleSubmit}
      loading={loading}
      submitLabel="Create permission"
      loadingLabel="Creating..."
      maxWidth="sm:!w-[680px] lg:!w-[720px]"
    >
      <FormDialogInfo title="Define a system capability">
        Select a module and action. The permission key is generated
        automatically and becomes the stable identifier used by the RBAC
        authorization system.
      </FormDialogInfo>

      <FormDialogSection
        icon={<KeyRound className="text-muted-foreground size-4" />}
        title="Permission Definition"
        description="Choose what this permission allows"
      >
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Module */}
            <div className="space-y-2">
              <Label htmlFor="permission-module">Module</Label>

              {!creatingModule ? (
                <Select
                  value={form.module}
                  onValueChange={(value) => {
                    if (value === "__create_new__") {
                      setCreatingModule(true);
                      setNewModule("");
                      return;
                    }

                    updateModule(value);
                  }}
                  disabled={loading}
                >
                  <SelectTrigger
                    id="permission-module"
                    className="bg-background h-11 w-full rounded-xl"
                  >
                    <SelectValue placeholder="Select a module" />
                  </SelectTrigger>

                  <SelectContent>
                    {modules.map((module) => (
                      <SelectItem key={module} value={module}>
                        {formatPermissionLabel(module)}
                      </SelectItem>
                    ))}

                    <SelectItem value="__create_new__">
                      + Create new module
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex gap-2">
                  <Input
                    id="permission-module"
                    autoFocus
                    value={newModule}
                    onChange={handleNewModuleChange}
                    placeholder="e.g. fertilizer"
                    disabled={loading}
                    className="bg-background h-11 rounded-xl"
                  />

                  <button
                    type="button"
                    onClick={handleCreateNewModule}
                    disabled={loading || !newModule.trim()}
                    className="bg-primary text-primary-foreground h-11 shrink-0 rounded-xl px-4 text-sm font-medium transition-opacity hover:opacity-90 disabled:pointer-events-none disabled:opacity-50"
                  >
                    Use
                  </button>
                </div>
              )}

              {creatingModule && (
                <button
                  type="button"
                  onClick={() => {
                    setCreatingModule(false);
                    setNewModule("");
                  }}
                  className="text-muted-foreground hover:text-foreground text-[11px] transition-colors"
                >
                  ← Choose an existing module
                </button>
              )}
            </div>

            {/* Action */}
            <div className="space-y-2">
              <Label htmlFor="permission-action">Action</Label>

              <Select
                value={form.action}
                onValueChange={updateAction}
                disabled={loading}
              >
                <SelectTrigger
                  id="permission-action"
                  className="bg-background h-11 w-full rounded-xl"
                >
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>

                <SelectContent>
                  {PERMISSION_ACTIONS.map((action) => (
                    <SelectItem key={action.value} value={action.value}>
                      <div className="flex flex-col">
                        <span>{action.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedAction && (
                <p className="text-muted-foreground text-[11px]">
                  {selectedAction.description}
                </p>
              )}
            </div>
          </div>

          {/* Generated permission key */}
          <div className="border-border/70 bg-muted/20 rounded-2xl border p-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                <ShieldCheck className="size-4" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-muted-foreground text-[10px] font-bold tracking-[0.14em] uppercase">
                    Permission key
                  </p>

                  {permissionName && !duplicate && (
                    <div className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
                      <Check className="size-3" />
                      Available
                    </div>
                  )}
                </div>

                <p className="bg-background mt-2 truncate rounded-lg px-3 py-2 font-mono text-sm font-semibold">
                  {permissionName || "module:action"}
                </p>

                {displayName && (
                  <p className="text-muted-foreground mt-2 text-xs">
                    Display name:{" "}
                    <span className="text-foreground font-medium">
                      {displayName}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {duplicate && (
              <div className="border-destructive/20 bg-destructive/5 text-destructive mt-3 rounded-xl border px-3 py-2.5 text-xs">
                This permission already exists in the catalog. Choose another
                module or action.
              </div>
            )}
          </div>

          {/* Display name */}
          <div className="space-y-2">
            <Label htmlFor="permission-display-name">Display Name</Label>

            <Input
              id="permission-display-name"
              value={displayName}
              readOnly
              className="bg-muted/40 h-11 rounded-xl"
            />

            <p className="text-muted-foreground text-[11px]">
              Generated automatically for administrator-friendly display.
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="permission-description">Description</Label>

            <Textarea
              id="permission-description"
              value={form.description ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder={
                selectedAction
                  ? `Describe what "${selectedAction.label}" allows for this module.`
                  : "Describe the exact business capability and boundary."
              }
              rows={4}
              disabled={loading}
              className="bg-background resize-none rounded-xl"
            />
          </div>
        </div>
      </FormDialogSection>

      <FormDialogInfo variant="muted" title="Permission design principle">
        Keep each permission focused on one clear business capability. Use
        separate permissions for creating, viewing, updating, deleting,
        approving, exporting, and other distinct operations.
      </FormDialogInfo>
    </FormDialogShell>
  );
}
