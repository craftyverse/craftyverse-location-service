import { z } from "zod";
import { locationCurrencyEnum, locationSIUnitEnum } from "./location-schema";

export const PatchLocationfieldSchema = z.object({
  locationName: z.string().optional(),
  locationEmail: z
    .string()
    .email({ message: "you must provide a valid email." })
    .optional(),
  locationIndustry: z.string().optional(),
  locationCurrency: locationCurrencyEnum.optional(),
  locationTimeZone: z.string().optional(),
  locationSIUnit: locationSIUnitEnum.optional(),
  locationLegalBusinessName: z.string().optional(),
  locationLegalAddressLine1: z.string().optional(),
  locationLegalAddressLine2: z.string().optional(),
  locationLegalCity: z.string().optional(),
  locationLegalState: z.string().optional(),
  locationLegalCountry: z.string().optional(),
  locationLegalPostcode: z.string().optional(),
  locationFirstName: z.string().optional(),
  locationLastName: z.string().optional(),
});

export type patchLocationFields = z.infer<typeof PatchLocationfieldSchema>;
