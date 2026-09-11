

import { Button } from "@/presentation/components/ui/button";
import { Textarea } from "@/presentation/components/ui/textarea";
import { Input } from "@/presentation/components/ui/input";
import { CreatePermissionRequest } from "@/domain/rbac";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Plus } from "lucide-react";
 /* -------------------------------------------------------------------------- */
/* Add Permission Dialog                                                      */
/* -------------------------------------------------------------------------- */

export function PermissionDialog({
  open,
  onOpenChange,
  form,
  setForm,
  onSubmit,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: CreatePermissionRequest;
  setForm: React.Dispatch<React.SetStateAction<CreatePermissionRequest>>;
  onSubmit: () => void;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <p className="text-primary text-xs font-semibold tracking-[0.16em]">
            PERMISSION CATALOG
          </p>

          <DialogTitle>Add permission</DialogTitle>

          <DialogDescription>
            Define a governed capability for FMS roles and modules.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Permission name</label>

            <Input
              autoFocus
              value={form.name}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  name: event.target.value,
                }))
              }
              placeholder="e.g. Export national reports"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Module</label>

            <Input
              value={form.module}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  module: event.target.value,
                }))
              }
              placeholder="e.g. geography"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Action</label>

            <Input
              value={form.action}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  action: event.target.value,
                }))
              }
              placeholder="e.g. create"
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Description</label>

            <Textarea
              value={form.description}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              placeholder="Describe the exact business capability and boundary."
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button onClick={onSubmit} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />

            {loading ? "Creating..." : "Create permission"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
