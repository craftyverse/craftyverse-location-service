import mongoose from 'mongoose';

interface LocationFields {
  locationUserId: string;
  locationName: string;
  locationEmail: string;
  locationIndustry: string;
  locationRegion: 'AUS' | 'ENG' | 'USA' | 'CHN';
  locationCurrency: string;
  locationTimeZone: string;
  locationSIUnit: 'LB' | 'KG';
  locationLegalBusinessName: string;
  locationLegalAddressLine1: string;
  locationLegalAddressLine2: string | undefined;
  locationLegalCity: string;
  locationLegalState: string;
  locationLegalCountry: string;
  locationLegalPostcode: string;
}

// Properties that a location model (database) requires
interface LocationModel extends mongoose.Model<LocationDocument> {
  build(fields: LocationFields): LocationDocument;
}

// Properties that the Location document requires
interface LocationDocument extends mongoose.Document {
  locationUserId: string;
  locationName: string;
  locationEmail: string;
  locationIndustry: string;
  locationRegion: 'AUS' | 'ENG' | 'US' | 'CHN';
  locationCurrency: string;
  locationTimeZone: string;
  locationSIUnit: 'LB' | 'KG';
  locationLegalBusinessName: string;
  locationLegalAddressLine1: string;
  locationLegalAddressLine2: string;
  locationLegalCity: string;
  locationLegalState: string;
  locationLegalCountry: string;
  locationLegalPostcode: string;
}

const locationSchema = new mongoose.Schema(
  {
    locationUserId: { type: String, required: true },
    locationName: { type: String, required: true },
    locationEmail: { type: String, required: true },
    locationIndustry: { type: String, required: true },
    locationRegion: { type: String, required: true },
    locationCurrency: { type: String, required: true },
    locationTimeZone: { type: String, required: true },
    locationSIUnit: { type: String, required: true },
    locationLegalBusinessName: { type: String, required: true },
    locationLegalAddressLine1: { type: String, required: true },
    locationLegalAddressLine2: { type: String, required: true },
    locationLegalCity: { type: String, required: true },
    locationLegalState: { type: String, required: true },
    locationLegalCountry: { type: String, required: true },
    locationLegalPostcode: { type: String, required: true },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

locationSchema.statics.build = (fields: LocationFields) => {
  return new Location(fields);
};

const Location = mongoose.model<LocationDocument, LocationModel>(
  'Location',
  locationSchema
);

export { Location };
