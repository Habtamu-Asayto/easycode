"use client";

import { Input } from "@/presentation/components/ui/input";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/presentation/components/ui/button";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const [internal, setInternal] = useState(value);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (internal !== value) onChange(internal);
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [internal, debounceMs, onChange, value]);

  return (
    <div className={`relative ${className || ""}`}>
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={internal}
        onChange={(e) => setInternal(e.target.value)}
        placeholder={placeholder}
        className="h-8 pl-8 pr-8 text-sm"
      />
      {internal && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 h-6 w-6 -translate-y-1/2"
          onClick={() => {
            setInternal("");
            onChange("");
          }}
        >
          <X className="h-3 w-3" />
        </Button>
      )}
    </div>
  );
}
