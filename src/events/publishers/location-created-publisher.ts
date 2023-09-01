import {
  Publisher,
  Subjects,
  LocationCreatedEvent,
} from "@craftyverse-au/craftyverse-common";

export class LocationCreatedPublisher extends Publisher<LocationCreatedEvent> {
  subject: Subjects.LocationCreated = Subjects.LocationCreated;
}
