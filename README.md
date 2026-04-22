# Dublin Property Portal - GIS-Powered Property Rental Platform

A modern, interactive property rental portal demonstrating AI-driven property price prediction using alternative data sources. Built with React, TypeScript, and Mapbox GL JS.

![Property Portal](https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&h=400&fit=crop)

## 🎯 Project Purpose

This platform demonstrates how **Geographic Information Systems (GIS)** and **alternative data** can predict property prices. The core hypothesis:

> Properties closer to amenities (parks, cycle tracks, walking tracks, bus stations) with lower crime rates command higher rental prices.

## ✨ Key Features

### 🗺️ Interactive Mapping
- **MapLibre GL JS** integration (no token required!)
- Property markers color-coded by desirability score
- Amenity markers (parks, bus stations)
- Click markers for detailed popups
- Smooth map animations and transitions
- Alternative Mapbox engine available

### 📊 GIS Analysis
- **Proximity calculations** to parks, cycle tracks, walking tracks, bus stations
- **Crime score** analysis by area
- **Desirability scoring** algorithm (0-100)
- Real-time distance calculations using Turf.js

### 🏠 Property Features
- 10 Dublin properties with real coordinates
- Detailed property pages with image galleries
- Beds, baths, square meters, BER ratings
- Price per square meter calculations
- Nearby amenities with walk times

### 🎨 Modern UI/UX
- Elegant, responsive design
- Smooth animations (Framer Motion)
- 50+ shadcn/ui components
- Dark mode support (configured)
- Mobile-first approach

### 🔍 Smart Filtering & Sorting
- Sort by price, date, desirability, value
- Pagination (10 items per page)
- Filter by price, beds, amenities (ready to implement)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- No API tokens required! (MapLibre is free)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd properties_template
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables (optional)**
```bash
cp .env.example .env
```

MapLibre works without any configuration! If you want to use Mapbox instead:
```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

Get Mapbox token at: https://account.mapbox.com/access-tokens/

4. **Start development server**
```bash
npm run dev
```

Open http://localhost:5173

### Build for Production
```bash
npm run build
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Map/
│   │   └── PropertyMap.tsx          # Interactive Mapbox map
│   ├── PropertyCard.tsx              # Property card with GIS data
│   ├── SearchBar.tsx                 # Search and filters
│   └── SiteHeader.tsx                # Navigation header
├── data/
│   ├── dublinAmenities.ts            # Parks, cycle tracks, bus stations
│   └── dublinProperties.ts           # 10 properties with GIS data
├── pages/
│   ├── Index.tsx                     # Main listing page
│   ├── PropertyDetail.tsx            # Property detail page
│   └── NotFound.tsx                  # 404 page
├── store/
│   └── propertyStore.ts              # Zustand state management
├── types/
│   └── property.types.ts             # TypeScript interfaces
├── utils/
│   └── geoCalculations.ts            # GIS utility functions
└── App.tsx                           # Router configuration
```

## 🧮 Desirability Score Algorithm

Properties are scored 0-100 based on:

```
Score = (parkProximity × 25%) + 
        (cycleTrackProximity × 15%) + 
        (walkingTrackProximity × 15%) + 
        (busProximity × 20%) + 
        (crimeSafety × 25%)
```

**Scoring Bands:**
- 80-100: Excellent (green)
- 60-79: Very Good (blue)
- 40-59: Good (yellow)
- 20-39: Fair (orange)
- 0-19: Poor (red)

## 🛠️ Technology Stack

### Core
- **React 18.3** - UI framework
- **TypeScript** - Type safety
- **Vite 7.3** - Build tool

### Mapping & GIS
- **MapLibre GL JS** - Interactive maps (primary)
- **Mapbox GL JS** - Alternative map engine (dormant)
- **react-map-gl** - React wrapper for both engines
- **Turf.js** - Geospatial calculations

### UI & Styling
- **Tailwind CSS** - Utility-first CSS
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **Lucide React** - Icons

### State & Data
- **Zustand** - State management
- **TanStack Query** - Server state (ready for API)

## 📊 Data Structure

### Property Model
```typescript
interface Property {
  id: number;
  slug: string;
  title: string;
  price: number;
  coordinates: { lat: number; lng: number };
  beds: number;
  baths: number;
  sqm: number;
  
