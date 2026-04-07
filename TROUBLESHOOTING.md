# Troubleshooting Guide

## Common Issues and Solutions

### Issue: "hoveredPropertyId is not defined"

**Error Message:**
```
Uncaught ReferenceError: hoveredPropertyId is not defined
```

**Cause:** Missing destructuring from the Zustand store.

**Solution:** Ensure all required properties are destructured from `usePropertyStore()`:

```typescript
const { 
  sortBy, 
  setSortBy, 
  selectedPropertyId, 
  hoveredPropertyId,      // ✅ Must be included
  mapViewport, 
  setHoveredProperty, 
  centerMapOnProperty 
} = usePropertyStore();
```

**Status:** ✅ Fixed in latest version

---

### Issue: Map Not Loading

**Symptoms:** Blank area where map should be, no tiles visible.

**Solutions:**

1. **Check Console for Errors**
   - Open browser DevTools (F12)
   - Look for error messages in Console tab
   - Check Network tab for failed requests

2. **Verify MapLibre Style URL**
   ```typescript
   // Should be accessible
   mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
   ```

3. **Try Alternative Style**
   ```typescript
   // Dark theme
   mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
   ```

4. **Check Network Connection**
   - Ensure internet connection is active
   - Check if CDN is accessible
   - Try different network if behind firewall

---

### Issue: Markers Not Appearing

**Symptoms:** Map loads but no property markers visible.

**Solutions:**

1. **Verify Properties Data**
   ```typescript
   console.log('Properties:', properties);
   // Should show array with coordinates
   ```

2. **Check Coordinates Format**
   ```typescript
   // Correct format
   coordinates: { lat: 53.3498, lng: -6.2603 }
   
   // Wrong format (will fail)
   coordinates: { latitude: 53.3498, longitude: -6.2603 }
   ```

3. **Inspect Component State**
   - Open React DevTools
   - Find MapLibreMap component
   - Check props.properties array

4. **Verify Viewport**
   ```typescript
   // Ensure viewport is centered on Dublin
   viewport={{
     latitude: 53.3498,
     longitude: -6.2603,
     zoom: 12
   }}
   ```

---

### Issue: Popup Not Opening

**Symptoms:** Click marker but popup doesn't appear.

**Solutions:**

1. **Check Popup State**
   ```typescript
   // In MapLibreMap component
   console.log('Popup Info:', popupInfo);
   ```

2. **Verify Click Handler**
   ```typescript
   const handleMarkerClick = (property, e) => {
     e.originalEvent.stopPropagation();
     setPopupInfo(property);  // ✅ Should set state
     if (onPropertyClick) {
       onPropertyClick(property);
     }
   };
   ```

3. **Check CSS Z-Index**
   ```css
   /* Popup should be above other elements */
   .maplibregl-popup {
     z-index: 1000;
   }
   ```

---

### Issue: Build Fails

**Error Message:**
```
Failed to resolve import
```

**Solutions:**

1. **Clear Cache and Rebuild**
   ```bash
   rm -rf node_modules/.vite
   rm -rf dist
   npm run build
   ```

2. **Reinstall Dependencies**
   ```bash
   rm -rf node_modules
   npm install
   npm run build
   ```

3. **Check Import Paths**
   ```typescript
   // Correct
   import MapWrapper from '@/components/maps/shared/MapWrapper';
   
   // Wrong
   import MapWrapper from '@@/components/maps/mapbox/MapboxMaprapper';
   ```

---

### Issue: TypeScript Errors

**Symptoms:** Red squiggly lines in IDE, build fails.

**Solutions:**

1. **Run Diagnostics**
   ```bash
   npm run build
   # Check for TypeScript errors
   ```

2. **Verify Type Imports**
   ```typescript
   import type { BaseMapProps } from '@/types/map.types';
   import type { Property } from '@/types/property.types';
   ```

