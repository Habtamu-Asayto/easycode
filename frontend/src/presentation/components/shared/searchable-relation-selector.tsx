"use client";

import { useState } from "react";
import { Check, Search } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/presentation/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/presentation/components/ui/popover";

import { Label } from "@/presentation/components/ui/label";

export interface SearchableRelationItem {
  id: string;
  name: string;
  code?: string;
}

interface SearchableRelationSelectorProps<T extends SearchableRelationItem> {
  label: string;
  id?: string;

  items: T[];

  value?: string;
  onChange: (value: string) => void;

  placeholder?: string;
  searchPlaceholder?: string;

  disabled?: boolean;
  isLoading?: boolean;

  emptyTitle?: string;
  emptyDescription?: string;

  itemLabel?: string;

  icon?: React.ComponentType<{ className?: string }>;
}

export function SearchableRelationSelector<T extends SearchableRelationItem>({
  label,
  id,
  items,
  value,
  onChange,
  placeholder = "Select item",
  searchPlaceholder = "Search...",
  disabled = false,
  isLoading = false,
  emptyTitle = "No item found",
  emptyDescription = "Try searching by name or code",
  itemLabel = "item",
  icon: Icon,
}: SearchableRelationSelectorProps<T>) {
  const [open, setOpen] = useState(false);

  const selectedItem = items.find((item) => item.id === value);

  const handleSelect = (itemId: string) => {
    onChange(itemId);
    setOpen(false);
  };

  const isDisabled = disabled || isLoading;

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              id={id}
              type="button"
              role="combobox"
              aria-expanded={open}
              disabled={isDisabled}
              className="border-input bg-background ring-offset-background hover:border-primary/50 focus:ring-primary/20 flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm transition-all duration-200 focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {selectedItem ? (
                <div className="animate-in fade-in slide-in-from-left-1 flex min-w-0 items-center gap-2 duration-200">
                  {Icon && (
                    <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-md">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                  )}

                  <span className="min-w-0 truncate font-medium">
                    {selectedItem.name}
                  </span>

                  {selectedItem.code && (
                    <span className="text-muted-foreground shrink-0 text-xs">
                      ({selectedItem.code})
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">
                  {isLoading ? "Loading..." : placeholder}
                </span>
              )}

              <Search className="text-muted-foreground ml-2 h-4 w-4 shrink-0 transition-transform duration-200" />
            </button>
          }
        />

        <PopoverContent
          align="start"
          sideOffset={5}
          className="bg-popover animate-in fade-in-0 zoom-in-95 w-[var(--radix-popover-trigger-width)] overflow-hidden rounded-xl border p-0 shadow-lg duration-200"
        >
          <Command>
            <div className="bg-popover border-b p-2">
              <CommandInput
                placeholder={searchPlaceholder}
                className="bg-muted/40 focus:bg-background h-9 rounded-lg transition-all duration-200"
              />
            </div>

            <CommandList className="max-h-60 overflow-y-auto p-1">
              <CommandEmpty>
                <div className="animate-in fade-in zoom-in-95 flex flex-col items-center gap-2 py-8 text-center duration-200">
                  <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                    <Search className="text-muted-foreground h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">{emptyTitle}</p>

                    <p className="text-muted-foreground mt-1 text-xs">
                      {emptyDescription}
                    </p>
                  </div>
                </div>
              </CommandEmpty>

              <CommandGroup>
                {items.map((item, index) => (
                  <CommandItem
                    key={item.id}
                    value={`${item.name} ${item.code ?? ""}`}
                    onSelect={() => handleSelect(item.id)}
                    className="animate-in fade-in slide-in-from-left-1 cursor-pointer rounded-lg transition-all duration-200"
                    style={{
                      animationDelay: `${index * 30}ms`,
                      animationFillMode: "backwards",
                    }}
                  >
                    <div className="flex w-full min-w-0 items-center gap-3">
                      {Icon && (
                        <div className="bg-primary/10 text-primary group-hover:bg-primary/15 flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition-all duration-200">
                          <Icon className="h-4 w-4" />
                        </div>
                      )}

                      <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">
                          {item.name}
                        </span>

                        {item.code && (
                          <span className="text-muted-foreground text-[11px]">
                            {itemLabel} code: {item.code}
                          </span>
                        )}
                      </div>

                      <Check
                        className={`h-4 w-4 shrink-0 transition-all duration-200 ${
                          value === item.id
                            ? "scale-100 opacity-100"
                            : "scale-75 opacity-0"
                        } `}
                      />
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>

            {/* Footer */}
            {items.length > 0 && (
              <div className="bg-muted/20 animate-in fade-in border-t px-3 py-2 duration-200">
                <p className="text-muted-foreground text-[11px]">
                  {items.length} {itemLabel}
                  {items.length !== 1 ? "s" : ""} available
                </p>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
