# Map Implementations

This folder contains separate implementations for MapLibre GL JS and Mapbox GL JS, with a shared interface.

## Structure

```
maps/
├── maplibre/
│   └── MapLibreMap.tsx       # Active MapLibre implementation
├── mapbox/
│   └── MapboxMap.tsx         # Dormant Mapbox implementation
└── shared/
    └── MapWrapper.tsx        # Wrapper component that switches between engines
```

## Current Configuration

**Active Engine**: MapLibre GL JS (default)
**Dormant Engine**: Mapbox GL JS (requires token)

## MapLibre GL JS (Active)

### Features
- ✅ No API token required
- ✅ Open-source map rendering
- ✅ Free for all use cases
- ✅ Compatible with Mapbox styles
- ✅ Active community support

### Base Map Style
Currently using CartoDB Positron style:
```
https://basemaps.cartocdn.com/gl/positron-gl-style/style.json
```

### Alternative Free Styles
- **CartoDB Dark**: `https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json`
- **CartoDB Voyager**: `https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json`
- **OpenStreetMap**: Custom style required
- **Maptiler**: Requires free API key

### Dependencies
```json
{
  "maplibre-gl": "^4.x",
  "react-map-gl": "^7.x"
}
```

### Usage
```tsx
import MapWrapper from '@/components/maps/shared/MapWrapper';

<MapWrapper
  engine="maplibre"
  properties={properties}
  viewport={viewport}
  onPropertyClick={handleClick}
/>
```

## Mapbox GL JS (Dormant)

### Features
- ⚠️ Requires API token
- ⚠️ Free tier: 50,000 map loads/month
- ✅ Premium map styles
- ✅ Advanced features (3D, satellite)
- ✅ Official support

### Setup (if needed)
1. Get token from https://account.mapbox.com/
2. Add to `.env`:
   ```
   VITE_MAPBOX_TOKEN=pk.your_token_here
   ```
3. Switch engine in MapWrapper:
   ```tsx
   <MapWrapper engine="mapbox" ... />
   ```

### Dependencies
```json
{
  "mapbox-gl": "^3.x",
  "react-map-gl": "^7.x"
}
```

## Shared Interface

Both implementations follow the same `BaseMapProps` interface:

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

## Switching Between Engines

### Option 1: Via MapWrapper (Recommended)
```tsx
// Use MapLibre (default)
<MapWrapper engine="maplibre" {...props} />

// Use Mapbox
<MapWrapper engine="mapbox" {...props} />
```

### Option 2: Direct Import
```tsx
// MapLibre
import MapLibreMap from '@/components/maps/maplibre/MapLibreMap';
<MapLibreMap {...props} />

// Mapbox
import MapboxMap from '@/components/maps/mapbox/MapboxMap';
<MapboxMap {...props} />
```

## Features Implemented

### Both Engines
- ✅ Property markers with color coding
- ✅ Amenity markers (parks, bus stations)
- ✅ Interactive popups
- ✅ Click/hover interactions
- ✅ Viewport synchronization
- ✅ Fly-to animations
- ✅ Map legend
- ✅ Responsive design

### MapLibre Specific
- ✅ Navigation controls
- ✅ Fullscreen control
- ✅ Free base map styles

### Mapbox Specific
- ✅ Premium map styles
- ✅ Satellite imagery (optional)
- ✅ 3D buildings (optional)

## Performance

### MapLibre
- Bundle size: ~500KB (gzipped)
- No external API calls for tiles
- Fast initial load

### Mapbox
- Bundle size: ~1.7MB (gzipped)
- API calls for tiles (counted against quota)
- Premium CDN delivery

## Migration Guide

### From Mapbox to MapLibre
1. No code changes needed (using MapWrapper)
2. Change `engine="mapbox"` to `engine="maplibre"`
3. Remove Mapbox token from `.env`

### From MapLibre to Mapbox
1. Get Mapbox token
2. Add token to `.env`
3. Change `engine="maplibre"` to `engine="mapbox"`

## Customization

### Change Map Style (MapLibre)
Edit `src/components/maps/maplibre/MapLibreMap.tsx`:
```tsx
mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
```

### Change Map Style (Mapbox)
Edit `src/components/maps/mapbox/MapboxMap.tsx`:
```tsx
mapStyle="mapbox://styles/mapbox/satellite-v9"
```

### Add Custom Layers
Both engines support GeoJSON layers:
```tsx
<Source type="geojson" data={geojsonData}>
  <Layer {...layerStyle} />
</Source>
```

## Troubleshooting

### MapLibre Issues

**Map not loading**
- Check console for errors
- Verify base map style URL is accessible
- Check network tab for failed requests

**Markers not appearing**
- Verify property coordinates are valid
- Check if properties array is populated
- Inspect React DevTools for component state

### Mapbox Issues

**Map not loading**
- Verify Mapbox token in `.env`
- Check token permissions on Mapbox dashboard
- Ensure token starts with `pk.`

**Quota exceeded**
- Check usage on Mapbox dashboard
- Consider switching to MapLibre
- Implement caching strategies

## Best Practices

1. **Use MapLibre by default** - No token required, free forever
2. **Keep Mapbox as fallback** - For premium features if needed
3. **Lazy load maps** - Use React.lazy() for better performance
4. **Cache viewport state** - Reduce unnecessary re-renders
5. **Optimize marker rendering** - Use clustering for large datasets

## Future Enhancements

### Planned Features
- [ ] Marker clustering
- [ ] Heatmap layers
- [ ] Custom map styles
- [ ] Offline map support
- [ ] 3D building extrusion
- [ ] Route visualization
- [ ] Draw tools

### Potential Improvements
- [ ] WebGL optimization
- [ ] Progressive loading
- [ ] Service worker caching
- [ ] Custom tile server
- [ ] Vector tile generation

## Resources

### MapLibre
- [MapLibre GL JS Docs](https://maplibre.org/maplibre-gl-js/docs/)
- [MapLibre Examples](https://maplibre.org/maplibre-gl-js/docs/examples/)
- [React Map GL Docs](https://visgl.github.io/react-map-gl/)

### Mapbox
- [Mapbox GL JS Docs](https://docs.mapbox.com/mapbox-gl-js/)
- [Mapbox Examples](https://docs.mapbox.com/mapbox-gl-js/example/)
- [Mapbox Pricing](https://www.mapbox.com/pricing)

### Free Map Styles
- [CartoDB Basemaps](https://github.com/CartoDB/basemap-styles)
- [Maptiler](https://www.maptiler.com/) (free tier)
- [OpenMapTiles](https://openmaptiles.org/)

---

**Current Status**: MapLibre GL JS is active and production-ready. Mapbox GL JS is scaffolded and ready to activate if needed.
