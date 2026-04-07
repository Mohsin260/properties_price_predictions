// Geospatial calculation utilities using Turf.js

import { distance, point } from '@turf/turf';
import type { Coordinates, NearestAmenity, Property } from '@/types/property.types';
import type { Park, BusStation, CycleTrack, WalkingTrack, CrimeZone } from '@/types/property.types';

/**
 * Calculate distance between two coordinates in meters
 */
export function calculateDistance(from: Coordinates, to: Coordinates): number {
  const fromPoint = point([from.lng, from.lat]);
  const toPoint = point([to.lng, to.lat]);
  return distance(fromPoint, toPoint, { units: 'meters' });
}

/**
 * Calculate walking time in minutes (average walking speed: 5 km/h)
 */
export function calculateWalkTime(distanceM: number): number {
  const walkingSpeedKmH = 5;
  const distanceKm = distanceM / 1000;
  return Math.round((distanceKm / walkingSpeedKmH) * 60);
}

/**
 * Find nearest park to a property
 */
export function findNearestPark(propertyCoords: Coordinates, parks: Park[]): NearestAmenity {
  let nearest = parks[0];
  let minDistance = calculateDistance(propertyCoords, parks[0].coordinates);

  parks.forEach(park => {
    const dist = calculateDistance(propertyCoords, park.coordinates);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = park;
    }
  });

  return {
    name: nearest.name,
    distanceM: Math.round(minDistance),
    walkMinutes: calculateWalkTime(minDistance),
    coordinates: nearest.coordinates
  };
}

/**
 * Find nearest bus station to a property
 */
export function findNearestBusStation(
  propertyCoords: Coordinates, 
  busStations: BusStation[]
): NearestAmenity & { routes: string[] } {
  let nearest = busStations[0];
  let minDistance = calculateDistance(propertyCoords, busStations[0].coordinates);

  busStations.forEach(station => {
    const dist = calculateDistance(propertyCoords, station.coordinates);
    if (dist < minDistance) {
      minDistance = dist;
      nearest = station;
    }
  });

  return {
    name: nearest.name,
    distanceM: Math.round(minDistance),
    walkMinutes: calculateWalkTime(minDistance),
    coordinates: nearest.coordinates,
    routes: nearest.routes
  };
}

/**
 * Find nearest point on a cycle track
 */
export function findNearestCycleTrack(
  propertyCoords: Coordinates,
  cycleTracks: CycleTrack[]
): NearestAmenity {
  let nearestTrack = cycleTracks[0];
  let minDistance = Infinity;

  cycleTracks.forEach(track => {
    track.path.forEach(pathPoint => {
      const dist = calculateDistance(propertyCoords, pathPoint);
      if (dist < minDistance) {
        minDistance = dist;
        nearestTrack = track;
      }
    });
  });

  return {
    name: nearestTrack.name,
    distanceM: Math.round(minDistance),
    walkMinutes: calculateWalkTime(minDistance),
    coordinates: nearestTrack.path[0]
  };
}

/**
 * Find nearest walking track
 */
export function findNearestWalkingTrack(
  propertyCoords: Coordinates,
  walkingTracks: WalkingTrack[]
): NearestAmenity {
  let nearestTrack = walkingTracks[0];
  let minDistance = Infinity;

  walkingTracks.forEach(track => {
    track.path.forEach(pathPoint => {
      const dist = calculateDistance(propertyCoords, pathPoint);
      if (dist < minDistance) {
        minDistance = dist;
        nearestTrack = track;
      }
    });
  });

  return {
    name: nearestTrack.name,
    distanceM: Math.round(minDistance),
    walkMinutes: calculateWalkTime(minDistance),
    coordinates: nearestTrack.path[0]
  };
}

/**
 * Find crime score for a property location
 */
export function findCrimeScore(propertyCoords: Coordinates, crimeZones: CrimeZone[]): number {
  let crimeScore = 50; // Default medium score
  let minDistance = Infinity;

  crimeZones.forEach(zone => {
    const dist = calculateDistance(propertyCoords, zone.coordinates);
    if (dist < zone.radius && dist < minDistance) {
      minDistance = dist;
      crimeScore = zone.crimeScore;
    }
  });

  return crimeScore;
}

/**
 * Calculate desirability score based on amenity proximity and crime
 * Score: 0-100 (higher is better)
 */
export function calculateDesirabilityScore(property: Property): number {
  const weights = {
    parkProximity: 0.25,
    cycleTrackProximity: 0.15,
    walkingTrackProximity: 0.15,
    busProximity: 0.20,
    crimeSafety: 0.25
  };

  // Normalize distances to scores (0-100)
  // Closer distance = higher score
  const parkScore = Math.max(0, 100 - (property.nearestAmenities.park.distanceM / 20));
  const cycleScore = Math.max(0, 100 - (property.nearestAmenities.cycleTrack.distanceM / 15));
  const walkScore = Math.max(0, 100 - (property.nearestAmenities.walkingTrack.distanceM / 10));
  const busScore = Math.max(0, 100 - (property.nearestAmenities.busStation.distanceM / 8));
  
  // Crime score: invert so lower crime = higher score
  const crimeScore = 100 - property.crimeScore;

  const totalScore = 
    parkScore * weights.parkProximity +
    cycleScore * weights.cycleTrackProximity +
    walkScore * weights.walkingTrackProximity +
    busScore * weights.busProximity +
    crimeScore * weights.crimeSafety;

  return Math.round(Math.min(100, Math.max(0, totalScore)));
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

/**
 * Get desirability rating label
 */
export function getDesirabilityLabel(score: number): {
  label: string;
  color: string;
} {
  if (score >= 80) return { label: 'Excellent', color: 'text-green-600' };
  if (score >= 60) return { label: 'Very Good', color: 'text-blue-600' };
  if (score >= 40) return { label: 'Good', color: 'text-yellow-600' };
  if (score >= 20) return { label: 'Fair', color: 'text-orange-600' };
  return { label: 'Poor', color: 'text-red-600' };
}

/**
 * Get crime rating label
 */
export function getCrimeLabel(score: number): {
  label: string;
  color: string;
} {
  if (score <= 20) return { label: 'Very Low', color: 'text-green-600' };
  if (score <= 40) return { label: 'Low', color: 'text-blue-600' };
  if (score <= 60) return { label: 'Moderate', color: 'text-yellow-600' };
  if (score <= 80) return { label: 'High', color: 'text-orange-600' };
  return { label: 'Very High', color: 'text-red-600' };
}
