// Enhanced Dublin properties with GIS data

import type { Property } from '@/types/property.types';
import { 
  dublinParks, 
  dublinBusStations, 
  dublinCycleTracks, 
  dublinWalkingTracks,
  dublinCrimeZones 
} from './dublinAmenities';
import {
  findNearestPark,
  findNearestBusStation,
  findNearestCycleTrack,
  findNearestWalkingTrack,
  findCrimeScore,
  calculateDesirabilityScore
} from '@/utils/geoCalculations';

// Base property data with coordinates
const baseProperties = [
  {
    id: 1,
    slug: 'apartment-7-percy-place-dublin-4',
    title: 'Apartment 7, 55 Percy Place',
    price: 4627,
    address: '55 Percy Place, Dublin 4',
    fullAddress: ['55 Percy Place', 'Dublin 4', 'D04 W6R3'],
    coordinates: { lat: 53.3310, lng: -6.2380 },
    beds: 2,
    baths: 2,
    sqm: 77,
    berRating: 'B1',
    berColor: 'green' as const,
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
    ],
    description: 'Stunning 2-bedroom apartment in the heart of Dublin 4. Modern finishes throughout with excellent natural light. Walking distance to Grand Canal and city centre.',
    features: ['Parking', 'Balcony', 'Modern Kitchen', 'Storage', 'Double Glazing'],
    type: 'Apartment',
    listedDate: '2026-03-15',
    status: 'available' as const
  },
  {
    id: 2,
    slug: 'apartment-27-merrion-road-dublin-4',
    title: 'Apartment 27, 143 Merrion Road',
    price: 4600,
    address: '143 Merrion Road, Dublin 4',
    fullAddress: ['143 Merrion Road', 'Herbert Avenue', 'Dublin 4', 'D04 E8R9'],
    coordinates: { lat: 53.3290, lng: -6.2340 },
    beds: 2,
    baths: 2,
    sqm: 81,
    berRating: 'A2',
    berColor: 'green' as const,
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop'
    ],
    description: 'Spacious A-rated apartment with excellent energy efficiency. Close to Herbert Park and excellent transport links.',
    features: ['Parking', 'Gym', 'Concierge', 'Balcony', 'Storage'],
    type: 'Apartment',
    listedDate: '2026-03-20',
    status: 'available' as const
  },
  {
    id: 3,
    slug: 'apartment-16-merrion-road-dublin-4',
    title: 'Apartment 16, 143 Merrion Road',
    price: 3250,
    address: '143 Merrion Road, Dublin 4',
    fullAddress: ['143 Merrion Road', 'Herbert Avenue', 'Dublin 4', 'D04 P4V6'],
    coordinates: { lat: 53.3288, lng: -6.2345 },
    beds: 1,
    baths: 1,
    sqm: 52,
    berRating: 'A2',
    berColor: 'green' as const,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&h=600&fit=crop'
    ],
    description: 'Compact one-bedroom apartment perfect for professionals. Modern development with excellent amenities.',
    features: ['Parking', 'Gym', 'Concierge'],
    type: 'Apartment',
    listedDate: '2026-03-18',
    status: 'available' as const
  },
  {
    id: 4,
    slug: 'apartment-6-merrion-road-dublin-4',
    title: 'Apartment 6, 143 Merrion Road',
    price: 3250,
    address: '143 Merrion Road, Dublin 4',
    fullAddress: ['143 Merrion Road', 'Herbert Avenue', 'Dublin 4', 'D04 R9K4'],
    coordinates: { lat: 53.3292, lng: -6.2338 },
    beds: 1,
    baths: 1,
    sqm: 53,
    berRating: 'A2',
    berColor: 'green' as const,
    images: [
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&h=600&fit=crop'
    ],
    description: 'Bright one-bedroom apartment with south-facing aspect. Excellent location near Sandymount.',
    features: ['Parking', 'Balcony', 'Storage'],
    type: 'Apartment',
    listedDate: '2026-03-22',
    status: 'available' as const
  },
  {
    id: 5,
    slug: 'the-templeton-lansdowne-place-dublin-4',
    title: 'The Templeton, Lansdowne Place',
    price: 4500,
    address: 'Lansdowne Place, Ballsbridge, Dublin 4',
    fullAddress: ['Lansdowne Place', 'Ballsbridge', 'Dublin 4', 'D04 F5K8'],
    coordinates: { lat: 53.3265, lng: -6.2310 },
    beds: 1,
    baths: 1,
    sqm: 66,
    berRating: 'A2',
    berColor: 'green' as const,
    images: [
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop'
    ],
    description: 'Premium one-bedroom apartment in prestigious Ballsbridge location. High-spec finishes throughout.',
    features: ['Parking', 'Gym', 'Concierge', 'Balcony', 'Storage', 'Security'],
    type: 'Apartment',
    listedDate: '2026-03-25',
    status: 'available' as const
  },
  {
    id: 6,
    slug: '75-shrewsbury-dublin-4',
    title: '75 Shrewsbury, Dublin 4',
    price: 3100,
    address: '75 Shrewsbury, Dublin 4',
    fullAddress: ['75 Shrewsbury', 'Dublin 4', 'D04 KK55'],
    coordinates: { lat: 53.3320, lng: -6.2450 },
    beds: 2,
    baths: 1,
    sqm: 61,
    berRating: 'C2',
    berColor: 'yellow' as const,
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&h=600&fit=crop'
    ],
    description: 'Charming two-bedroom apartment in quiet residential area. Close to city centre and amenities.',
    features: ['Parking', 'Garden Access'],
    type: 'Apartment',
    listedDate: '2026-03-10',
    status: 'available' as const
  },
  {
    id: 7,
    slug: 'hadleigh-court-haddington-road-dublin-4',
    title: 'Hadleigh Court, Haddington Road',
    price: 4000,
    address: 'Haddington Road, Dublin 4',
    fullAddress: ['Hadleigh Court', 'Haddington Road', 'Dublin 4', 'D04 WY49'],
    coordinates: { lat: 53.3315, lng: -6.2410 },
    beds: 2,
    baths: 2,
    sqm: 70,
    berRating: 'A3',
    berColor: 'green' as const,
    images: [
      'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&h=600&fit=crop'
    ],
    description: 'Modern two-bedroom apartment with excellent transport links. Perfect for city living.',
    features: ['Parking', 'Balcony', 'Storage', 'Lift Access'],
    type: 'Apartment',
    listedDate: '2026-03-28',
    status: 'available' as const
  },
  {
    id: 8,
    slug: 'wellington-lane-ballsbridge-dublin-4',
    title: 'Wellington Lane, Ballsbridge',
    price: 11000,
    address: 'Wellington Lane, Ballsbridge, Dublin 4',
    fullAddress: ['Wellington Lane', 'Ballsbridge', 'Dublin 4', 'D04 Y583'],
    coordinates: { lat: 53.3270, lng: -6.2320 },
    beds: 4,
    baths: 3,
    sqm: 313,
    berRating: 'B2',
    berColor: 'green' as const,
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
    ],
    description: 'Luxurious four-bedroom detached house in prime Ballsbridge location. Spacious gardens and premium finishes.',
    features: ['Parking', 'Garden', 'Garage', 'Alarm', 'Double Glazing', 'Fireplace'],
    type: 'Detached House',
    listedDate: '2026-04-01',
    status: 'available' as const
  },
  {
    id: 9,
    slug: 'ballsbridge-avenue-dublin-4',
    title: 'Ballsbridge Avenue, Dublin 4',
    price: 3872,
    address: 'Ballsbridge Avenue, Dublin 4',
    fullAddress: ['Ballsbridge Avenue', 'Ballsbridge', 'Dublin 4', 'D04 V2Y3'],
    coordinates: { lat: 53.3280, lng: -6.2290 },
    beds: 3,
    baths: 2,
    sqm: 80,
    berRating: 'D1',
    berColor: 'orange' as const,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=600&fit=crop'
    ],
    description: 'Three-bedroom end terrace house with character. Excellent location near Herbert Park.',
    features: ['Garden', 'Parking', 'Fireplace'],
    type: 'End Terrace House',
    listedDate: '2026-03-12',
    status: 'available' as const
  },
  {
    id: 10,
    slug: 'apt-25-the-gardens-elmpark-green-dublin-4',
    title: 'Apt 25, The Gardens, Elmpark Green',
    price: 3300,
    address: 'Elmpark Green, Dublin 4',
    fullAddress: ['Apt 25, The Gardens', 'Elmpark Green', 'Dublin 4', 'D04 F2H0'],
    coordinates: { lat: 53.3195, lng: -6.2365 },
    beds: 2,
    baths: 2,
    sqm: 84,
    berRating: 'A2',
    berColor: 'green' as const,
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
    ],
    description: 'Spacious two-bedroom apartment in quiet development. Close to UCD and Donnybrook.',
    features: ['Parking', 'Balcony', 'Storage', 'Gym'],
    type: 'Apartment',
    listedDate: '2026-03-30',
    status: 'available' as const
  }
];

