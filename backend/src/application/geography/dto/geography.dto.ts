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

export const GeographyQuerySchema = PaginationQuerySchema.extend({
  isActive: z
    .enum(['true', 'false'])
    .transform((value) => value === 'true')
    .optional(),

  regionId: z.string().uuid().optional(),
  zoneId: z.string().uuid().optional(),
  woredaId: z.string().uuid().optional(),
});

export type CreateRegionDto = z.infer<typeof CreateRegionSchema>;

export type UpdateRegionDto = z.infer<typeof UpdateRegionSchema>;

export type GeographyQueryDto = z.infer<typeof GeographyQuerySchema>;
