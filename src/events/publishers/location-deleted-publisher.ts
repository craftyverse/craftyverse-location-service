import {
  Publisher,
  Subjects,
  LocationDeletedEvent,
} from "@craftyverse-au/craftyverse-common";

export class LocationDeletedPublisher extends Publisher<LocationDeletedEvent> {
  subject: Subjects.LocationDeleted = Subjects.LocationDeleted;
}
