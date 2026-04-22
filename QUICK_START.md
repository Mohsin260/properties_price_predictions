# Quick Start Guide - Dublin Property Portal

Get up and running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Mapbox account (free tier is fine)

## Step 1: Install Dependencies

```bash
npm install
```

This installs:
- React, TypeScript, Vite
- Mapbox GL JS and react-map-gl
- Turf.js for geospatial calculations
- Zustand for state management
- shadcn/ui components
- Framer Motion for animations

## Step 2: Get Mapbox Token

1. Go to https://account.mapbox.com/
2. Sign up or log in
3. Navigate to "Access tokens"
4. Copy your default public token (starts with `pk.`)

## Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and paste your Mapbox token:

```env
VITE_MAPBOX_TOKEN=pk.your_actual_token_here
```

## Step 4: Start Development Server

```bash
npm run dev
```

The app will open at: **http://localhost:5173**

## What You'll See

### Main Page (/)
- **Left side**: Grid of 10 Dublin properties
- **Right side**: Interactive Mapbox map
- **Features**:
  - Click property card → map centers on property
  - Hover card → marker highlights
  - Click marker → popup with details
  - Sort by price, date, desirability
  - Pagination (10 per page)

### Property Detail Page (/property/:slug)
- Image gallery
- Price, beds, baths, sqm
- Desirability score (0-100)
- Nearby amenities with distances
- Crime score
- Interactive map centered on property

## Key Interactions

### Map Markers
- **Green** = High desirability (80+)
- **Blue** = Good desirability (60-79)
- **Yellow** = Fair desirability (40-59)
- **Orange/Red** = Lower desirability

### Amenity Markers
- **Green "P"** = Parks
- **Blue "B"** = Bus stations

### Sorting Options
- Price: Low to High / High to Low
- Date: Oldest to Newest / Newest to Oldest
- Desirability: Highest to Lowest
- Best Value: Desirability per euro

## Project Structure Overview

```
src/
├── components/
│   ├── Map/PropertyMap.tsx       # Interactive map
│   ├── PropertyCard.tsx          # Property card with GIS data
│   └── SearchBar.tsx             # Filters (ready to connect)
├── data/
│   ├── dublinAmenities.ts        # Parks, bus stops, etc.
│   └── dublinProperties.ts       # 10 properties with coordinates
├── pages/
│   ├── Index.tsx                 # Main listing page
│   └── PropertyDetail.tsx        # Property detail page
├── store/
│   └── propertyStore.ts          # Global state (Zustand)
├── types/
│   └── property.types.ts         # TypeScript interfaces
└── utils/
    └── geoCalculations.ts        # Distance, scoring functions
```

## Testing the Features

### 1. Test Map Interaction
- Click any property card
- Watch the map center on that property
- Click the map marker to see popup

### 2. Test Sorting
- Change sort dropdown to "Desirability: Highest to Lowest"
- See properties reorder
- Notice map markers stay synced

### 3. Test Property Detail
- Click "VIEW PROPERTY" on any card
- See full property details
- Check nearby amenities section
- View desirability score breakdown

### 4. Test Hover Effects
- Hover over a property card
- See the marker highlight on map
- Smooth animations throughout

## Understanding the Data

### Properties (10 total)
All located in Dublin 4 area with real coordinates:
- Percy Place
- Merrion Road
- Ballsbridge
- Lansdowne Place
- Shrewsbury
- Haddington Road

### Amenities
- **6 Parks**: St. Stephen's Green, Herbert Park, Phoenix Park, etc.
- **6 Bus Stations**: Real Dublin Bus routes (4, 7, 18, 45, etc.)
- **4 Cycle Tracks**: Grand Canal, Royal Canal, Dodder, Clontarf
- **3 Walking Tracks**: Various Dublin trails

### Desirability Score
Calculated based on:
- 25% - Distance to nearest park
- 20% - Distance to nearest bus station
- 15% - Distance to cycle track
- 15% - Distance to walking track
- 25% - Crime safety score

## Common Issues & Solutions

### Issue: Map not loading
**Solution**: Check your Mapbox token in `.env`
```bash
# Verify token starts with pk.
cat .env | grep MAPBOX
```

### Issue: Port 5173 already in use
**Solution**: Kill the process or use different port
```bash
# Use different port
npm run dev -- --port 3000
```

### Issue: TypeScript errors
**Solution**: Restart TypeScript server in your IDE
```bash
# Or rebuild
npm run build
```

### Issue: Styles not applying
**Solution**: Clear cache and restart
```bash
rm -rf node_modules/.vite
npm run dev
```

## Next Steps

### 1. Customize Data
Edit `src/data/dublinProperties.ts` to add more properties

### 2. Connect Filters
Implement filter logic in `src/pages/Index.tsx`:
```typescript
const filteredProperties = useMemo(() => {
  return dublinProperties.filter(property => {
    // Add your filter logic
    return true;
  });
}, [filters]);
```

### 3. Add Backend
See `TECHNICAL_SPECIFICATION.md` for API structure

### 4. Deploy
```bash
npm run build
# Upload dist/ folder to Vercel, Netlify, etc.
```

## Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check code style
npm run test             # Run tests

# Debugging
npm run dev -- --debug   # Verbose logging
```

## Learning Resources

- **Mapbox GL JS**: https://docs.mapbox.com/mapbox-gl-js/
- **Turf.js**: https://turfjs.org/
- **React Map GL**: https://visgl.github.io/react-map-gl/
- **Zustand**: https://docs.pmnd.rs/zustand/
- **shadcn/ui**: https://ui.shadcn.com/

## Getting Help

1. Check `TECHNICAL_SPECIFICATION.md` for detailed docs
2. Review `Context_project.md` for project context
3. Check browser console for errors
4. Verify Mapbox token is valid

## Success Checklist

- [ ] Dependencies installed
- [ ] Mapbox token configured
- [ ] Dev server running
- [ ] Map loads with markers
- [ ] Property cards display
- [ ] Click interactions work
- [ ] Property detail page loads
- [ ] Sorting works
- [ ] Hover effects work

---

**You're all set! Start exploring the Dublin property market with GIS-powered insights.**

Need more details? See [TECHNICAL_SPECIFICATION.md](./TECHNICAL_SPECIFICATION.md)
