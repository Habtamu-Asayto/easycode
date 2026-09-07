'use client';

import { Loader2 } from 'lucide-react';

export function PageLoader() {
  return (
    <div className="flex h-full min-h-[400px] items-center justify-center">
      <Loader2 className="h-7 w-7 animate-spin text-primary" />
    </div>
  );
}

export function InlineLoader({
  text = 'Loading...',
}: {
  text?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <span>{text}</span>
    </div>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-[300px] flex-col items-center justify-center gap-3 text-center">
      {Icon && (
        <Icon className="h-12 w-12 text-muted-foreground/30" />
      )}

      <div>
        <h3 className="text-sm font-medium text-foreground">
          {title}
        </h3>

        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}