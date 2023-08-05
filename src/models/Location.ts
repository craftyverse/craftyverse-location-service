import mongoose from 'mongoose';

interface LocationFields {
  locationName: string;
  locationEmail: string;
  locationIndustry: string;
  locationRegion: 'AUS' | 'ENG' | 'US' | 'CHN';
  locationCurrency: string;
  locationTimeZone: string;
  locationSIUnit: string;
  locationLegalBusinessName: string;
  locationLegalAddressLine1: string;
  locationLegalAddressLine2: string;
  locationLegalCity: string;
  locationLegalState: string;
  locationLegalCountry: string;
  locationLegalPostcode: string;
}
