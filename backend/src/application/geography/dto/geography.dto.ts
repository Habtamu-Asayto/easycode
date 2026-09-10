import { z } from 'zod';
import { PaginationQuerySchema } from '../../../shared/dto';

// ── Geography DTOs ───────────────────────────────────────────────────────────

export const CreateRegionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  code: z.string().min(1, 'Code is required').max(20),
  isActive: z.boolean().optional().default(true),
});

export const UpdateRegionSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  code: z.string().min(1).max(20).optional(),
  isActive: z.boolean().optional(),
});

export const CreateZoneSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  code: z.string().min(1, 'Code is required').max(20),
  regionId: z.string().uuid('Valid region ID is required'),
  isActive: z.boolean().optional().default(true),
});

export const UpdateZoneSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  code: z.string().min(1).max(20).optional(),
  regionId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});

export const CreateWoredaSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  code: z.string().min(1, 'Code is required').max(20),
  zoneId: z.string().uuid('Valid zone ID is required'),
  isActive: z.boolean().optional().default(true),
});

export const UpdateWoredaSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  code: z.string().min(1).max(20).optional(),
  zoneId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});

export const CreateKebeleSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  code: z.string().min(1, 'Code is required').max(20),
  woredaId: z.string().uuid('Valid woreda ID is required'),
  isActive: z.boolean().optional().default(true),
});

export const UpdateKebeleSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  code: z.string().min(1).max(20).optional(),
  woredaId: z.string().uuid().optional(),
  isActive: z.boolean().optional(),
});

export const GeographyQuerySchema = PaginationQuerySchema.extend({
  isActive: z.coerce.boolean().optional(),
  regionId: z.string().uuid().optional(),
  zoneId: z.string().uuid().optional(),
  woredaId: z.string().uuid().optional(),
});

export type CreateRegionDto = z.infer<typeof CreateRegionSchema>;
export type UpdateRegionDto = z.infer<typeof UpdateRegionSchema>;
export type CreateZoneDto = z.infer<typeof CreateZoneSchema>;
export type UpdateZoneDto = z.infer<typeof UpdateZoneSchema>;
export type CreateWoredaDto = z.infer<typeof CreateWoredaSchema>;
export type UpdateWoredaDto = z.infer<typeof UpdateWoredaSchema>;
export type CreateKebeleDto = z.infer<typeof CreateKebeleSchema>;
export type UpdateKebeleDto = z.infer<typeof UpdateKebeleSchema>;
export type GeographyQueryDto = z.infer<typeof GeographyQuerySchema>;