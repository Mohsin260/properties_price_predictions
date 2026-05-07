import type { Property, ModelMetadata } from '@/types/property.types';
import processedPropertiesData from './processed_properties.json';
import modelMetadataData from './model_metadata.json';

// We cast the imported JSON to Property[] as it has been pre-processed 
// by scripts/transform_predictions.cjs from predictions_5000.json
// to match the exact interface requirements including GIS data and AI Valuation data.
export const dublinProperties: Property[] = processedPropertiesData as unknown as Property[];

// Model metadata from the XGBoost Full Enhanced model
export const modelMetadata: ModelMetadata = modelMetadataData as ModelMetadata;

// Export individual property for detail pages
export function getPropertyBySlug(slug: string): Property | undefined {
  return dublinProperties.find(p => p.slug === slug);
}

export function getPropertyById(id: number): Property | undefined {
  return dublinProperties.find(p => p.id === id);
}
