// Dublin amenities data - Parks, Cycle Tracks, Walking Tracks, Bus Stations

import type { Park, CycleTrack, WalkingTrack, BusStation, CrimeZone } from '@/types/property.types';

// Dublin Parks
export const dublinParks: Park[] = [
  {
    id: 1,
    name: "St. Stephen's Green",
    coordinates: { lat: 53.3376, lng: -6.2597 },
    size: 'large',
    facilities: ['playground', 'cafe', 'gardens', 'pond'],
    area: 'Dublin 2'
  },
  {
    id: 2,
    name: "Merrion Square Park",
    coordinates: { lat: 53.3394, lng: -6.2497 },
    size: 'medium',
    facilities: ['playground', 'gardens', 'sculptures'],
    area: 'Dublin 2'
  },
  {
    id: 3,
    name: "Herbert Park",
    coordinates: { lat: 53.3275, lng: -6.2350 },
    size: 'large',
    facilities: ['playground', 'tennis', 'pond', 'cafe'],
    area: 'Dublin 4'
  },
  {
    id: 4,
    name: "Phoenix Park",
    coordinates: { lat: 53.3558, lng: -6.3298 },
    size: 'large',
    facilities: ['zoo', 'cafe', 'sports', 'wildlife'],
    area: 'Dublin 8'
  },
  {
    id: 5,
    name: "Bushy Park",
    coordinates: { lat: 53.3150, lng: -6.2850 },
    size: 'large',
    facilities: ['playground', 'pond', 'sports'],
    area: 'Dublin 6'
  },
  {
    id: 6,
    name: "Palmerston Park",
    coordinates: { lat: 53.3200, lng: -6.2700 },
    size: 'medium',
    facilities: ['playground', 'sports'],
    area: 'Dublin 6'
  }
];

// Dublin Cycle Tracks
export const dublinCycleTracks: CycleTrack[] = [
  {
    id: 1,
    name: "Grand Canal Greenway",
    path: [
      { lat: 53.3350, lng: -6.2750 },
      { lat: 53.3340, lng: -6.2650 },
      { lat: 53.3330, lng: -6.2550 },
      { lat: 53.3320, lng: -6.2450 },
      { lat: 53.3310, lng: -6.2350 }
    ],
    length: 3.2,
    surface: 'paved'
  },
  {
    id: 2,
    name: "Royal Canal Greenway",
    path: [
      { lat: 53.3650, lng: -6.2800 },
      { lat: 53.3640, lng: -6.2700 },
      { lat: 53.3630, lng: -6.2600 },
      { lat: 53.3620, lng: -6.2500 }
    ],
    length: 2.8,
    surface: 'paved'
  },
  {
    id: 3,
    name: "Dodder Greenway",
    path: [
      { lat: 53.3200, lng: -6.2400 },
      { lat: 53.3180, lng: -6.2500 },
      { lat: 53.3160, lng: -6.2600 },
      { lat: 53.3140, lng: -6.2700 }
    ],
    length: 4.5,
    surface: 'paved'
  },
  {
    id: 4,
    name: "Clontarf Coastal Route",
    path: [
      { lat: 53.3700, lng: -6.2200 },
      { lat: 53.3680, lng: -6.2100 },
      { lat: 53.3660, lng: -6.2000 }
    ],
    length: 2.1,
    surface: 'paved'
  }
];

// Dublin Walking Tracks
export const dublinWalkingTracks: WalkingTrack[] = [
  {
    id: 1,
    name: "Grand Canal Walk",
    path: [
      { lat: 53.3350, lng: -6.2750 },
      { lat: 53.3340, lng: -6.2650 },
      { lat: 53.3330, lng: -6.2550 }
    ],
    length: 2.5,
    difficulty: 'easy'
  },
  {
    id: 2,
    name: "Sandymount Strand Walk",
    path: [
      { lat: 53.3300, lng: -6.2100 },
      { lat: 53.3280, lng: -6.2000 },
      { lat: 53.3260, lng: -6.1900 }
    ],
    length: 3.0,
    difficulty: 'easy'
  },
  {
    id: 3,
    name: "Phoenix Park Loop",
    path: [
      { lat: 53.3558, lng: -6.3298 },
      { lat: 53.3600, lng: -6.3350 },
      { lat: 53.3580, lng: -6.3400 }
    ],
    length: 5.5,
    difficulty: 'easy'
  }
];

// Dublin Bus Stations
export const dublinBusStations: BusStation[] = [
  {
    id: 1,
    name: "Ballsbridge Bus Stop",
    coordinates: { lat: 53.3275, lng: -6.2297 },
    routes: ['4', '7', '18', '45'],
    frequency: 'high'
  },
  {
    id: 2,
    name: "Rathmines Bus Stop",
    coordinates: { lat: 53.3200, lng: -6.2700 },
    routes: ['14', '15', '140'],
    frequency: 'high'
  },
  {
    id: 3,
    name: "Portobello Bus Stop",
    coordinates: { lat: 53.3350, lng: -6.2750 },
    routes: ['16', '49', '54A'],
    frequency: 'medium'
  },
  {
    id: 4,
    name: "Merrion Road Bus Stop",
    coordinates: { lat: 53.3300, lng: -6.2350 },
    routes: ['4', '7', '8'],
    frequency: 'high'
  },
  {
    id: 5,
    name: "Haddington Road Bus Stop",
    coordinates: { lat: 53.3320, lng: -6.2420 },
    routes: ['5', '7A', '45'],
    frequency: 'medium'
  },
  {
    id: 6,
    name: "Donnybrook Bus Stop",
    coordinates: { lat: 53.3180, lng: -6.2380 },
    routes: ['10', '46A', '145'],
    frequency: 'high'
  }
];

// Dublin Crime Zones (simulated data for demonstration)
export const dublinCrimeZones: CrimeZone[] = [
  {
    id: 1,
    area: 'Dublin 4 - Ballsbridge',
    coordinates: { lat: 53.3275, lng: -6.2297 },
    crimeScore: 15, // Low crime
    radius: 800,
    incidents: 45
  },
  {
    id: 2,
    area: 'Dublin 6 - Rathmines',
    coordinates: { lat: 53.3200, lng: -6.2700 },
    crimeScore: 25,
    radius: 1000,
    incidents: 78
  },
  {
    id: 3,
    area: 'Dublin 8 - Portobello',
    coordinates: { lat: 53.3350, lng: -6.2750 },
    crimeScore: 35,
    radius: 900,
    incidents: 112
  },
  {
    id: 4,
    area: 'Dublin 2 - City Centre',
    coordinates: { lat: 53.3450, lng: -6.2600 },
    crimeScore: 45, // Higher crime (city centre)
    radius: 1200,
    incidents: 156
  },
  {
    id: 5,
    area: 'Dublin 4 - Donnybrook',
    coordinates: { lat: 53.3180, lng: -6.2380 },
    crimeScore: 18,
    radius: 700,
    incidents: 52
  }
];
