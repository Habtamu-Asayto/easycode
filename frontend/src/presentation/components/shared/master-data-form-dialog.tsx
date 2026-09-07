"use client";

import { useState, useEffect, type ReactNode } from "react";

import { useMutation } from "@tanstack/react-query";

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

import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/lib/api-error";

type FormValue = string | boolean;

type FormFields = Record<string, FormValue>;

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

  getDefaults: (item: T | null) => FormFields;

  renderExtraFields?: (
    fields: FormFields,
    setField: (key: string, value: FormValue) => void,
    isLoading: boolean,
  ) => ReactNode;

  showDescription?: boolean;
}

export function MasterDataFormDialog<
  T extends {
    id: string;
    name: string;
    code: string;
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
}: MasterDataFormDialogProps<T>) {
  const isEdit = !!editItem;

  const [fields, setFields] = useState<FormFields>({});

  const setField = (key: string, value: FormValue) => {
    setFields((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (open) {
      setFields(getDefaults(editItem));
    }
  }, [open, editItem, getDefaults]);

  const createMutation = useMutation({
    mutationFn: (data: FormFields) => api.create(data),

    onSuccess: () => {
      toast.success(`${entityName} created successfully`);

      onSuccess();
      onOpenChange(false);
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, `Failed to create ${entityName}`));
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormFields) => api.update(editItem!.id, data),

    onSuccess: () => {
      toast.success(`${entityName} updated successfully`);

      onSuccess();
      onOpenChange(false);
    },

    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, `Failed to update ${entityName}`));
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: FormFields = {
      ...fields,
    };

    Object.keys(payload).forEach((key) => {
      if (payload[key] === "") {
        delete payload[key];
      }
    });

    if (isEdit) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Edit ${entityName}` : `Create ${entityName}`}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? `Update the ${entityName.toLowerCase()} details.`
              : `Add a new ${entityName.toLowerCase()} to the system.`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="md-name">Name</Label>

              <Input
                id="md-name"
                value={(fields.name as string) ?? ""}
                onChange={(e) => setField("name", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="md-code">Code</Label>

              <Input
                id="md-code"
                value={(fields.code as string) ?? ""}
                onChange={(e) => setField("code", e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {showDescription && (
            <div className="space-y-2">
              <Label htmlFor="md-desc">Description</Label>

              <Input
                id="md-desc"
                value={(fields.description as string) ?? ""}
                onChange={(e) => setField("description", e.target.value)}
                disabled={isLoading}
              />
            </div>
          )}

          {renderExtraFields?.(fields, setField, isLoading)}

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

              {isEdit ? "Save Changes" : `Create ${entityName}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
