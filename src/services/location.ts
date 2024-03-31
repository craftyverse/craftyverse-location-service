import { logEvents } from "../middleware/log-events";
import { Location } from "../model/location";
import {
  LocationRequest,
  LocationResponse,
  UpdateLocation,
} from "../schemas/location-schema";
import { BadRequestError } from "@craftyverse-au/craftyverse-common";
import { updateLocationSchema } from "../schemas/location-schema";
export class LocationService {
  static async createLocation(location: LocationRequest) {
    const newLocation = Location.build({
      locationLegalName: location.locationLegalName,
      locationUserEmail: location.locationUserEmail,
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
      locationApprovedAt: location.locationApprovedAt || null,
      locationCreatedAt: location.locationCreatedAt,
      locationDeletedAt: location.locationDeletedAt || null,
    });

    const createdLocation = await newLocation.save();

    if (!createdLocation) {
      throw new BadRequestError("There was an error in creating a location.");
    }

    return createdLocation;
  }

  static async getLocationById(locationId: string) {
    const exsitingLocation = await Location.findById(locationId);

    return exsitingLocation?.toJSON();
  }

  static async getLocationByEmail(locationEmail: string) {
    const exsitingLocation = await Location.findOne({
      locationEmail: locationEmail,
    });

    return exsitingLocation?.toJSON();
  }

  static async getAllLocationsByUserEmail(
    page: number,
    limit: number,
    userEmail: string
  ) {
    const locations = await Location.find({ locationUserEmail: userEmail })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalLocations = await Location.countDocuments({
      locationUserEmail: userEmail,
    });

    return {
      locations: locations,
      totalPages: Math.ceil(totalLocations / limit),
      currentPage: page,
    };
  }

  static async updateLocationById(
    filter: Record<string, string>,
    updateFields: UpdateLocation
  ) {
    if (!filter || !updateFields) {
      throw new BadRequestError("Filter is required.");
    }

    const updatedLocation = await Location.findOneAndUpdate(
      filter,
      updateFields,
      {
        new: true,
      }
    );

    return updatedLocation?.toJSON();
  }

  static async deleteLocationById(locationId: string) {
    if (!locationId) {
      throw new BadRequestError("Location Id is required.");
    }

    const deletedLocation = await Location.findByIdAndDelete(locationId);

    if (!deletedLocation.value) {
      throw new BadRequestError("Could not delete location.");
    }

    return deletedLocation.ok;
  }
}
