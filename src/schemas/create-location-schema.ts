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
  locationLegalAddressLine2: z.string(),
  locationLegalCity: z.string(),
  locationLegalState: z.string(),
  locationLegalCountry: z.string(),
  locationLegalPostcode: z.string(),
});

export type createLocationRequest = z.infer<typeof createLocationRequestSchema>;
export type locationRegionEnum = z.infer<typeof locationRegionEnum>;
export type locationSIUnitEnum = z.infer<typeof locationSIUnitEnum>;
