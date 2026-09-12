"use client";

import { useState, useEffect, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { rolesApi, permissionsApi } from "@/infrastructure/rbac/api";
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
import { Textarea } from "@/presentation/components/ui/textarea";
import { Checkbox } from "@/presentation/components/ui/checkbox";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import { Badge } from "@/presentation/components/ui/badge";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { RoleResponse, PermissionResponse } from "@/domain/rbac/entities";

interface RoleFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleResponse | null;
  onSuccess: () => void;
}

export function RoleFormDialog({
  open,
  onOpenChange,
  role,
  onSuccess,
}: RoleFormDialogProps) {
  const isEdit = !!role;

  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const { data: permissionsData } = useQuery({
    queryKey: ["permissions", "active"],
    queryFn: () => permissionsApi.getActive(),
    enabled: open,
  });

  // Group permissions by module
  const grouped = useMemo(() => {
    const perms = permissionsData?.data || [];
    const groups: Record<string, PermissionResponse[]> = {};
    perms.forEach((p) => {
      if (!groups[p.module]) groups[p.module] = [];
      groups[p.module].push(p);
    });
    return groups;
  }, [permissionsData]);

  useEffect(() => {
    if (open) {
      if (role) {
        setName(role.name);
        setDisplayName(role.displayName);
        setDescription(role.description || "");
        setSelectedPermissions(role.permissions?.map((p) => p.id) || []);
      } else {
        setName("");
        setDisplayName("");
        setDescription("");
        setSelectedPermissions([]);
      }
    }
  }, [open, role]);

  const createMutation = useMutation({
    mutationFn: (data: {
      name: string;
      displayName: string;
      description: string;
      permissionIds: string[];
    }) => rolesApi.create(data),
    onSuccess: () => {
      toast.success("Role created successfully");
      onSuccess();
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to create role"),
  });

  const updateMutation = useMutation({
    mutationFn: (data: {
      name?: string;
      displayName: string;
      description?: string;
      permissionIds?: string[];
    }) => rolesApi.update(role!.id, data),
    onSuccess: () => {
      toast.success("Role updated successfully");
      onSuccess();
    },
    onError: (err: any) =>
      toast.error(err?.response?.data?.message || "Failed to update role"),
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      displayName,
      description,
      permissionIds: selectedPermissions,
    };
    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const togglePermission = (id: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const toggleModule = (module: string) => {
    const modulePerms = grouped[module]?.map((p) => p.id) || [];
    const allSelected = modulePerms.every((id) =>
      selectedPermissions.includes(id),
    );
    if (allSelected) {
      setSelectedPermissions((prev) =>
        prev.filter((id) => !modulePerms.includes(id)),
      );
    } else {
      setSelectedPermissions((prev) => [...new Set([...prev, ...modulePerms])]);
    }
  };

  const isModuleAllSelected = (module: string) => {
    const modulePerms = grouped[module]?.map((p) => p.id) || [];
    return (
      modulePerms.length > 0 &&
      modulePerms.every((id) => selectedPermissions.includes(id))
    );
  };

  const isModulePartialSelected = (module: string) => {
    const modulePerms = grouped[module]?.map((p) => p.id) || [];
    return (
      modulePerms.some((id) => selectedPermissions.includes(id)) &&
      !isModuleAllSelected(module)
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Role" : "Create Role"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update role details and permission assignments."
              : "Define a new role with specific permissions."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roleName">Role Name</Label>
              <Input
                id="roleName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., editor"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., Editor"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label>Permissions</Label>

            <Badge variant="secondary">
              {selectedPermissions.length} permissions
            </Badge>
          </div>

          <div className="space-y-2">
            <Label htmlFor="roleDesc">Description</Label>
            <Textarea
              id="roleDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this role..."
              rows={2}
              disabled={isLoading}
            />
          </div>

          {/* Permission Matrix */}
          <div className="space-y-2">
            <Label>Permissions</Label>
            <ScrollArea className="h-[300px] rounded-md border">
              <div className="space-y-3 p-3">
                {Object.keys(grouped)
                  .sort()
                  .map((module) => (
                    <div key={module} className="space-y-1.5">
                      {/* Module header with select all */}
                      <label className="bg-muted/50 hover:bg-muted flex cursor-pointer items-center gap-2 rounded px-2 py-1.5">
                        <Checkbox
                          checked={isModuleAllSelected(module)}

                          indeterminate={isModulePartialSelected(module)}
                          onCheckedChange={() => toggleModule(module)}
                          disabled={isLoading}
                        />
                        <span className="text-muted-foreground text-sm font-semibold tracking-wider uppercase">
                          {module}
                        </span>
                        <Badge
                          variant="outline"
                          className="ml-auto text-[10px]"
                        >
                          {
                            grouped[module].filter((p) =>
                              selectedPermissions.includes(p.id),
                            ).length
                          }
                          /{grouped[module].length}
                        </Badge>
                      </label>

                      {/* Individual permissions */}
                      <div className="ml-6 grid grid-cols-2 gap-1">
                        {grouped[module].map((perm) => (
                          <label
                            key={perm.id}
                            className="hover:bg-accent flex cursor-pointer items-center gap-2 rounded px-2 py-1"
                          >
                            <Checkbox
                              checked={selectedPermissions.includes(perm.id)}
                              onCheckedChange={() => togglePermission(perm.id)}
                              disabled={isLoading}
                            />
                            <span className="text-sm">{perm.action}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEdit ? "Save Changes" : "Create Role"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
