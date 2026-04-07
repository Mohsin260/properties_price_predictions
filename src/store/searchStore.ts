import { create } from 'zustand';

export interface SearchFilters {
  searchType: string;
  location: string;
  minPrice: string;
  maxPrice: string;
  propertyType: string;
  minBeds: string;
  maxBeds: string;
  minBaths: string;
  maxBaths: string;
  minEnergyRating: string;
  globalSearch: string;
}

interface SearchStore {
  filters: SearchFilters;
  setFilter: (key: keyof SearchFilters, value: string) => void;
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: SearchFilters = {
  searchType: 'Residential To Let',
  location: 'Dublin',
  minPrice: '',
  maxPrice: '',
  propertyType: '',
  minBeds: '',
  maxBeds: '',
  minBaths: '',
  maxBaths: '',
  minEnergyRating: '',
  globalSearch: '',
};

export const useSearchStore = create<SearchStore>((set) => ({
  filters: defaultFilters,
  setFilter: (key, value) =>
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    })),
  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
