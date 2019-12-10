interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface Northeast {
  lat: number;
  lng: number;
}

interface Southwest {
  lat: number;
  lng: number;
}

interface Bounds {
  northeast: Northeast;
  southwest: Southwest;
}

interface Location {
  lat: number;
  lng: number;
}

interface Northeast2 {
  lat: number;
  lng: number;
}

interface Southwest2 {
  lat: number;
  lng: number;
}

interface Viewport {
  northeast: Northeast2;
  southwest: Southwest2;
}

interface Geometry {
  bounds: Bounds;
  location: Location;
  location_type: string;
  viewport: Viewport;
}

interface Result {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  place_id: string;
  types: string[];
}

interface RootObject {
  results: Result[];
  status: string;
}

export {
  AddressComponent,
  Northeast,
  Southwest,
  Bounds,
  Location,
  Northeast2,
  Southwest2,
  Viewport,
  Geometry,
  Result,
  RootObject
}