// Global state management for property listings and map interaction

import { create } from 'zustand';
import type { Property, PropertyFilters, SortBy } from '@/types/property.types';

interface PropertyStore {
  // Selected/Hovered properties
  selectedPropertyId: number | null;
  hoveredPropertyId: number | null;
  
  // Filters and sorting
  filters: PropertyFilters;
  sortBy: SortBy;
  
  // Map viewport
  mapViewport: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  
  // Actions
  setSelectedProperty: (id: number | null) => void;
  setHoveredProperty: (id: number | null) => void;
  setFilters: (filters: Partial<PropertyFilters>) => void;
  resetFilters: () => void;
  setSortBy: (sortBy: SortBy) => void;
  setMapViewport: (viewport: { latitude: number; longitude: number; zoom: number }) => void;
  centerMapOnProperty: (property: Property) => void;
}

const defaultFilters: PropertyFilters = {
  priceMin: undefined,
  priceMax: undefined,
  beds: undefined,
  baths: undefined,
  propertyType: undefined,
  maxDistanceToPark: undefined,
  maxDistanceToBus: undefined,
  maxCrimeScore: undefined,
  minDesirabilityScore: undefined,
  berRating: undefined
};

export const usePropertyStore = create<PropertyStore>((set) => ({
  selectedPropertyId: null,
  hoveredPropertyId: null,
  filters: defaultFilters,
  sortBy: 'ai-deal-desc',
  mapViewport: {
    latitude: parseFloat(import.meta.env.VITE_DEFAULT_MAP_CENTER_LAT || '53.3498'),
    longitude: parseFloat(import.meta.env.VITE_DEFAULT_MAP_CENTER_LNG || '-6.2603'),
    zoom: parseFloat(import.meta.env.VITE_DEFAULT_MAP_ZOOM || '12')
  },

  setSelectedProperty: (id) => set({ selectedPropertyId: id }),
  
  setHoveredProperty: (id) => set({ hoveredPropertyId: id }),
  
  setFilters: (newFilters) => 
    set((state) => ({ 
      filters: { ...state.filters, ...newFilters } 
    })),
  
  resetFilters: () => set({ filters: defaultFilters }),
  
  setSortBy: (sortBy) => set({ sortBy }),
  
  setMapViewport: (viewport) => set({ mapViewport: viewport }),
  
  centerMapOnProperty: (property) => 
    set({ 
      mapViewport: {
        latitude: property.coordinates.lat,
        longitude: property.coordinates.lng,
        zoom: 15
      },
      selectedPropertyId: property.id
    })
}));