3. **Check tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["src/*"]
       }
     }
   }
   ```

---

### Issue: Performance Problems

**Symptoms:** Slow rendering, laggy map interactions.

**Solutions:**

1. **Reduce Marker Count**
   ```typescript
   // Use pagination
   const visibleProperties = properties.slice(0, 50);
   ```

2. **Implement Marker Clustering**
   ```typescript
   // For large datasets
   import { Cluster } from 'react-map-gl/maplibre';
   ```

3. **Optimize Re-renders**
   ```typescript
   // Use useMemo for expensive calculations
   const markers = useMemo(() => 
     properties.map(p => <Marker key={p.id} {...p} />),
     [properties]
   );
   ```

4. **Lazy Load Map**
   ```typescript
   const MapWrapper = lazy(() => import('@/components/maps/shared/MapWrapper'));
   ```

---

### Issue: Hover Effects Not Working

**Symptoms:** Hovering over cards doesn't highlight markers.

**Solutions:**

1. **Verify Store Connection**
   ```typescript
   const { hoveredPropertyId, setHoveredProperty } = usePropertyStore();
   ```

2. **Check Event Handlers**
   ```typescript
   <PropertyCard
     onMouseEnter={() => setHoveredProperty(property.id)}
     onMouseLeave={() => setHoveredProperty(null)}
   />
   ```

3. **Verify Marker Styling**
   ```typescript
   const getMarkerColor = (property) => {
     if (property.id === hoveredPropertyId) return '#2563EB';
     // ... other conditions
   };
   ```

---

### Issue: Map Controls Not Visible

**Symptoms:** Zoom buttons, fullscreen button missing.

**Solutions:**

1. **Verify Controls Import**
   ```typescript
   import { NavigationControl, FullscreenControl } from 'react-map-gl/maplibre';
   ```

2. **Check Control Rendering**
   ```typescript
   <Map {...props}>
     <NavigationControl position="top-right" />
     <FullscreenControl position="top-right" />
   </Map>
   ```

3. **Check CSS**
   ```css
   /* Ensure controls are visible */
   .maplibregl-ctrl-group {
     display: block !important;
   }
   ```

---

### Issue: Switching to Mapbox Fails

**Symptoms:** Error when changing engine to "mapbox".

**Solutions:**

1. **Verify Token**
   ```bash
   # Check .env file
   cat .env | grep MAPBOX
   # Should show: VITE_MAPBOX_TOKEN=pk.xxx
   ```

2. **Restart Dev Server**
   ```bash
   # After adding token
   npm run dev
   ```

3. **Check Token Format**
   ```
   ✅ Correct: pk.eyJ1IjoibWFwYm94...
   ❌ Wrong: sk.eyJ1IjoibWFwYm94...  (secret token)
   ```

---

### Issue: Environment Variables Not Working

**Symptoms:** `import.meta.env.VITE_MAPBOX_TOKEN` is undefined.

**Solutions:**

1. **Check File Name**
   ```
   ✅ Correct: .env
   ❌ Wrong: env.txt, .env.txt
   ```

2. **Check Variable Prefix**
   ```
   ✅ Correct: VITE_MAPBOX_TOKEN
   ❌ Wrong: MAPBOX_TOKEN (missing VITE_ prefix)
   ```

3. **Restart Dev Server**
   ```bash
   # Environment variables are loaded on startup
   npm run dev
   ```

---

### Issue: Map Style Not Loading

**Symptoms:** Map loads but tiles are missing or broken.

**Solutions:**

1. **Check Style URL**
   ```typescript
   // Test in browser first
   https://basemaps.cartocdn.com/gl/positron-gl-style/style.json
   ```

2. **Try Alternative Style**
   ```typescript
   // If CartoDB is down, try Maptiler
   mapStyle="https://api.maptiler.com/maps/streets/style.json?key=YOUR_KEY"
   ```

3. **Check CORS**
   - Some style servers require CORS headers
   - Check browser console for CORS errors

---

### Issue: Property Detail Page Map Not Centered

**Symptoms:** Map loads but not centered on property.

**Solutions:**

1. **Verify Viewport Prop**
   ```typescript
   <MapWrapper
     viewport={{
       latitude: property.coordinates.lat,
       longitude: property.coordinates.lng,
       zoom: 15  // ✅ Zoom in for detail view
     }}
   />
   ```

2. **Check Property Coordinates**
   ```typescript
   console.log('Property coords:', property.coordinates);
   // Should show valid lat/lng
   ```

---

## Quick Fixes

### Clear Everything and Start Fresh
```bash
# Stop dev server (Ctrl+C)
rm -rf node_modules
rm -rf dist
rm -rf node_modules/.vite
npm install
npm run dev
```

### Reset to Working State
```bash
# If you made changes and broke something
git status
git diff
git checkout -- src/pages/Index.tsx
npm run dev
```

### Check All Dependencies
```bash
npm list maplibre-gl
npm list react-map-gl
# Should show installed versions
```

---

## Getting Help

### Before Asking for Help

1. ✅ Check browser console for errors
2. ✅ Check Network tab for failed requests
3. ✅ Verify all imports are correct
4. ✅ Try clearing cache and rebuilding
5. ✅ Check this troubleshooting guide

### Where to Get Help

1. **Documentation**
   - MAPLIBRE_IMPLEMENTATION.md
   - src/components/maps/README.md
   - TECHNICAL_SPECIFICATION.md

2. **Community**
   - [MapLibre GitHub Issues](https://github.com/maplibre/maplibre-gl-js/issues)
   - [React Map GL Discussions](https://github.com/visgl/react-map-gl/discussions)
   - [Stack Overflow](https://stackoverflow.com/questions/tagged/maplibre)

3. **Check Examples**
   - [MapLibre Examples](https://maplibre.org/maplibre-gl-js/docs/examples/)
   - [React Map GL Examples](https://visgl.github.io/react-map-gl/examples)

---

## Debug Mode

### Enable Verbose Logging

```typescript
// In MapLibreMap.tsx
useEffect(() => {
  console.log('Map Props:', {
    properties: properties.length,
    selectedPropertyId,
    hoveredPropertyId,
    viewport
  });
}, [properties, selectedPropertyId, hoveredPropertyId, viewport]);
```

### Check Map Instance

```typescript
// In MapLibreMap.tsx
useEffect(() => {
  if (mapRef.current) {
    console.log('Map loaded:', mapRef.current.getMap());
  }
}, []);
```

### Monitor State Changes

```typescript
// In Index.tsx
useEffect(() => {
  console.log('Store state:', {
    selectedPropertyId,
    hoveredPropertyId,
    sortBy
  });
}, [selectedPropertyId, hoveredPropertyId, sortBy]);
```

---

## Prevention Tips

1. **Always destructure all needed properties from store**
2. **Check console regularly during development**
3. **Test after each major change**
4. **Keep dependencies up to date**
5. **Use TypeScript to catch errors early**
6. **Read error messages carefully**
7. **Check documentation before making changes**

---

**Last Updated:** April 7, 2026
**Status:** All known issues documented and resolved
