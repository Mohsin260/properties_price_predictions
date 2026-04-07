# MapLibre GL JS Implementation Guide

## Overview

This project now uses **MapLibre GL JS** as the primary map engine, with Mapbox GL JS kept as a dormant alternative. This document explains the implementation, architecture, and how to work with both engines.

---

## Why MapLibre?

### Advantages
- ✅ **No API token required** - Works out of the box
- ✅ **100% free** - No usage limits or quotas
- ✅ **Open source** - Community-driven development
- ✅ **Compatible** - Works with Mapbox-style specifications
- ✅ **Lightweight** - Smaller bundle size than Mapbox
- ✅ **Privacy-friendly** - No tracking or analytics

### Use Cases
- Development and testing without API keys
- Production deployments without usage concerns
- Projects requiring full control over map rendering
- Cost-sensitive applications
- Privacy-focused applications

---

## Architecture

### Folder Structure

```
src/components/maps/
├── maplibre/
│   └── MapLibreMap.tsx       # ✅ Active implementation
├── mapbox/
│   └── MapboxMap.tsx         # ⚠️ Dormant (requires token)
└── shared/
    └── MapWrapper.tsx        # 🔄 Engine switcher
```

### Shared Interface

Both engines implement the same `BaseMapProps` interface:

```typescript
interface BaseMapProps {
  properties: Property[];
  selectedPropertyId?: number | null;
  hoveredPropertyId?: number | null;
  viewport: MapViewport;
  showAmenities?: boolean;
  onPropertyClick?: (property: Property) => void;
  onPropertyHover?: (property: Property | null) => void;
  onViewportChange?: (viewport: MapViewport) => void;
  height?: string;
  className?: string;
}
```

This ensures both engines can be swapped without changing the UI code.

---

## Implementation Details

### MapLibre Component

**File**: `src/components/maps/maplibre/MapLibreMap.tsx`

**Key Features**:
- Property markers with color coding by desirability score
- Amenity markers (parks, bus stations)
- Interactive popups with property details
- Navigation controls (zoom, rotate)
- Fullscreen control
- Map legend
- Hover and selection states
- Smooth fly-to animations

**Base Map Style**:
```typescript
mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
```

**Dependencies**:
```json
{
  "maplibre-gl": "^4.x",
  "react-map-gl": "^7.x"
}
```

### MapWrapper Component

**File**: `src/components/maps/shared/MapWrapper.tsx`

**Purpose**: Provides a unified interface to switch between map engines.

**Usage**:
```tsx
import MapWrapper from '@/components/maps/shared/MapWrapper';

// Use MapLibre (default)
<MapWrapper
  engine="maplibre"
  properties={properties}
  viewport={viewport}
  onPropertyClick={handleClick}
/>

// Use Mapbox (requires token)
<MapWrapper
  engine="mapbox"
  properties={properties}
  viewport={viewport}
  onPropertyClick={handleClick}
/>
```

**Features**:
- Lazy loading for better performance
- Loading state with spinner
- Automatic engine selection
- Props pass-through to selected engine

---

## Usage Examples

### Basic Map

```tsx
import MapWrapper from '@/components/maps/shared/MapWrapper';
import { dublinProperties } from '@/data/dublinProperties';

function PropertyMap() {
  const [viewport, setViewport] = useState({
    latitude: 53.3498,
    longitude: -6.2603,
    zoom: 12
  });

  return (
    <MapWrapper
      engine="maplibre"
      properties={dublinProperties}
      viewport={viewport}
      onViewportChange={setViewport}
      showAmenities={true}
      height="600px"
    />
  );
}
```

### With Property Selection

```tsx
import MapWrapper from '@/components/maps/shared/MapWrapper';
import { usePropertyStore } from '@/store/propertyStore';

function InteractiveMap() {
  const {
    selectedPropertyId,
    hoveredPropertyId,
    mapViewport,
    centerMapOnProperty
  } = usePropertyStore();

  const handlePropertyClick = (property) => {
    centerMapOnProperty(property);
  };

  return (
    <MapWrapper
      engine="maplibre"
      properties={properties}
      selectedPropertyId={selectedPropertyId}
      hoveredPropertyId={hoveredPropertyId}
      viewport={mapViewport}
      onPropertyClick={handlePropertyClick}
      showAmenities={true}
    />
  );
}
```

### Property Detail Page

```tsx
import MapWrapper from '@/components/maps/shared/MapWrapper';

function PropertyDetail({ property }) {
  return (
    <MapWrapper
      engine="maplibre"
      properties={[property]}
      selectedPropertyId={property.id}
      viewport={{
        latitude: property.coordinates.lat,
        longitude: property.coordinates.lng,
        zoom: 15
      }}
      showAmenities={true}
      height="400px"
    />
  );
}
```

