"use client";

import { useRef, useState } from "react";
import { Check, GripVertical, Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/presentation/components/ui/dialog";
import { Button } from "@/presentation/components/ui/button";

interface FormDialogShellProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  eyebrow: string;
  title: string;
  description: string;

  icon: React.ReactNode;

  children: React.ReactNode;

  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;

  loading?: boolean;
  submitLabel?: string;
  loadingLabel?: string;

  maxWidth?: string;
  submitIcon?: React.ReactNode;
}

export function FormDialogShell({
  open,
  onOpenChange,
  eyebrow,
  title,
  description,
  icon,
  children,
  onSubmit,
  loading = false,
  submitLabel = "Save",
  loadingLabel = "Saving...",
  maxWidth = "sm:!w-[760px] lg:!w-[820px]",
  submitIcon = <Check className="size-4" />,
}: FormDialogShellProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const dragStart = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);

  const handleDragStart = (event: React.PointerEvent<HTMLDivElement>) => {
    if (loading) return;

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

  const handleOpenChange = (value: boolean) => {
    if (!value && loading) return;

    if (!value) {
      setPosition({ x: 0, y: 0 });
    }

    onOpenChange(value);
  };

  const handleCancel = () => {
    if (loading) return;

    setPosition({ x: 0, y: 0 });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        style={{
          marginLeft: position.x,
          marginTop: position.y,
        }}
        className={`border-border bg-card !w-[92vw] !max-w-5xl overflow-hidden rounded-3xl p-0 shadow-2xl shadow-black/30 ${maxWidth} flex max-h-[calc(100vh-30px)] flex-col`}
      >
        {/* Top accent */}
        <div className="bg-primary absolute inset-x-0 top-0 h-1" />

        {/* Header */}
        <DialogHeader
          onPointerDown={handleDragStart}
          onPointerMove={handleDragMove}
          onPointerUp={handleDragEnd}
          onPointerCancel={handleDragEnd}
          className="cursor-move flex-row items-start gap-3 border-b px-5 pt-7 pb-5 select-none sm:px-7"
        >
          <div className="bg-primary/15 text-primary flex size-11 shrink-0 items-center justify-center rounded-2xl">
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-primary text-xs font-semibold tracking-[0.16em] uppercase">
                {eyebrow}
              </p>

              <GripVertical className="text-muted-foreground/40 size-3.5" />
            </div>

            <DialogTitle className="mt-1 text-xl font-semibold tracking-tight">
              {title}
            </DialogTitle>

            <DialogDescription className="mt-1">
              {description}
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Form */}
        <form
          onSubmit={onSubmit}
          className="flex max-h-[calc(100vh-120px)] min-h-0 flex-col"
        >
          {/* Scrollable content */}
          <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-6 sm:px-7">
            {children}
          </div>

          {/* Footer */}
          <DialogFooter className="border-border/60 bg-muted/20 m-1 flex-col gap-3 border-t px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-7">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              disabled={loading}
              className="text-muted-foreground hover:bg-muted hover:text-foreground w-full rounded-xl transition-all sm:w-auto"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="shadow-primary/20 w-full min-w-[155px] cursor-pointer rounded-xl font-semibold shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {loadingLabel}
                </>
              ) : (
                <>
                  {submitLabel}
                  {submitIcon}
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
