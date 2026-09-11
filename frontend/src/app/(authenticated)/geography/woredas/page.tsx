"use client";

import { useCallback } from "react";
import { GeographyHierarchySelector } from "@/presentation/components/shared/geography-hierarchy-selector";
import { Building2, Check, X, Database } from "lucide-react";

import { woredasApi } from "@/infrastructure/geography/api";

import {
  CrudPage,
  StatusBadge,
  MasterDataFormDialog,
  SearchableRelationSelector,
} from "@/presentation/components/shared";

import type { ColumnDef, StatDef } from "@/presentation/components/shared";

import type { WoredaResponse } from "@/domain/geography/entities";

import { Badge } from "@/presentation/components/ui/badge";

const columns: ColumnDef<WoredaResponse>[] = [
  {
    key: "name",
    label: "Name",
    className: "w-[250px]",
    render: (w) => (
      <span className="text-foreground text-[13px] font-medium">{w.name}</span>
    ),
  },
  {
    key: "code",
    label: "Code",
    render: (w) => (
      <span className="text-muted-foreground text-[13px]">{w.code}</span>
    ),
  },
  {
    key: "zone",
    label: "Zone",
    render: (w) =>
      w.zone ? (
        <Badge variant="outline" className="text-[11px] font-normal">
          {w.zone.name}
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: "status",
    label: "Status",
    render: (w) => <StatusBadge isActive={w.isActive} />,
  },
];

function getStats(items: WoredaResponse[], total: number): StatDef[] {
  return [
    {
      label: "Total Woredas",
      value: total,
      icon: Database,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Active",
      value: items.filter((w) => w.isActive).length,
      icon: Check,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
      iconColor: "text-emerald-600",
    },
    {
      label: "Inactive",
      value: items.filter((w) => !w.isActive).length,
      icon: X,
      iconBg: "bg-amber-50 dark:bg-amber-950/30",
      iconColor: "text-amber-600",
    },
  ];
}

export default function WoredasPage() {
  const getDefaults = useCallback(
    (item: WoredaResponse | null) => ({
      name: item?.name ?? "",
      code: item?.code ?? "",
      zoneId: item?.zoneId ?? "",

      // Internal form-only field.
      _regionId: item?.zone?.region?.id ?? "",
      _zoneId: item?.zoneId ?? "",
    }),
    [],
  );

  return (
    <CrudPage<WoredaResponse>
      title="Woredas"
      description="Manage administrative woredas within zones"
      entityName="Woreda"
      queryKey="woredas"
      permission="geography"
      icon={Building2}
      api={woredasApi}
      columns={columns}
      getStats={getStats}
      renderFormDialog={({ open, onOpenChange, editItem, onSuccess }) => (
        <MasterDataFormDialog<WoredaResponse>
          open={open}
          onOpenChange={onOpenChange}
          editItem={editItem}
          onSuccess={onSuccess}
          entityName="Woreda"
          api={woredasApi}
          getDefaults={getDefaults}
          showDescription={false}
          renderExtraFields={(fields, setField, isLoading) => (
            <GeographyHierarchySelector
              fields={fields}
              setField={setField}
              isLoading={isLoading}
              level={2}
            />
          )}
        />
      )}
    />
  );
}
