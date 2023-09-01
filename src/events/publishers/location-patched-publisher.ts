import {
  Publisher,
  Subjects,
  LocationPatchedEvent,
} from "@craftyverse-au/craftyverse-common";

export class LocationPatchedPublisher extends Publisher<LocationPatchedEvent> {
  subject: Subjects.LocationPatched = Subjects.LocationPatched;
}
