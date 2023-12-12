import { logEvents } from "../middleware/log-events";
import { Location } from "../model/location";
import { locationSchema, location } from "../schemas/location-schema";
import { BadRequestError } from "@craftyverse-au/craftyverse-common";

export class LocationService {
  static async getLocationById(locationId: string) {}

  static async createLocation(location: location) {
    const newLocation = Location.build({
      locationLegalName: location.locationLegalName,
      locationEmail: location.locationEmail,
      locationIndustry: location.locationIndustry,
      locationRegion: location.locationRegion,
      locationCurrency: location.locationCurrency,
      locationTimeZone: location.locationTimeZone,
      locationSIUnit: location.locationSIUnit,
      locationAddressLine1: location.locationAddressLine1,
      locationAddressLine2: location.locationAddressLine2,
      locationCity: location.locationCity,
      locationState: location.locationState,
      locationCountry: location.locationCountry,
      locationPostcode: location.locationPostcode,
      locationApproved: location.locationApproved,
    });

    const createdLocation = await newLocation.save();

    if (!createdLocation) {
      throw new BadRequestError("There was an error in creating a location.");
    }

    return createdLocation;
  }

  static async getLocationByEmail(locationEmail: string) {
    const existingLocation = await Location.findOne({
      locationEmail: locationEmail,
    });
    return existingLocation?.toJSON();
  }
}
