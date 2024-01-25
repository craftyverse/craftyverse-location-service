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
});

export const locationResponseSchema = locationSchema.extend({
  locationId: z.string(),
  locationUserEmail: z.string(),
});

export type LocationRequest = z.infer<typeof locationSchema>;
export type LocationResponse = z.infer<typeof locationResponseSchema>;
export type LocationRegion = z.infer<typeof locationRegionSchema>;
export type LocationCurrency = z.infer<typeof locationCurrencySchema>;
