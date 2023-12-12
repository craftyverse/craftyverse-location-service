import mongoose from "mongoose";

// Properties that are required to create a Location
interface LocationFields {
  locationLegalName: string;
  locationEmail: string;
  locationIndustry: string;
  locationRegion: string;
  locationCurrency: string;
  locationTimeZone: string;
  locationSIUnit: string;
  locationAddressLine1: string;
  locationAddressLine2: string;
  locationCity: string;
  locationState: string;
  locationCountry: string;
  locationPostcode: string;
  locationApproved: boolean;
}

interface LocationDocument extends mongoose.Document {
  locationLegalName: string;
  locationEmail: string;
  locationIndustry: string;
  locationRegion: string;
  locationCurrency: string;
  locationTimeZone: string;
  locationSIUnit: string;
  locationAddressLine1: string;
  locationAddressLine2: string;
  locationCity: string;
  locationState: string;
  locationCountry: string;
  locationPostcode: string;
  locationApproved: boolean;
}

// Properties that a location model requires
interface LocationModel extends mongoose.Model<LocationDocument> {
  build(fields: LocationFields): LocationDocument;
}

const locationSchema = new mongoose.Schema({
  locationLegalName: { type: String, required: true },
  locationEmail: { type: String, required: true },
  locationIndustry: { type: String, required: true },
  locationRegion: { type: String, required: true },
  locationCurrency: { type: String, required: true },
  locationTimeZone: { type: String, required: true },
  locationSIUnit: { type: String, required: true },
  locationAddressLine1: { type: String, required: true },
  locationAddressLine2: { type: String, required: true },
  locationCity: { type: String, required: true },
  locationState: { type: String, required: true },
  locationCountry: { type: String, required: true },
  locationPostcode: { type: String, required: true },
  locationApproved: { type: Boolean, required: true },
});

locationSchema.statics.build = (fields: LocationFields) => {
  return new Location(fields);
};

const Location = mongoose.model<LocationDocument, LocationModel>(
  "Location",
  locationSchema
);

export { Location };
