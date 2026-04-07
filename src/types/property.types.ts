// Core property types for the GIS-based property portal

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface NearestAmenity {
  name: string;
  distanceM: number;
  walkMinutes: number;
  coordinates: Coordinates;
}

export interface NearestBusStation extends NearestAmenity {
  routes: string[];
}

export interface NearestAmenities {
  park: NearestAmenity;
  cycleTrack: NearestAmenity;
  walkingTrack: NearestAmenity;
  busStation: NearestBusStation;
}

export interface Property {
  id: number;
  slug: string;
  title: string;
  price: number;
  address: string;
  fullAddress: string[];
  coordinates: Coordinates;
  beds: number;
  baths: number;
  sqm: number;
  berRating: string;
  berColor: 'green' | 'yellow' | 'orange' | 'red';
  images: string[];
  description: string;
  features: string[];
  type: string;
  
  // GIS-specific data
  nearestAmenities: NearestAmenities;
  crimeScore: number; // 0-100 (lower is better)
  desirabilityScore: number; // 0-100 (higher is better)
  pricePerSqm: number;
  
  // Metadata
  listedDate: string;
  status: 'available' | 'pending' | 'rented';
}

export interface Park {
  id: number;
  name: string;
  coordinates: Coordinates;
  size: 'small' | 'medium' | 'large';
  facilities: string[];
  area?: string; // Dublin area
}

export interface CycleTrack {
  id: number;
  name: string;
  path: Coordinates[]; // LineString
  length: number; // km
  surface: 'paved' | 'gravel' | 'mixed';
}

export interface WalkingTrack {
  id: number;
  name: string;
  path: Coordinates[];
  length: number; // km
  difficulty: 'easy' | 'moderate' | 'hard';
}

export interface BusStation {
  id: number;
  name: string;
  coordinates: Coordinates;
  routes: string[];
  frequency: 'high' | 'medium' | 'low'; // buses per hour
}

export interface CrimeZone {
  id: number;
  area: string;
  coordinates: Coordinates;
  crimeScore: number; // 0-100 (higher = more crime)
  radius: number; // meters
  incidents: number; // annual incidents
}

export interface PropertyFilters {
  priceMin?: number;
  priceMax?: number;
  beds?: number;
  baths?: number;
  propertyType?: string;
  maxDistanceToPark?: number; // meters
  maxDistanceToBus?: number; // meters
  maxCrimeScore?: number;
  minDesirabilityScore?: number;
  berRating?: string[];
}

export interface SortOption {
  label: string;
  value: string;
}

export type SortBy = 
  | 'price-asc' 
  | 'price-desc' 
  | 'desirability-desc' 
  | 'date-desc' 
  | 'date-asc'
  | 'value-desc'; // best value (desirability per euro)
