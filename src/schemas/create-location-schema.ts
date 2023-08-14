import { z } from 'zod';

const locationRegionEnum = z.enum(['AUS', 'ENG', 'USA', 'CHN']);

const locationSIUnitEnum = z.enum(['LB', 'KG']);

export const createLocationRequestSchema = z.object({
  locationName: z.string(),
  locationEmail: z.string().email(),
  locationIndustry: z.string(),
  locationRegion: locationRegionEnum,
  locationCurrency: z.string(),
  locationTimeZone: z.string(),
  locationSIUnit: locationSIUnitEnum,
  locationLegalBusinessName: z.string(),
  locationLegalAddressLine1: z.string(),
  locationLegalAddressLine2: z.string().optional(),
  locationLegalCity: z.string(),
  locationLegalState: z.string(),
  locationLegalCountry: z.string(),
  locationLegalPostcode: z.string(),
});

export type NewLocation = z.infer<typeof createLocationRequestSchema>;
export type LocationRegionEnum = z.infer<typeof locationRegionEnum>;
export type LocationSIUnitEnum = z.infer<typeof locationSIUnitEnum>;
