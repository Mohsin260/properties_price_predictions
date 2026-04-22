// Diagnostic component to check map data
import { useEffect } from 'react';
import type { Property } from '@/types/property.types';

interface MapDiagnosticsProps {
  properties: Property[];
  viewport: any;
  selectedPropertyId?: number | null;
}

export const MapDiagnostics = ({ properties, viewport, selectedPropertyId }: MapDiagnosticsProps) => {
  useEffect(() => {
    console.group('🗺️ Map Diagnostics');
    console.log('Properties count:', properties.length);
    console.log('Viewport:', viewport);
    console.log('Selected Property ID:', selectedPropertyId);
    
    if (properties.length > 0) {
      console.log('First property:', {
        id: properties[0].id,
        title: properties[0].title,
        coordinates: properties[0].coordinates
      });
      console.log('All property coordinates:', properties.map(p => ({
        id: p.id,
        lat: p.coordinates.lat,
        lng: p.coordinates.lng
      })));
    } else {
      console.warn('⚠️ No properties found!');
    }
    console.groupEnd();
  }, [properties, viewport, selectedPropertyId]);

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-sm">
      <div className="font-bold mb-2">Map Debug Info</div>
      <div>Properties: {properties.length}</div>
      <div>Viewport: {viewport.latitude.toFixed(4)}, {viewport.longitude.toFixed(4)}</div>
      <div>Zoom: {viewport.zoom}</div>
      <div>Selected: {selectedPropertyId || 'None'}</div>
      {properties.length === 0 && (
        <div className="mt-2 text-red-400 font-bold">⚠️ NO PROPERTIES!</div>
      )}
    </div>
  );
};
