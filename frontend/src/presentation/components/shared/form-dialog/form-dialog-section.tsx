import type { ReactNode } from "react";

interface FormDialogSectionProps {
  icon: ReactNode;
  title: string;
  description?: string;
  children: ReactNode;
}

export function FormDialogSection({
  icon,
  title,
  description,
  children,
}: FormDialogSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="bg-muted flex size-8 items-center justify-center rounded-xl">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold">
            {title}
          </h3>

          {description && (
            <p className="text-muted-foreground text-xs">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}
