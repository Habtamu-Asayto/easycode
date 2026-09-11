"use client";

import { useCallback } from "react";
import { regionsApi } from "@/infrastructure/geography/api";
import {
  CrudPage,
  StatusBadge,
  MasterDataFormDialog,
} from "@/presentation/components/shared";
import type { ColumnDef, StatDef } from "@/presentation/components/shared";
import type { RegionResponse } from "@/domain/geography/entities";
import { Map, Check, X, Database } from "lucide-react";

const columns: ColumnDef<RegionResponse>[] = [
  {
    key: "name",
    label: "Name",
    className: "w-[250px]",
    render: (r) => (
      <span className="text-foreground text-[13px] font-medium">{r.name}</span>
    ),
  },
  {
    key: "code",
    label: "Code",
    render: (r) => (
      <span className="text-muted-foreground text-[13px]">{r.code}</span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (r) => <StatusBadge isActive={r.isActive} />,
  },
];

function getStats(items: RegionResponse[], total: number): StatDef[] {
  return [
    {
      label: "Total Regions",
      value: total,
      icon: Database,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Active",
      value: items.filter((r) => r.isActive).length,
      icon: Check,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
      iconColor: "text-emerald-600",
    },
    {
      label: "Inactive",
      value: items.filter((r) => !r.isActive).length,
      icon: X,
      iconBg: "bg-amber-50 dark:bg-amber-950/30",
      iconColor: "text-amber-600",
    },
  ];
}

export default function RegionsPage() {
  const getDefaults = useCallback(
    (item: RegionResponse | null) => ({
      name: item?.name ?? "",
      code: item?.code ?? "",
    }),
    [],
  );

  return (
    <CrudPage<RegionResponse>
      title="Regions"
      description="Manage Ethiopian administrative regions"
      entityName="Region"
      queryKey="regions"
      permission="geography"
      icon={Map}
      api={regionsApi}
      columns={columns}
      getStats={getStats}
      renderFormDialog={({ open, onOpenChange, editItem, onSuccess }) => (
        <MasterDataFormDialog<RegionResponse>
          open={open}
          onOpenChange={onOpenChange}
          editItem={editItem}
          onSuccess={onSuccess}
          entityName="Region"
          api={regionsApi}
          getDefaults={getDefaults}
          showDescription={false}
        />
      )}
    />
  );
}
