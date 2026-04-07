# Dublin Property Portal - Technical Specification

## Project Overview

A GIS-powered property rental portal demonstrating AI-driven property price prediction using alternative data sources. The platform visualizes spatial relationships between properties and amenities (parks, cycle tracks, walking tracks, bus stations) and crime data to calculate location desirability scores.

**Research Hypothesis:** Properties closer to amenities with lower crime rates command higher prices.

---

## Technology Stack

### Frontend Framework
- **React 18.3** with TypeScript
- **Vite 7.3** - Build tool and dev server
- **React Router v6** - Client-side routing

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - 50+ pre-built accessible components
- **Framer Motion** - Animation library
- **Lucide React** - Icon library

### Mapping & GIS
- **Mapbox GL JS** - Interactive map rendering
- **react-map-gl** - React wrapper for Mapbox
- **Turf.js** - Geospatial calculations (distance, proximity)

### State Management
- **Zustand** - Lightweight state management
- **TanStack Query** - Server state management (ready for API integration)

### Development Tools
- **ESLint** - Code linting
- **TypeScript** - Type safety
- **Vitest** - Unit testing (configured)
- **Playwright** - E2E testing (configured)

---

## Project Structure

```
src/
├── components/
│   ├── Map/
│   │   └── PropertyMap.tsx          # Interactive Mapbox map component
│   ├── ui/                           # shadcn/ui components (50+ files)
│   ├── NavLink.tsx
│   ├── Pagination.tsx
│   ├── PropertyCard.tsx              # Enhanced with GIS data
│   ├── SearchBar.tsx
│   └── SiteHeader.tsx
├── data/
│   ├── dublinAmenities.ts            # Parks, cycle tracks, bus stations, crime zones
│   ├── dublinProperties.ts           # 10 properties with GIS calculations
│   └── properties.ts                 # OLD - can be removed
├── hooks/
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts                      # Utility functions
├── pages/
│   ├── Index.tsx                     # Main listing page with map
│   ├── PropertyDetail.tsx            # NEW - Property detail page
│   └── NotFound.tsx
├── store/
│   └── propertyStore.ts              # Zustand global state
├── types/
│   └── property.types.ts             # TypeScript interfaces
├── utils/
│   └── geoCalculations.ts            # GIS utility functions
├── App.tsx                           # Router configuration
├── main.tsx                          # Application entry point
└── index.css                         # Global styles + Tailwind
```

---

## Data Architecture

### Core Data Models

#### Property Interface
```typescript
interface Property {
  id: number;
  slug: string;
  title: string;
  price: number;
  address: string;
  fullAddress: string[];
  coordinates: { lat: number; lng: number };
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
  nearestAmenities: {
    park: NearestAmenity;
    cycleTrack: NearestAmenity;
    walkingTrack: NearestAmenity;
    busStation: NearestBusStation;
  };
  crimeScore: number; // 0-100 (lower is better)
  desirabilityScore: number; // 0-100 (higher is better)
  pricePerSqm: number;
  
  listedDate: string;
  status: 'available' | 'pending' | 'rented';
}
```

#### Amenity Models
- **Park**: name, coordinates, size, facilities
- **CycleTrack**: name, path (LineString), length, surface
- **WalkingTrack**: name, path, length, difficulty
- **BusStation**: name, coordinates, routes, frequency
- **CrimeZone**: area, coordinates, crimeScore, radius, incidents

### Data Sources (Current: Dummy Dublin Data)

**Properties:** 10 properties in Dublin 4 area
- Coordinates: Real Dublin locations
- Amenities: Calculated using Turf.js distance functions
- Crime scores: Simulated based on area

