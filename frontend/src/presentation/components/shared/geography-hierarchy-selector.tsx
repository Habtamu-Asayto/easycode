"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";

import {
  regionsApi,
  zonesApi,
  woredasApi,
  kebelesApi,
} from "@/infrastructure/geography/api";

import { SearchableRelationSelector } from "@/presentation/components/shared";

interface GeographyHierarchySelectorProps {
  fields: Record<string, string | boolean>;
  setField: (key: string, value: string | boolean) => void;
  isLoading: boolean;

  /**
   * 2 = Region → Zone
   * 3 = Region → Zone → Woreda
   * 4 = Region → Zone → Woreda → Kebele
   */
  level: 2 | 3 | 4;
}

export function GeographyHierarchySelector({
  fields,
  setField,
  isLoading,
  level,
}: GeographyHierarchySelectorProps) {
  const regionId = typeof fields.regionId === "string" ? fields.regionId : "";

  const zoneId = typeof fields.zoneId === "string" ? fields.zoneId : "";

  const woredaId = typeof fields.woredaId === "string" ? fields.woredaId : "";

  const kebeleId = typeof fields.kebeleId === "string" ? fields.kebeleId : "";

  // ─────────────────────────────────────────────
  // Region
  // ─────────────────────────────────────────────

  const { data: regions = [], isLoading: isRegionsLoading } = useQuery({
    queryKey: ["regions-lookup"],
    queryFn: () => regionsApi.lookup(),
  });

  // ─────────────────────────────────────────────
  // Zone
  // ─────────────────────────────────────────────

  const { data: zones = [], isLoading: isZonesLoading } = useQuery({
    queryKey: ["zones-by-region", regionId],
    queryFn: () => zonesApi.byRegion(regionId),
    enabled: Boolean(regionId),
  });

  // ─────────────────────────────────────────────
  // Woreda
  // ─────────────────────────────────────────────

  const { data: woredas = [], isLoading: isWoredasLoading } = useQuery({
    queryKey: ["woredas-by-zone", zoneId],
    queryFn: () => woredasApi.byZone(zoneId),
    enabled: level >= 3 && Boolean(zoneId),
  });

  // ─────────────────────────────────────────────
  // Kebele
  // ─────────────────────────────────────────────

  const { data: kebeles = [], isLoading: isKebelesLoading } = useQuery({
    queryKey: ["kebeles-by-woreda", woredaId],
    queryFn: () => kebelesApi.byWoreda(woredaId),
    enabled: level >= 4 && Boolean(woredaId),
  });

  // ─────────────────────────────────────────────
  // Validate Zone when Region changes
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (!regionId) {
      if (zoneId) {
        setField("zoneId", "");
      }

      if (woredaId) {
        setField("woredaId", "");
      }

      if (kebeleId) {
        setField("kebeleId", "");
      }

      return;
    }

    if (
      zoneId &&
      zones.length > 0 &&
      !zones.some((zone) => zone.id === zoneId)
    ) {
      setField("zoneId", "");
      setField("woredaId", "");
      setField("kebeleId", "");
    }
  }, [regionId, zones, zoneId, woredaId, kebeleId, setField]);

  // ─────────────────────────────────────────────
  // Validate Woreda when Zone changes
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (!zoneId) {
      if (woredaId) {
        setField("woredaId", "");
      }

      if (kebeleId) {
        setField("kebeleId", "");
      }

      return;
    }

    if (
      level >= 3 &&
      woredaId &&
      woredas.length > 0 &&
      !woredas.some((woreda) => woreda.id === woredaId)
    ) {
      setField("woredaId", "");
      setField("kebeleId", "");
    }
  }, [zoneId, woredas, woredaId, kebeleId, level, setField]);

  // ─────────────────────────────────────────────
  // Validate Kebele when Woreda changes
  // ─────────────────────────────────────────────

  useEffect(() => {
    if (!woredaId) {
      if (kebeleId) {
        setField("kebeleId", "");
      }

      return;
    }

    if (
      level >= 4 &&
      kebeleId &&
      kebeles.length > 0 &&
      !kebeles.some((kebele) => kebele.id === kebeleId)
    ) {
      setField("kebeleId", "");
    }
  }, [woredaId, kebeles, kebeleId, level, setField]);

  return (
    <div className="space-y-4">
      {/* Region */}
      <SearchableRelationSelector
        label="Region"
        id="region"
        items={regions}
        value={regionId}
        onChange={(value) => {
          setField("regionId", value);
          setField("zoneId", "");
          setField("woredaId", "");
          setField("kebeleId", "");
        }}
        placeholder="Select region"
        searchPlaceholder="Search region..."
        isLoading={isRegionsLoading}
        disabled={isLoading}
        itemLabel="region"
        icon={MapPin}
      />

      {/* Zone */}
      <SearchableRelationSelector
        label="Zone"
        id="zone"
        items={zones}
        value={zoneId}
        onChange={(value) => {
          setField("zoneId", value);
          setField("woredaId", "");
          setField("kebeleId", "");
        }}
        placeholder={regionId ? "Select zone" : "Select region first"}
        searchPlaceholder="Search zone..."
        isLoading={isZonesLoading}
        disabled={isLoading || !regionId}
        itemLabel="zone"
        icon={MapPin}
      />

      {/* Woreda */}
      {level >= 3 && (
        <SearchableRelationSelector
          label="Woreda"
          id="woreda"
          items={woredas}
          value={woredaId}
          onChange={(value) => {
            setField("woredaId", value);
            setField("kebeleId", "");
          }}
          placeholder={zoneId ? "Select woreda" : "Select zone first"}
          searchPlaceholder="Search woreda..."
          isLoading={isWoredasLoading}
          disabled={isLoading || !zoneId}
          itemLabel="woreda"
          icon={MapPin}
        />
      )}

      {/* Kebele */}
      {level >= 4 && (
        <SearchableRelationSelector
          label="Kebele"
          id="kebele"
          items={kebeles}
          value={kebeleId}
          onChange={(value) => {
            setField("kebeleId", value);
          }}
          placeholder={woredaId ? "Select kebele" : "Select woreda first"}
          searchPlaceholder="Search kebele..."
          isLoading={isKebelesLoading}
          disabled={isLoading || !woredaId}
          itemLabel="kebele"
          icon={MapPin}
        />
      )}
    </div>
  );
}
