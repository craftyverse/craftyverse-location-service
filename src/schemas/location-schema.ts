import { z } from "zod";

export const locationSIUnitEnum = z.enum(["LB", "KG"]);
export const locationCurrencyEnum = z.enum(["AUD", "USD", "RMB"]);

export const LocationRequestSchema = z.object({
  locationName: z.string(),
  locationFirstName: z.string(),
  locationLastName: z.string(),
  locationEmail: z.string().email(),
  locationIndustry: z.string(),
  locationCurrency: locationCurrencyEnum,
  locationTimeZone: z.string(),
  locationSIUnit: locationSIUnitEnum,
  locationLegalBusinessName: z.string(),
  locationLegalAddressLine1: z.string(),
  locationLegalAddressLine2: z.string().optional(),
  locationLegalCity: z.string(),
  locationLegalState: z.string(),
  locationLegalCountry: z.string(),
  locationLegalPostcode: z.string(),
  locationApproved: z.boolean(),
});

export const LocationResponseSchema = z.object({
  locationId: z.string(),
  locationUserId: z.string(),
  locationName: z.string(),
  locationFirstName: z.string(),
  locationLastName: z.string(),
  locationEmail: z.string().email(),
  locationIndustry: z.string(),
  locationCurrency: locationCurrencyEnum,
  locationTimeZone: z.string(),
  locationSIUnit: locationSIUnitEnum,
  locationLegalBusinessName: z.string(),
  locationLegalAddressLine1: z.string(),
  locationLegalAddressLine2: z.string(),
  locationLegalCity: z.string(),
  locationLegalState: z.string(),
  locationLegalCountry: z.string(),
  locationLegalPostcode: z.string(),
  locationApproved: z.boolean(),
});

export type NewLocationRequest = z.infer<typeof LocationRequestSchema>;
export type LocationResponse = z.infer<typeof LocationResponseSchema>;
export type LocationSIUnitEnum = z.infer<typeof locationSIUnitEnum>;
