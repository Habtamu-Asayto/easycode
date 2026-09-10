"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, Info, Loader2, PackageCheck } from "lucide-react";
import { toast } from "sonner";

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

interface MasterDataFormDialogProps<T extends { id: string }> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItem: T | null;
  onSuccess: () => void;
  entityName: string;
  api: {
    create: (data: any) => Promise<any>;
    update: (id: string, data: any) => Promise<any>;
  };
  getDefaults: (item: T | null) => Record<string, string | boolean>;
  renderExtraFields?: (
    fields: Record<string, string | boolean>,
    setField: (key: string, value: string | boolean) => void,
    isLoading: boolean,
  ) => ReactNode;
  showDescription?: boolean;
  descriptionPlaceholder?: string;
  infoMessage?: string;
  icon?: ReactNode;
}

export function MasterDataFormDialog<
  T extends {
    id: string;
    name: string;
    code: string;
    description?: string | null;
  },
>({
  open,
  onOpenChange,
  editItem,
  onSuccess,
  entityName,
  api,
  getDefaults,
  renderExtraFields,
  showDescription = true,
  descriptionPlaceholder = "Add an optional description...",
  infoMessage,
  icon,
}: MasterDataFormDialogProps<T>) {
  const isEdit = !!editItem;

  const [fields, setFields] = useState<Record<string, string | boolean>>({});
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const dragStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isLoading) return;

    isDragging.current = true;
    dragStart.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };

    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    setPosition({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleDragEnd = () => {
    isDragging.current = false;
  };

  const setField = (key: string, value: string | boolean) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (open) {
      setFields(getDefaults(editItem));
      setPosition({ x: 0, y: 0 });
    }
  }, [open, editItem, getDefaults]);

  const createMutation = useMutation({
    mutationFn: (data: Record<string, string | boolean>) => api.create(data),
    onSuccess: () => {
      toast.success(`${entityName} created successfully`);
      onSuccess();
    },
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message || `Failed to create ${entityName}`,
      ),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, string | boolean>) =>
      api.update(editItem!.id, data),
    onSuccess: () => {
      toast.success(`${entityName} updated successfully`);
      onSuccess();
    },
    onError: (err: any) =>
      toast.error(
        err?.response?.data?.message || `Failed to update ${entityName}`,
      ),
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleClose = () => {
    if (!isLoading) onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = { ...fields };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === "") {
        delete payload[key];
      }
    });

    isEdit ? updateMutation.mutate(payload) : createMutation.mutate(payload);
  };

  const description =
    typeof fields.description === "string" ? fields.description : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        style={{
          marginLeft: position.x,
          marginTop: position.y,
        }}
        className="!w-[50vw] !max-w-5xl overflow-hidden rounded-3xl border-border bg-card p-0 shadow-2xl shadow-black/30"
      >
        <div className="absolute inset-x-0 top-0 h-1 bg-primary" />

        <DialogHeader
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          className="flex-row cursor-move select-none items-start gap-3 border-b px-5 pb-5 pt-7 sm:px-7"
        >
          <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            {icon ?? <PackageCheck className="size-5" />}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              {isEdit ? `Edit ${entityName}` : `New ${entityName}`}
            </p>

            <DialogTitle className="mt-1 text-xl font-semibold tracking-tight">
              {isEdit ? `Edit ${entityName}` : `Create ${entityName}`}
            </DialogTitle>

            <DialogDescription className="mt-1">
              {isEdit
                ? `Update the ${entityName.toLowerCase()} details.`
                : `Add a new ${entityName.toLowerCase()} to the system.`}
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="max-h-[65vh] space-y-5 overflow-y-auto px-5 py-6 sm:px-7">
            <div className="flex gap-3 rounded-2xl border border-primary/20 bg-primary/[0.06] p-4">
              <Info className="mt-0.5 size-5 shrink-0 text-primary" />

              <div>
                <p className="text-sm font-medium">
                  {isEdit
                    ? `Update ${entityName.toLowerCase()} information`
                    : `Add a new ${entityName.toLowerCase()}`}
                </p>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {infoMessage ??
                    `Keep the name and code consistent so ${entityName.toLowerCase()} records are easy to identify and manage.`}
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="md-name">Name</Label>
                <Input
                  id="md-name"
                  value={(fields.name as string) ?? ""}
                  onChange={(e) => setField("name", e.target.value)}
                  placeholder={`e.g. ${entityName} Central`}
                  required
                  disabled={isLoading}
                  className="h-11 rounded-xl bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="md-code">Code</Label>
                <Input
                  id="md-code"
                  value={(fields.code as string) ?? ""}
                  onChange={(e) =>
                    setField("code", e.target.value.toUpperCase())
                  }
                  placeholder="e.g. REG-001"
                  required
                  disabled={isLoading}
                  className="h-11 rounded-xl bg-background uppercase"
                />
              </div>
            </div>

            {showDescription && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="md-description">Description</Label>
                  <span className="text-xs text-muted-foreground">
                    {description.length}/500
                  </span>
                </div>

                <textarea
                  id="md-description"
                  value={description}
                  onChange={(e) =>
                    setField("description", e.target.value.slice(0, 500))
                  }
                  rows={3}
                  disabled={isLoading}
                  placeholder={descriptionPlaceholder}
                  className="
                    w-full resize-none rounded-xl border border-input
                    bg-background px-3 py-3 text-sm leading-6 outline-none
                    transition placeholder:text-muted-foreground/50
                    focus:border-primary focus:ring-2 focus:ring-primary/20
                  "
                />
              </div>
            )}

            {renderExtraFields?.(fields, setField, isLoading)}
          </div>

          <DialogFooter
            className=" my-1 -mx-0.5
    flex-col gap-3
    border-t border-border/60
    bg-muted/20
    px-5 py-4
    sm:flex-row sm:items-center sm:justify-end
    sm:px-7
  "
          >
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
              className="
      w-full rounded-xl
      text-muted-foreground
      transition-all
      hover:bg-muted hover:text-foreground
      sm:w-auto
    "
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="
                w-full min-w-[150px] rounded-xl
                font-semibold
                shadow-md shadow-primary/20
                transition-all duration-200
                hover:-translate-y-0.5
                hover:shadow-lg hover:shadow-primary/25
                active:translate-y-0
                sm:w-auto
              "
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {isEdit ? "Saving..." : "Creating..."}
                </>
              ) : (
                <>
                  {isEdit ? "Save changes" : `Create ${entityName}`}
                  <Check className="size-4" />
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
