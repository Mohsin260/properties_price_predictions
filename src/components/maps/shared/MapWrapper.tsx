// Shared map wrapper that can switch between MapLibre and Mapbox implementations

import { lazy, Suspense } from 'react';
import type { BaseMapProps } from '@/types/map.types';

// Lazy load map implementations
const MapLibreMap = lazy(() => import('../maplibre/MapLibreMap'));
const MapboxMap = lazy(() => import('../mapbox/MapboxMap'));

interface MapWrapperProps extends BaseMapProps {
  engine?: 'maplibre' | 'mapbox';
}

const MapWrapper = ({ engine = 'maplibre', ...props }: MapWrapperProps) => {
  const MapComponent = engine === 'maplibre' ? MapLibreMap : MapboxMap;

  return (
    <Suspense fallback={
      <div 
        className="w-full rounded-lg overflow-hidden border border-border bg-muted flex items-center justify-center"
        style={{ height: props.height || 'calc(100vh - 200px)' }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    }>
      <MapComponent {...props} />
    </Suspense>
  );
};

export default MapWrapper;
