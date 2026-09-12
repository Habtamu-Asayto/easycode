import type { ReactNode } from "react";
import { Info } from "lucide-react";

interface FormDialogInfoProps {
  title: string;
  children: ReactNode;
  variant?: "primary" | "muted";
}

export function FormDialogInfo({
  title,
  children,
  variant = "primary",
}: FormDialogInfoProps) {
  if (variant === "muted") {
    return (
      <div className="bg-muted/20 flex items-start gap-3 rounded-2xl border p-4">
        <Info className="text-muted-foreground mt-0.5 size-5 shrink-0" />

        <div>
          <p className="text-sm font-medium">
            {title}
          </p>

          <div className="text-muted-foreground mt-1 text-xs leading-5">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-primary/20 bg-primary/[0.06] flex gap-3 rounded-2xl border p-4">
      <Info className="text-primary mt-0.5 size-5 shrink-0" />

      <div>
        <p className="text-sm font-medium">
          {title}
        </p>

        <div className="text-muted-foreground mt-1 text-sm leading-6">
          {children}
        </div>
      </div>
    </div>
  );
}