  // GIS data
  nearestAmenities: {
    park: { name: string; distanceM: number; walkMinutes: number };
    busStation: { name: string; distanceM: number; routes: string[] };
    cycleTrack: { name: string; distanceM: number };
    walkingTrack: { name: string; distanceM: number };
  };
  crimeScore: number; // 0-100 (lower is better)
  desirabilityScore: number; // 0-100 (higher is better)
}
```

### Amenities
- **6 Parks** - St. Stephen's Green, Herbert Park, Phoenix Park, etc.
- **4 Cycle Tracks** - Grand Canal, Royal Canal, Dodder, Clontarf
- **3 Walking Tracks** - Grand Canal Walk, Sandymount Strand, Phoenix Park
- **6 Bus Stations** - Real Dublin Bus routes
- **5 Crime Zones** - Simulated crime data

## 🎯 What's Implemented

✅ Interactive Mapbox map with property markers  
✅ Property listing page with map synchronization  
✅ Property detail pages with full information  
✅ GIS calculations (distance, proximity, scoring)  
✅ Desirability scoring algorithm  
✅ Hover/click interactions between cards and map  
✅ Sorting by price, date, desirability, value  
✅ Pagination (10 items per page)  
✅ Responsive design (mobile, tablet, desktop)  
✅ Smooth animations and transitions  
✅ BER rating display  
✅ Crime score visualization  

## 🚧 Next Steps

### Phase 1: Enhanced Filtering
- [ ] Connect SearchBar filters to property store
- [ ] Filter by price range, beds, baths
- [ ] Filter by max distance to amenities
- [ ] Filter by crime score threshold
- [ ] Active filter badges

### Phase 2: Advanced Map Features
- [ ] Cycle track polylines (blue lines)
- [ ] Walking track polylines (orange lines)
- [ ] Crime heatmap overlay
- [ ] Radius circles (500m, 1km)
- [ ] Toggle amenity layers
- [ ] Marker clustering

### Phase 3: Backend Integration
- [ ] REST API with Express/Fastify
- [ ] PostgreSQL + PostGIS database
- [ ] Spatial queries (ST_Distance, ST_DWithin)
- [ ] Real-time data updates
- [ ] User authentication

### Phase 4: User Features
- [ ] Save favorite properties
- [ ] Compare properties
- [ ] Contact forms
- [ ] Schedule viewings
- [ ] Property alerts

See [TECHNICAL_SPECIFICATION.md](./TECHNICAL_SPECIFICATION.md) for detailed implementation plan.

## 📖 Documentation

- **[TECHNICAL_SPECIFICATION.md](./TECHNICAL_SPECIFICATION.md)** - Complete technical documentation
- **[Context_project.md](./Context_project.md)** - Research context and requirements
- **[.env.example](./.env.example)** - Environment variable template

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run E2E tests (Playwright)
npx playwright test
```

## 🎨 Design System

### Colors
- **Primary**: Dark blue (#1E3A5F) - Navigation, headers
- **Accent**: Red (#DC2626) - CTAs, highlights
- **BER Ratings**: Green (A/B), Yellow (C), Orange (D), Red (E-G)
- **Desirability**: Green (80+), Blue (60-79), Yellow (40-59), Orange (20-39), Red (0-19)

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Lato (sans-serif)

## 🌐 Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS Safari 14+, Chrome Android

## 📝 Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
```

## 🤝 Contributing

This is a research demonstration project. For production use:

1. Replace dummy data with real property data
2. Implement backend API with PostgreSQL + PostGIS
3. Add user authentication
4. Implement all filtering features
5. Add comprehensive testing

## 📄 License

This project is for educational and research purposes.

## 🙏 Acknowledgments

- **Mapbox** - Interactive mapping platform
- **shadcn/ui** - Beautiful component library
- **Turf.js** - Geospatial analysis
- **Dublin Bus** - Route information
- **OpenStreetMap** - Geographic data

## 📧 Support

For questions or issues:
- Check [TECHNICAL_SPECIFICATION.md](./TECHNICAL_SPECIFICATION.md)
- Review [Context_project.md](./Context_project.md)
- Open an issue on GitHub

---

**Built with ❤️ for property research and GIS analysis**

**Version:** 1.0.0  
**Last Updated:** April 7, 2026