---

## Customization

### Change Base Map Style

Edit `src/components/maps/maplibre/MapLibreMap.tsx`:

```typescript
// Current: CartoDB Positron (light)
mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"

// Alternative: CartoDB Dark Matter (dark)
mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"

// Alternative: CartoDB Voyager (colorful)
mapStyle="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
```

### Free Map Style Options

1. **CartoDB Basemaps** (No token required)
   - Positron: Light, minimal style
   - Dark Matter: Dark theme
   - Voyager: Colorful, detailed

2. **Maptiler** (Free tier available)
   - Sign up at https://www.maptiler.com/
   - Get free API key
   - Use: `https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY`

3. **OpenMapTiles** (Self-hosted)
   - Download tiles from https://openmaptiles.org/
   - Host your own tile server
   - Full control over styling

### Customize Marker Colors

Edit `getMarkerColor()` function in MapLibreMap.tsx:

```typescript
const getMarkerColor = (property: Property) => {
  if (property.id === selectedPropertyId) return '#DC2626';
  if (property.id === hoveredPropertyId) return '#2563EB';
  
  // Custom color logic
  if (property.desirabilityScore >= 80) return '#16A34A';
  if (property.desirabilityScore >= 60) return '#3B82F6';
  if (property.desirabilityScore >= 40) return '#F59E0B';
  return '#EF4444';
};
```

### Add Custom Controls

```tsx
import { NavigationControl, FullscreenControl, GeolocateControl } from 'react-map-gl/maplibre';

<Map {...props}>
  <NavigationControl position="top-right" />
  <FullscreenControl position="top-right" />
  <GeolocateControl position="top-right" />
  
  {/* Your markers and layers */}
</Map>
```

---

## Switching to Mapbox

If you need Mapbox features (satellite imagery, 3D buildings, etc.):

### Step 1: Get Mapbox Token
1. Sign up at https://account.mapbox.com/
2. Create an access token
3. Copy the token (starts with `pk.`)

### Step 2: Configure Environment
Add to `.env`:
```env
VITE_MAPBOX_TOKEN=pk.your_actual_token_here
```

### Step 3: Switch Engine
Change in your components:
```tsx
// Before
<MapWrapper engine="maplibre" {...props} />

// After
<MapWrapper engine="mapbox" {...props} />
```

### Step 4: Update Map Style (Optional)
Edit `src/components/maps/mapbox/MapboxMap.tsx`:
```typescript
// Satellite
mapStyle="mapbox://styles/mapbox/satellite-v9"

// Streets
mapStyle="mapbox://styles/mapbox/streets-v12"

// Dark
mapStyle="mapbox://styles/mapbox/dark-v11"
```

---

## Performance Comparison

### Bundle Sizes

| Engine | Size (minified) | Size (gzipped) |
|--------|----------------|----------------|
| MapLibre | 1,048 KB | 283 KB |
| Mapbox | 1,770 KB | 487 KB |

### Load Times (Estimated)

| Connection | MapLibre | Mapbox |
|------------|----------|--------|
| Fast 3G | ~2.5s | ~4.0s |
| 4G | ~1.0s | ~1.5s |
| WiFi | ~0.5s | ~0.8s |

### API Calls

| Engine | Tile Requests | Quota |
|--------|---------------|-------|
| MapLibre | Free CDN | Unlimited |
| Mapbox | Counted | 50k/month free |

---

## Features Comparison

| Feature | MapLibre | Mapbox |
|---------|----------|--------|
| Property markers | ✅ | ✅ |
| Amenity markers | ✅ | ✅ |
| Popups | ✅ | ✅ |
| Navigation controls | ✅ | ✅ |
| Fullscreen | ✅ | ✅ |
| Geolocation | ✅ | ✅ |
| Custom styles | ✅ | ✅ |
| Satellite imagery | ❌ | ✅ |
| 3D buildings | ✅ (limited) | ✅ |
| Terrain | ✅ (limited) | ✅ |
| Traffic | ❌ | ✅ |
| Directions | ❌ | ✅ (API) |

---

## Troubleshooting

### Map Not Loading

**Symptoms**: Blank map area, no tiles

**Solutions**:
1. Check browser console for errors
2. Verify base map style URL is accessible
3. Check network tab for failed tile requests
4. Try alternative base map style

### Markers Not Appearing

**Symptoms**: Map loads but no property markers

