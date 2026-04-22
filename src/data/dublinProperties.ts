import type { Property } from '@/types/property.types';
import processedPropertiesData from './processed_properties.json';

// We cast the imported JSON to Property[] as it has been pre-processed 
// to match the exact interface requirements including GIS data and AI Valuation data.
export const dublinProperties: Property[] = processedPropertiesData as unknown as Property[];

// Export individual property for detail pages
export function getPropertyBySlug(slug: string): Property | undefined {
  return dublinProperties.find(p => p.slug === slug);
}

export function getPropertyById(id: number): Property | undefined {
  return dublinProperties.find(p => p.id === id);
}