// Enhance properties with GIS data
export const dublinProperties: Property[] = baseProperties.map(prop => {
  const nearestPark = findNearestPark(prop.coordinates, dublinParks);
  const nearestBus = findNearestBusStation(prop.coordinates, dublinBusStations);
  const nearestCycle = findNearestCycleTrack(prop.coordinates, dublinCycleTracks);
  const nearestWalk = findNearestWalkingTrack(prop.coordinates, dublinWalkingTracks);
  const crimeScore = findCrimeScore(prop.coordinates, dublinCrimeZones);
  
  const enhancedProp: Property = {
    ...prop,
    nearestAmenities: {
      park: nearestPark,
      cycleTrack: nearestCycle,
      walkingTrack: nearestWalk,
      busStation: nearestBus
    },
    crimeScore,
    desirabilityScore: 0, // Will be calculated next
    pricePerSqm: Math.round(prop.price / prop.sqm)
  };
  
  // Calculate desirability score
  enhancedProp.desirabilityScore = calculateDesirabilityScore(enhancedProp);
  
  return enhancedProp;
});

// Export individual property for detail pages
export function getPropertyBySlug(slug: string): Property | undefined {
  return dublinProperties.find(p => p.slug === slug);
}

export function getPropertyById(id: number): Property | undefined {
  return dublinProperties.find(p => p.id === id);
}
