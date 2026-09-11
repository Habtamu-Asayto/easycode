"use client";

import { useCallback, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { zonesApi, regionsApi } from "@/infrastructure/geography/api";
import {
  CrudPage,
  StatusBadge,
  MasterDataFormDialog,
  SearchableRelationSelector,
} from "@/presentation/components/shared";
import type { ColumnDef, StatDef } from "@/presentation/components/shared";
import type { ZoneResponse } from "@/domain/geography/entities";
import { Badge } from "@/presentation/components/ui/badge";
import { Label } from "@/presentation/components/ui/label";
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
import { Check, MapPin, Search, X, Database } from "lucide-react";
import { Input } from "@/presentation/components/ui/input";

const columns: ColumnDef<ZoneResponse>[] = [
  {
    key: "name",
    label: "Name",
    className: "w-[250px]",
    render: (z) => (
      <span className="text-foreground text-[13px] font-medium">{z.name}</span>
    ),
  },
  {
    key: "code",
    label: "Code",
    render: (z) => (
      <span className="text-muted-foreground text-[13px]">{z.code}</span>
    ),
  },
  {
    key: "region",
    label: "Region",
    render: (z) =>
      z.region ? (
        <Badge variant="outline" className="text-[11px] font-normal">
          {z.region.name}
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: "status",
    label: "Status",
    render: (z) => <StatusBadge isActive={z.isActive} />,
  },
];

function getStats(items: ZoneResponse[], total: number): StatDef[] {
  return [
    {
      label: "Total Zones",
      value: total,
      icon: Database,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Active",
      value: items.filter((z) => z.isActive).length,
      icon: Check,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
      iconColor: "text-emerald-600",
    },
    {
      label: "Inactive",
      value: items.filter((z) => !z.isActive).length,
      icon: X,
      iconBg: "bg-amber-50 dark:bg-amber-950/30",
      iconColor: "text-amber-600",
    },
  ];
}

export default function ZonesPage() {
  const { data: regions = [], isLoading: isRegionsLoading } = useQuery({
    queryKey: ["regions-lookup"],
    queryFn: () => regionsApi.lookup(),
  });

  const getDefaults = useCallback(
    (item: ZoneResponse | null) => ({
      name: item?.name ?? "",
      code: item?.code ?? "",
      regionId: item?.regionId ?? "",
    }),
    [],
  );

  return (
    <CrudPage<ZoneResponse>
      title="Zones"
      description="Manage administrative zones within regions"
      entityName="Zone"
      queryKey="zones"
      permission="geography"
      icon={MapPin}
      api={zonesApi}
      columns={columns}
      getStats={getStats}
      renderFormDialog={({ open, onOpenChange, editItem, onSuccess }) => (
        <MasterDataFormDialog<ZoneResponse>
          open={open}
          onOpenChange={onOpenChange}
          editItem={editItem}
          onSuccess={onSuccess}
          entityName="Zone"
          api={zonesApi}
          getDefaults={getDefaults}
          showDescription={false}
          renderExtraFields={(fields, setField, isLoading) => (
            <SearchableRelationSelector
              label="Region"
              id="region"
              items={regions}
              value={fields.regionId as string}
              onChange={(value) => setField("regionId", value)}
              placeholder="Select region"
              searchPlaceholder="Search region..."
              isLoading={isRegionsLoading}
              disabled={isLoading}
              itemLabel="region"
              icon={MapPin}
            />
          )}
        />
      )}
    />
  );
}
