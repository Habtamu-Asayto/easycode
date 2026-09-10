"use client";

import { useCallback } from "react";

import { GeographyHierarchySelector } from "@/presentation/components/shared/geography-hierarchy-selector";

import { kebelesApi, woredasApi } from "@/infrastructure/geography/api";
import {
  CrudPage,
  StatusBadge,
  MasterDataFormDialog,
  SearchableRelationSelector,
} from "@/presentation/components/shared";
import type { ColumnDef, StatDef } from "@/presentation/components/shared";
import type { KebeleResponse } from "@/domain/geography/entities";
import { Badge } from "@/presentation/components/ui/badge";
import { Label } from "@/presentation/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/presentation/components/ui/select";
import { Home, Check, X, Database, MapPin } from "lucide-react";

const columns: ColumnDef<KebeleResponse>[] = [
  {
    key: "name",
    label: "Name",
    className: "w-[250px]",
    render: (k) => (
      <span className="text-[13px] font-medium text-foreground">{k.name}</span>
    ),
  },
  {
    key: "code",
    label: "Code",
    render: (k) => (
      <span className="text-[13px] text-muted-foreground">{k.code}</span>
    ),
  },
  {
    key: "woreda",
    label: "Woreda",
    render: (k) =>
      k.woreda ? (
        <Badge variant="outline" className="text-[11px] font-normal">
          {k.woreda.name}
        </Badge>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: "status",
    label: "Status",
    render: (k) => <StatusBadge isActive={k.isActive} />,
  },
];

function getStats(items: KebeleResponse[], total: number): StatDef[] {
  return [
    {
      label: "Total Kebeles",
      value: total,
      icon: Database,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      label: "Active",
      value: items.filter((k) => k.isActive).length,
      icon: Check,
      iconBg: "bg-emerald-50 dark:bg-emerald-950/30",
      iconColor: "text-emerald-600",
    },
    {
      label: "Inactive",
      value: items.filter((k) => !k.isActive).length,
      icon: X,
      iconBg: "bg-amber-50 dark:bg-amber-950/30",
      iconColor: "text-amber-600",
    },
  ];
}

export default function KebelesPage() {
  const getDefaults = useCallback(
    (item: KebeleResponse | null) => ({
      name: item?.name ?? "",
      code: item?.code ?? "",
      woredaId: item?.woredaId ?? "",

      // Internal form-only hierarchy fields.
      _regionId: item?.woreda?.zone?.region?.id ?? "",
      _zoneId: item?.woreda?.zone?.id ?? "",
    }),
    [],
  );

  return (
    <CrudPage<KebeleResponse>
      title="Kebeles"
      description="Manage administrative kebeles within woredas"
      entityName="Kebele"
      queryKey="kebeles"
      permission="geography"
      icon={Home}
      api={kebelesApi}
      columns={columns}
      getStats={getStats}
      renderFormDialog={({ open, onOpenChange, editItem, onSuccess }) => (
        <MasterDataFormDialog<KebeleResponse>
          open={open}
          onOpenChange={onOpenChange}
          editItem={editItem}
          onSuccess={onSuccess}
          entityName="Kebele"
          api={kebelesApi}
          getDefaults={getDefaults}
          showDescription={false}
          renderExtraFields={(fields, setField, isLoading) => (
            <GeographyHierarchySelector
              fields={fields}
              setField={setField}
              isLoading={isLoading}
              level={3}
            />
          )}
        />
      )}
    />
  );
}