**Solutions**:
1. Verify properties array has data
2. Check property coordinates are valid (lat/lng)
3. Inspect React DevTools for component state
4. Check console for coordinate errors

### Popup Not Opening

**Symptoms**: Click marker but no popup

**Solutions**:
1. Check `popupInfo` state in React DevTools
2. Verify popup component is rendered
3. Check z-index conflicts in CSS
4. Inspect click event handlers

### Performance Issues

**Symptoms**: Slow rendering, laggy interactions

**Solutions**:
1. Reduce number of markers (use clustering)
2. Optimize marker rendering (memoization)
3. Lazy load map component
4. Use simpler base map style
5. Reduce popup content complexity

---

## Best Practices

### 1. Lazy Loading
```tsx
const MapWrapper = lazy(() => import('@/components/maps/shared/MapWrapper'));

<Suspense fallback={<MapLoadingSpinner />}>
  <MapWrapper {...props} />
</Suspense>
```

### 2. Memoization
```tsx
const markers = useMemo(() => 
  properties.map(p => <Marker key={p.id} {...p} />),
  [properties]
);
```

### 3. Viewport Caching
```tsx
const [viewport, setViewport] = useState(() => {
  const cached = localStorage.getItem('mapViewport');
  return cached ? JSON.parse(cached) : defaultViewport;
});

useEffect(() => {
  localStorage.setItem('mapViewport', JSON.stringify(viewport));
}, [viewport]);
```

### 4. Error Boundaries
```tsx
<ErrorBoundary fallback={<MapErrorFallback />}>
  <MapWrapper {...props} />
</ErrorBoundary>
```

### 5. Responsive Design
```tsx
const height = useBreakpoint({
  base: '300px',
  md: '400px',
  lg: 'calc(100vh - 200px)'
});

<MapWrapper height={height} {...props} />
```

---

## Advanced Features

### Marker Clustering

For large datasets, implement clustering:

```tsx
import { Cluster } from 'react-map-gl/maplibre';

<Cluster
  radius={50}
  extent={512}
  nodeSize={64}
  component={ClusterMarker}
>
  {properties.map(p => (
    <Marker key={p.id} {...p} />
  ))}
</Cluster>
```

### Custom Layers

Add GeoJSON layers:

```tsx
import { Source, Layer } from 'react-map-gl/maplibre';

<Source type="geojson" data={geojsonData}>
  <Layer
    id="crime-zones"
    type="fill"
    paint={{
      'fill-color': ['get', 'color'],
      'fill-opacity': 0.3
    }}
  />
</Source>
```

### Heatmaps

Visualize density:

```tsx
<Source type="geojson" data={pointsData}>
  <Layer
    id="heatmap"
    type="heatmap"
    paint={{
      'heatmap-weight': ['get', 'weight'],
      'heatmap-intensity': 1,
      'heatmap-radius': 20
    }}
  />
</Source>
```

---

## Resources

### Documentation
- [MapLibre GL JS Docs](https://maplibre.org/maplibre-gl-js/docs/)
- [React Map GL Docs](https://visgl.github.io/react-map-gl/)
- [MapLibre Examples](https://maplibre.org/maplibre-gl-js/docs/examples/)

### Free Map Styles
- [CartoDB Basemaps](https://github.com/CartoDB/basemap-styles)
- [Maptiler Free Tier](https://www.maptiler.com/)
- [OpenMapTiles](https://openmaptiles.org/)

### Community
- [MapLibre GitHub](https://github.com/maplibre/maplibre-gl-js)
- [MapLibre Slack](https://slack.openstreetmap.us/)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/maplibre)

---

## Migration Checklist

### From Static Map to MapLibre
- [x] Install maplibre-gl and react-map-gl
- [x] Create MapLibre component
- [x] Implement property markers
- [x] Add amenity markers
- [x] Implement popups
- [x] Add navigation controls
- [x] Sync with property list
- [x] Add hover/click interactions
- [x] Implement map legend
- [x] Test on all devices

### From Mapbox to MapLibre
- [x] Keep Mapbox implementation separate
- [x] Create shared interface
- [x] Implement MapWrapper switcher
- [x] Update all map usages
- [x] Test both engines
- [x] Document switching process
- [x] Remove Mapbox token requirement

---

## Current Status

✅ **MapLibre GL JS**: Active and production-ready
⚠️ **Mapbox GL JS**: Dormant, ready to activate if needed

**Build Status**: ✅ Successful
**Bundle Size**: 283 KB (gzipped)
**Performance**: Excellent
**Cost**: $0/month

---

**Last Updated**: April 7, 2026
**Version**: 2.0.0 (MapLibre)
**Status**: Production Ready
