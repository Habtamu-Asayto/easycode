"use client";

import { Button } from "@/presentation/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import type { PaginationMeta } from "@/domain/rbac/entities";

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
  const { page, totalPages, total, limit } = meta;

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="border-border flex items-center justify-between border-t px-4 py-2.5">
      <div className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>
          {total} total record{total !== 1 ? "s" : ""}
        </span>
        {onLimitChange && (
          <>
            <span>·</span>
            <Select
              value={String(limit)}
              onValueChange={(v) => onLimitChange(Number(v))}
            >
              <SelectTrigger className="h-7 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[3, 20, 50, 100].map((size) => (
                  <SelectItem key={size} value={String(size)}>
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
        <span className="text-muted-foreground mr-2 text-sm">
          Page {page} of {totalPages}
        </span>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(1)}
          disabled={!hasPrevPage}
        >
          <ChevronsLeft className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </Button>

        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNextPage}
        >
          <ChevronsRight className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
