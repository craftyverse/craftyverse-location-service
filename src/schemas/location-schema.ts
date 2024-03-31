import { z } from "zod";

const locationRegionSchema = z.enum(["EN", "CHN", "AUS", "USA"]);

const locationCurrencySchema = z.enum(["USD", "CNY", "AUD", "EUR"]);

export const locationSchema = z.object({
  locationLegalName: z.string(),
  locationUserEmail: z.string().email(),
  locationEmail: z.string(),
  locationIndustry: z.string(),
  locationRegion: locationRegionSchema,
  locationCurrency: locationCurrencySchema,
  locationTimeZone: z.string(),
  locationSIUnit: z.string(),
  locationAddressLine1: z.string(),
  locationAddressLine2: z.string(),
  locationCity: z.string(),
  locationState: z.string(),
  locationCountry: z.string(),
  locationPostcode: z.string(),
  locationApproved: z.boolean(),
  locationApprovedAt: z.string().nullable(),
  locationCreatedAt: z.string(),
  locationDeletedAt: z.string().nullable(),
});

export const updateLocationSchema = z.object({
  locationLegalName: z.string().optional(),
  locationUserEmail: z.string().email().optional(),
  locationEmail: z.string().optional(),
  locationIndustry: z.string().optional(),
  locationRegion: locationRegionSchema.optional(),
  locationCurrency: locationCurrencySchema.optional(),
  locationTimeZone: z.string().optional(),
  locationSIUnit: z.string().optional(),
  locationAddressLine1: z.string().optional(),
  locationAddressLine2: z.string().optional(),
  locationCity: z.string().optional(),
  locationState: z.string().optional(),
  locationCountry: z.string().optional(),
  locationPostcode: z.string().optional(),
  locationApproved: z.boolean().optional(),
  locationApprovedAt: z.string().nullable(),
  locationCreatedAt: z.string(),
  locationDeletedAt: z.string().nullable(),
});

export const locationResponseSchema = locationSchema.extend({
  locationId: z.string(),
  locationUserEmail: z.string(),
});

export type UpdateLocation = z.infer<typeof updateLocationSchema>;
export type LocationRequest = z.infer<typeof locationSchema>;
export type LocationResponse = z.infer<typeof locationResponseSchema>;
export type LocationRegion = z.infer<typeof locationRegionSchema>;
export type LocationCurrency = z.infer<typeof locationCurrencySchema>;
