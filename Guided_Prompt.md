You are working inside an existing React application that already has a static property listing UI for Dublin. Your job is to convert only the map part into a production-quality MapLibre-based implementation while keeping a separate, optional Mapbox implementation folder for future use. Do not delete or rewrite the UI shell unless it is needed to connect map interactions.

GOAL
Build a fully working Dublin property experience with:
- left-side property list
- right-side interactive MapLibre map
- clickable property markers
- clickable property cards
- property detail view
- amenity overlays for parks, cycle tracks, walking tracks, and bus stations
- crime-rate-aware property metadata
- dummy Dublin data now, API-ready structure later
- clean separation between MapLibre and Mapbox code paths

ARCHITECTURE REQUIREMENTS
1. Create a shared data layer:
   - src/data/properties.ts
   - src/data/amenities.ts
   - src/types/property.ts
   - src/lib/geospatial.ts

2. Create separate map implementations:
   - src/components/maps/maplibre/
   - src/components/maps/mapbox/
   - src/components/maps/shared/

3. Create a stable interface that both map engines can follow:
   - MapShell
   - PropertyMarkerLayer
   - AmenityLayer
   - PropertyPopup
   - MapToolbar
   - MapLegend
   - MapViewportSync

4. Make MapLibre the default active implementation.
   - Use MapLibre-specific files only in the live UI.
   - Keep Mapbox files scaffolded but unused.
   - Do not mix Mapbox runtime code into the MapLibre branch.

MAPLIBRE IMPLEMENTATION
1. Build a MapLibre component using a React-friendly wrapper or native MapLibre GL JS, whichever keeps the code cleanest in the current project.
2. Add the required MapLibre stylesheet.
3. Center the map on Dublin.
4. Render property data from dummy Dublin records.
5. Render amenities as separate layers or markers.
6. On property click:
   - open popup
   - highlight the matching card
   - scroll the card into view
   - update the selected property state
7. On card click:
   - fly the map to the property
   - open its popup
8. Make hover and selection states visually clear.
9. Add map controls only if they improve the UX:
   - zoom controls
   - fullscreen
   - geolocation only if needed
   - layer toggle if useful

DATA MODEL
Each property should include:
- id
- slug
- title
- address
- price
- bedrooms
- bathrooms
- areaSqm
- latitude
- longitude
- crimeScore
- nearestPark
- nearestCycleTrack
- nearestWalkingTrack
- nearestBusStation
- description
- galleryImages
- featureList
- computedScore
- marketNotes or rankingNotes

Each amenity should include:
- id
- type
- name
- latitude
- longitude
- optional description
- optional distanceToProperty when computed

GIS / SCORING LOGIC
1. Use simple dummy logic now:
   - lower distance to park, cycle track, walking track, and bus station increases desirability
   - lower crime score increases desirability
2. Add a computed score helper in geospatial.ts.
3. Keep scoring logic isolated so it can later be replaced with real AI/ML or backend scoring.
4. Add readable badges in UI for nearby amenities and crime score.
5. Add a small “why this property ranks well” panel on the detail page.

MAP DATA STRATEGY
1. Use GeoJSON for property points and amenity points.
2. Keep a single source of truth for coordinates in the shared data layer.
3. Build feature collections from the dummy records.
4. Keep the map layer structure ready for future server-fed GeoJSON.

LISTING PAGE BEHAVIOR
1. Left side:
   - property cards
   - filters
   - sorting
   - selected property highlight
2. Right side:
   - map
3. Filters should include:
   - price range
   - beds
   - baths
   - crime score band
   - amenity proximity
4. Sorting should include:
   - price low to high
   - price high to low
   - highest score
   - nearest to selected amenity
5. Keep the list and map synchronized at all times.

DETAIL PAGE BEHAVIOR
1. Build a property detail route based on slug.
2. Show:
   - hero/gallery
   - price
   - full address
   - stats
   - feature chips
   - nearby amenities
   - embedded map centered on the property
   - ranking explanation
3. Reuse the same data model from the listing page.

IMPLEMENTATION STEPS
1. Audit the current React app structure.
2. Identify the existing static map placeholder and replace it with a MapLibre-driven component.
3. Build the shared types and dummy Dublin dataset first.
4. Build the map layer components next.
5. Wire the property list to the map selection state.
6. Add amenity overlays and popups.
7. Build the detail page using the same record source.
8. Add score calculations and display them in both list and detail views.
9. Add loading states, empty states, and error handling.
10. Finish with responsive design and polish.

DELIVERABLES
- working MapLibre listing page
- working property-marker interaction
- working card-to-map sync
- working property detail page
- dummy Dublin data set
- shared geospatial scoring helpers
- separate Mapbox folder scaffolded but inactive
- clean component structure that can later swap map engines without rewriting the UI

QUALITY BAR
- TypeScript-first
- reusable components
- no hardcoded data inside components
- no direct Mapbox dependency in the active branch
- clear separation of presentation, data, and geospatial logic
- production-ready folder structure
- clean naming
- easy to replace dummy data with API data later

IMPORTANT
Do not over-engineer. Build the simplest solid version first, then improve polish. The live branch must use MapLibre only. The Mapbox branch must remain separate and optional.