**Amenities:**
- 6 Parks (St. Stephen's Green, Herbert Park, Phoenix Park, etc.)
- 4 Cycle Tracks (Grand Canal, Royal Canal, Dodder, Clontarf)
- 3 Walking Tracks
- 6 Bus Stations with real Dublin Bus routes
- 5 Crime Zones with simulated scores

---

## Key Features Implemented

### 1. Interactive Map (PropertyMap.tsx)

**Features:**
- ✅ Property markers color-coded by desirability score
- ✅ Amenity markers (parks, bus stations)
- ✅ Click property marker → open popup with details
- ✅ Hover/select property → highlight on map
- ✅ Map legend showing color coding
- ✅ Smooth animations and transitions
- ✅ Responsive design

**Map Controls:**
- Pan, zoom, rotate
- Click marker for popup
- Popup shows: image, price, beds/baths/sqm, amenity distances, desirability score

### 2. Property Listing Page (Index.tsx)

**Features:**
- ✅ Grid layout with property cards
- ✅ Sticky map on right side (desktop)
- ✅ Pagination (10 items per page)
- ✅ Sorting options:
  - Price (low/high)
  - Date (old/new)
  - Desirability score (high to low)
  - Best value (desirability per euro)
- ✅ Property count display
- ✅ Hover card → highlight map marker
- ✅ Click card → center map on property

### 3. Property Card (PropertyCard.tsx)

**Enhanced with:**
- ✅ Desirability score badge
- ✅ Amenity distances (park, bus)
- ✅ Hover interaction with map
- ✅ Click to center map
- ✅ Link to detail page

### 4. Property Detail Page (PropertyDetail.tsx)

**Sections:**
- ✅ Image gallery (3 images)
- ✅ Price, beds, baths, sqm
- ✅ Desirability score with progress bar
- ✅ Nearby amenities list with distances and walk times
- ✅ Crime/safety score
- ✅ Description and features
- ✅ Contact/viewing buttons
- ✅ Property metadata (type, price per sqm, listed date)
- ✅ Interactive map centered on property

### 5. GIS Calculations (geoCalculations.ts)

**Functions:**
- ✅ `calculateDistance()` - Haversine distance between coordinates
- ✅ `calculateWalkTime()` - Walking time based on 5 km/h
- ✅ `findNearestPark()` - Find closest park
- ✅ `findNearestBusStation()` - Find closest bus stop
- ✅ `findNearestCycleTrack()` - Find closest point on cycle track
- ✅ `findNearestWalkingTrack()` - Find closest walking track
- ✅ `findCrimeScore()` - Get crime score for location
- ✅ `calculateDesirabilityScore()` - Weighted scoring algorithm

**Desirability Algorithm:**
```
Score = (parkProximity × 0.25) + 
        (cycleTrackProximity × 0.15) + 
        (walkingTrackProximity × 0.15) + 
        (busProximity × 0.20) + 
        (crimeSafety × 0.25)
```

### 6. State Management (propertyStore.ts)

**Global State:**
- Selected property ID
- Hovered property ID
- Filters (ready for implementation)
- Sort option
- Map viewport (lat, lng, zoom)

**Actions:**
- Set selected/hovered property
- Center map on property
- Update filters and sorting

---

## What's Already Implemented ✅

### Core Functionality
- [x] Project setup with all dependencies
- [x] TypeScript type definitions
- [x] 10 Dublin properties with real coordinates
- [x] 20+ amenities (parks, cycle tracks, bus stations)
- [x] GIS calculations (distance, proximity, scoring)
- [x] Interactive Mapbox map with markers
- [x] Property listing page with map sync
- [x] Property detail page
- [x] Hover/click interactions
- [x] Sorting by price, date, desirability
- [x] Pagination
- [x] Responsive design
- [x] Desirability scoring algorithm
- [x] Crime score visualization

### UI/UX
- [x] Modern, elegant design
- [x] Smooth animations (Framer Motion)
- [x] Color-coded markers by score
- [x] Map legend
- [x] Property popups on map
- [x] Amenity distance display
- [x] BER rating badges
- [x] Image galleries

---

## What Needs to Be Implemented 🚧

### Phase 1: Enhanced Filtering (High Priority)

**SearchBar.tsx Enhancement:**
- [ ] Connect filters to property store
- [ ] Filter by price range
- [ ] Filter by beds/baths
- [ ] Filter by property type
- [ ] Filter by max distance to park (slider)
- [ ] Filter by max distance to bus (slider)
- [ ] Filter by crime score threshold
- [ ] Filter by min desirability score
- [ ] Filter by BER rating
- [ ] "Clear filters" button
- [ ] Active filter count badge

**Implementation:**
```typescript
// In Index.tsx
const filteredProperties = useMemo(() => {
  return dublinProperties.filter(property => {
    if (filters.priceMin && property.price < filters.priceMin) return false;
    if (filters.priceMax && property.price > filters.priceMax) return false;
    if (filters.beds && property.beds < filters.beds) return false;
    if (filters.maxDistanceToPark && 
        property.nearestAmenities.park.distanceM > filters.maxDistanceToPark) return false;
    // ... more filters
    return true;
  });
}, [filters]);
```

### Phase 2: Advanced Map Features (Medium Priority)

**Map Enhancements:**
- [ ] Cycle track polylines (blue lines)
- [ ] Walking track polylines (orange lines)
- [ ] Crime heatmap overlay
- [ ] Radius circles around properties (500m, 1km)
- [ ] Cluster markers when zoomed out
- [ ] Custom marker icons
- [ ] Toggle amenity layers on/off
- [ ] Search location on map
- [ ] Draw custom search area

**Crime Heatmap:**
```typescript
<Source
  type="geojson"
  data={{
    type: 'FeatureCollection',
    features: crimeZones.map(zone => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [zone.coordinates.lng, zone.coordinates.lat]
      },
      properties: { crimeScore: zone.crimeScore }
    }))
  }}
>
  <Layer
    type="heatmap"
    paint={{
      'heatmap-weight': ['get', 'crimeScore'],
      'heatmap-intensity': 1,
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0, 'rgba(0,0,255,0)',
        0.5, 'rgba(255,255,0,0.5)',
        1, 'rgba(255,0,0,0.8)'
      ]
    }}
  />
</Source>
```

### Phase 3: Backend Integration (High Priority for Production)

**API Structure:**
```
GET /api/properties
  ?priceMin=3000
  &priceMax=5000
  &beds=2
  &maxDistanceToPark=1000
  &sortBy=desirability-desc
  &page=1
  &limit=10

GET /api/properties/:slug

GET /api/amenities/parks
GET /api/amenities/bus-stations
GET /api/amenities/cycle-tracks
GET /api/amenities/walking-tracks

GET /api/crime-zones
```

**Database Schema (PostgreSQL + PostGIS):**
```sql
CREATE TABLE properties (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(255) UNIQUE,
  title VARCHAR(255),
  price INTEGER,
  address TEXT,
  location GEOGRAPHY(POINT, 4326), -- PostGIS
  beds INTEGER,
  baths INTEGER,
  sqm INTEGER,
  ber_rating VARCHAR(10),
  description TEXT,
  features JSONB,
  images JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_properties_location ON properties USING GIST(location);

CREATE TABLE parks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  location GEOGRAPHY(POINT, 4326),
  size VARCHAR(50),
  facilities JSONB
);

-- Spatial query example:
SELECT 
  p.*,
  ST_Distance(p.location, park.location) as distance_to_park
FROM properties p
CROSS JOIN LATERAL (
  SELECT location 
  FROM parks 
  ORDER BY p.location <-> location 
  LIMIT 1
) park
WHERE ST_DWithin(p.location, ST_MakePoint(-6.2603, 53.3498)::geography, 5000);
```

**React Query Integration:**
```typescript
// hooks/useProperties.ts
export function useProperties(filters: PropertyFilters) {
  return useQuery({
    queryKey: ['properties', filters],
    queryFn: () => fetchProperties(filters),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
}
```

### Phase 4: User Features (Medium Priority)

- [ ] Save favorite properties (localStorage or backend)
- [ ] Compare properties side-by-side
- [ ] Share property link
- [ ] Print property details
- [ ] Email property to friend
- [ ] Schedule viewing form
- [ ] Contact agent form
- [ ] Property alerts (email when new matches)
- [ ] Recently viewed properties

### Phase 5: Analytics & Insights (Low Priority)

- [ ] Price trends chart (Recharts)
- [ ] Desirability score distribution
- [ ] Average price by area
- [ ] Amenity density map
- [ ] Price prediction model visualization
- [ ] Comparative market analysis
- [ ] Neighborhood insights

### Phase 6: Admin Panel (Future)

- [ ] Add/edit/delete properties
- [ ] Manage amenities
- [ ] Update crime data
- [ ] View analytics dashboard
- [ ] User management
- [ ] Content management

---

## Environment Setup

### Required Environment Variables

```bash
# .env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_APP_NAME=Dublin Property Portal
VITE_DEFAULT_MAP_CENTER_LAT=53.3498
VITE_DEFAULT_MAP_CENTER_LNG=-6.2603
VITE_DEFAULT_MAP_ZOOM=12
```

**Get Mapbox Token:**
1. Sign up at https://account.mapbox.com/
2. Create access token
3. Copy to `.env` file

---

## Development Workflow

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```
Access at: http://localhost:5173

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Run Tests
```bash
npm run test
```

### Lint Code
```bash
npm run lint
```

---

## Performance Optimizations

### Implemented
- ✅ Lazy loading images
- ✅ Memoized calculations (useMemo)
- ✅ Efficient state management (Zustand)
- ✅ Optimized re-renders
- ✅ Code splitting by route

### To Implement
- [ ] Virtual scrolling for large lists
- [ ] Image optimization (WebP, lazy load)
- [ ] Service worker for offline support
- [ ] CDN for static assets
- [ ] Debounced search/filter inputs
- [ ] Intersection observer for card animations

---

## Deployment Considerations

### Hosting Options
- **Vercel** (recommended for Vite/React)
- **Netlify**
- **AWS Amplify**
- **GitHub Pages**

### Build Configuration
```bash
# Build command
npm run build

# Output directory
dist/

# Environment variables
Set VITE_MAPBOX_TOKEN in hosting platform
```

### Domain Setup
- Configure custom domain
- Enable HTTPS
- Set up redirects for SPA routing

---

## Testing Strategy

### Unit Tests (Vitest)
- [ ] GIS calculation functions
- [ ] Utility functions
- [ ] Component logic

### Integration Tests
- [ ] Property filtering
- [ ] Sorting functionality
- [ ] Map interactions

### E2E Tests (Playwright)
- [ ] User journey: Browse → Filter → View property
- [ ] Map interaction flow
- [ ] Mobile responsiveness

---

## Accessibility (WCAG 2.1)

### Implemented
- ✅ Semantic HTML
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Color contrast (Tailwind defaults)
- ✅ Alt text for images

### To Implement
- [ ] ARIA labels for interactive elements
- [ ] Screen reader testing
- [ ] Skip navigation links
- [ ] Focus trap in modals
- [ ] Reduced motion support

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari 14+, Chrome Android

---

## Next Steps (Prioritized)

### Immediate (Week 1-2)
1. ✅ Set up project structure
2. ✅ Implement Mapbox integration
3. ✅ Create property detail page
4. ✅ Add GIS calculations
5. 🚧 Implement filtering system
6. 🚧 Add cycle/walking track polylines

### Short-term (Week 3-4)
7. Add crime heatmap
8. Implement property comparison
9. Add favorite properties
10. Create contact forms

### Medium-term (Month 2)
11. Backend API development
12. PostgreSQL + PostGIS setup
13. User authentication
14. Property alerts system

### Long-term (Month 3+)
15. Admin panel
16. Analytics dashboard
17. ML price prediction model
18. Mobile app (React Native)

---

## Resources & Documentation

- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)
- [Turf.js Documentation](https://turfjs.org/)
- [PostGIS Documentation](https://postgis.net/documentation/)
- [React Map GL](https://visgl.github.io/react-map-gl/)
- [Zustand Guide](https://docs.pmnd.rs/zustand/)
- [shadcn/ui Components](https://ui.shadcn.com/)

---

## Contact & Support

For questions or issues, refer to:
- Project README.md
- Context_project.md (research context)
- This technical specification

---

**Last Updated:** April 7, 2026
**Version:** 1.0.0
**Status:** Phase 1 Complete, Phase 2 In Progress
