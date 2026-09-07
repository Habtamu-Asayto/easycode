'use client';

import { Button } from '@/presentation/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/presentation/components/ui/select';

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';

import type { PaginationMeta } from '@/domain/shared/entities';

interface DataPaginationProps {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export function DataPagination({
  meta,
  onPageChange,
  onLimitChange,
}: DataPaginationProps) {
  const {
    page,
    totalPages,
    total,
    limit,
    hasNext,
    hasPrevious,
  } = meta;

  return (
    <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          {total} total record{total !== 1 ? 's' : ''}
        </span>

        {onLimitChange && (
          <>
            <span>·</span>

            <Select
              value={String(limit)}
              onValueChange={(value) =>
                onLimitChange(Number(value))
              }
            >
              <SelectTrigger className="h-7 w-[70px]">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {[10, 20, 50, 100].map((size) => (
                  <SelectItem
                    key={size}
                    value={String(size)}
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span>per page</span>
          </>
        )}
      </div>

      <div className="flex items-center gap-1">
        <span className="mr-2 text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevious}
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevious}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
        >
          <ChevronRight className="h-3.5 w-3.5" />

        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext}
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}