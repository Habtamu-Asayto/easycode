"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Badge } from "@/presentation/components/ui/badge";
import { Separator } from "@/presentation/components/ui/separator";
import { ScrollArea } from "@/presentation/components/ui/scroll-area";
import type { RoleResponse } from "@/domain/rbac/entities";
import { useMemo } from "react";
import { format } from "date-fns";

interface RoleDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: RoleResponse | null;
}

export function RoleDetailDialog({
  open,
  onOpenChange,
  role,
}: RoleDetailDialogProps) {
  const grouped = useMemo(() => {
    const perms = role?.permissions || [];
    const groups: Record<string, string[]> = {};
    perms.forEach((p) => {
      if (!groups[p.module]) groups[p.module] = [];
      groups[p.module].push(p.action);
    });
    return groups;
  }, [role?.permissions]);

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {role.name.replace("_", " ")}
            {role.isSystem && (
              <Badge variant="outline" className="text-xs">
                System
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {role.description && (
            <p className="text-muted-foreground text-sm">{role.description}</p>
          )}

          <div className="flex gap-6 text-sm">
            <div>
              <span className="text-muted-foreground">Status: </span>
              {role.isActive ? (
                <Badge className="bg-emerald-100 text-xs text-emerald-700">
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Inactive
                </Badge>
              )}
            </div>
            <div>
              <span className="text-muted-foreground">Users: </span>
              <span className="font-medium">{role.userCount ?? 0}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Created: </span>
              <span>{format(new Date(role.createdAt), "MMM d, yyyy")}</span>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="mb-2 text-sm font-semibold">
              Permissions ({role.permissions?.length || 0})
            </h4>
            <ScrollArea className="h-[250px] rounded-md border p-3">
              <div className="space-y-3">
                {Object.keys(grouped)
                  .sort()
                  .map((module) => (
                    <div key={module}>
                      <h5 className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                        {module}
                      </h5>
                      <div className="flex flex-wrap gap-1">
                        {grouped[module].map((action) => (
                          <Badge
                            key={action}
                            variant="secondary"
                            className="text-xs"
                          >
                            {action}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
