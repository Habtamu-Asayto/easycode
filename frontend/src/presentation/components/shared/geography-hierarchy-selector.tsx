"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";

import {
  regionsApi,
  zonesApi,
  woredasApi,
} from "@/infrastructure/geography/api";

import { SearchableRelationSelector } from "@/presentation/components/shared";

interface GeographyHierarchySelectorProps {
  fields: Record<string, string | boolean>;
  setField: (key: string, value: string | boolean) => void;
  isLoading: boolean;

  /**
   * How deep the hierarchy should be displayed.
   *
   * 2 = Region → Zone
   * 3 = Region → Zone → Woreda
   */
  level: 2 | 3;
}

export function GeographyHierarchySelector({
  fields,
  setField,
  isLoading,
  level,
}: GeographyHierarchySelectorProps) {
  const regionId = typeof fields._regionId === "string" ? fields._regionId : "";

  const zoneId = typeof fields._zoneId === "string" ? fields._zoneId : "";

  const woredaId = typeof fields.woredaId === "string" ? fields.woredaId : "";

  // ───────────────────────────────────────────────────────────────────────────
  // Regions
  // ───────────────────────────────────────────────────────────────────────────

  const { data: regions = [], isLoading: isRegionsLoading } = useQuery({
    queryKey: ["regions-lookup"],
    queryFn: () => regionsApi.lookup(),
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Zones depend on Region
  // ───────────────────────────────────────────────────────────────────────────

  const { data: zones = [], isLoading: isZonesLoading } = useQuery({
    queryKey: ["zones-by-region", regionId],
    queryFn: () => zonesApi.byRegion(regionId),
    enabled: Boolean(regionId),
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Woredas depend on Zone
  // ───────────────────────────────────────────────────────────────────────────

  const { data: woredas = [], isLoading: isWoredasLoading } = useQuery({
    queryKey: ["woredas-by-zone", zoneId],
    queryFn: () => woredasApi.byZone(zoneId),
    enabled: level >= 3 && Boolean(zoneId),
  });

  // ───────────────────────────────────────────────────────────────────────────
  // Clear dependent values
  // ───────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!regionId) {
      if (zoneId) {
        setField("_zoneId", "");
      }

      if (woredaId) {
        setField("woredaId", "");
      }

      return;
    }

    // Region changed and current zone does not belong to it.
    if (
      zoneId &&
      zones.length > 0 &&
      !zones.some((zone) => zone.id === zoneId)
    ) {
      setField("_zoneId", "");
      setField("woredaId", "");
    }
  }, [regionId, zones, zoneId, woredaId, setField]);

  useEffect(() => {
    if (!zoneId) {
      if (woredaId) {
        setField("woredaId", "");
      }

      return;
    }

    // Zone changed and current woreda does not belong to it.
    if (
      level >= 3 &&
      woredaId &&
      woredas.length > 0 &&
      !woredas.some((woreda) => woreda.id === woredaId)
    ) {
      setField("woredaId", "");
    }
  }, [zoneId, woredas, woredaId, level, setField]);

  return (
    <div className="space-y-4">
      {/* ────────────────────────────────────────────────────────────────────
          Region
      ──────────────────────────────────────────────────────────────────── */}

      <SearchableRelationSelector
        label="Region"
        id="region"
        items={regions}
        value={regionId}
        onChange={(value) => {
          setField("_regionId", value);

          // Region changed → reset all children.
          setField("_zoneId", "");
          setField("woredaId", "");
        }}
        placeholder="Select region"
        searchPlaceholder="Search region..."
        isLoading={isRegionsLoading}
        disabled={isLoading}
        itemLabel="region"
        icon={MapPin}
      />

      {/* ────────────────────────────────────────────────────────────────────
          Zone
      ──────────────────────────────────────────────────────────────────── */}

      <SearchableRelationSelector
        label="Zone"
        id="zone"
        items={zones}
        value={zoneId}
        onChange={(value) => {
          setField("_zoneId", value);
          setField("zoneId", value);
          setField("woredaId", "");
        }}
        placeholder={regionId ? "Select zone" : "Select region first"}
        searchPlaceholder="Search zone..."
        isLoading={isZonesLoading}
        disabled={isLoading || !regionId}
        itemLabel="zone"
        icon={MapPin}
      />

      {/* ────────────────────────────────────────────────────────────────────
          Woreda
      ──────────────────────────────────────────────────────────────────── */}

      {level >= 3 && (
        <SearchableRelationSelector
          label="Woreda"
          id="woreda"
          items={woredas}
          value={woredaId}
          onChange={(value) => {
            setField("woredaId", value);
          }}
          placeholder={zoneId ? "Select woreda" : "Select zone first"}
          searchPlaceholder="Search woreda..."
          isLoading={isWoredasLoading}
          disabled={isLoading || !zoneId}
          itemLabel="woreda"
          icon={MapPin}
        />
      )}
    </div>
  );
}
