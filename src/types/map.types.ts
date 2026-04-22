// Shared map interface types for both MapLibre and Mapbox implementations

import type { Property } from './property.types';
import type { Park, BusStation } from './property.types';

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing?: number;
  pitch?: number;
}

export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarkerProps {
  property: Property;
  isSelected?: boolean;
  isHovered?: boolean;
  onClick?: (property: Property) => void;
  onHover?: (property: Property | null) => void;
}

export interface MapPopupProps {
  property: Property;
  onClose: () => void;
}

export interface AmenityMarkerProps {
  amenity: Park | BusStation;
  type: 'park' | 'bus' | 'cycle' | 'walk';
}

export interface MapControlsProps {
  showZoom?: boolean;
  showFullscreen?: boolean;
  showGeolocate?: boolean;
  showLayerToggle?: boolean;
}

export interface MapLegendProps {
  items: Array<{
    color: string;
    label: string;
    icon?: string;
  }>;
}

export interface MapLayerConfig {
  id: string;
  type: 'properties' | 'parks' | 'bus-stations' | 'cycle-tracks' | 'walking-tracks' | 'crime-zones';
  visible: boolean;
  data: any;
}

export interface MapEngine {
  name: 'maplibre' | 'mapbox';
  version: string;
  requiresToken: boolean;
}

// Map event handlers
export interface MapEventHandlers {
  onLoad?: () => void;
  onMove?: (viewport: MapViewport) => void;
  onClick?: (event: any) => void;
  onHover?: (event: any) => void;
}

// Shared map component props
export interface BaseMapProps {
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
