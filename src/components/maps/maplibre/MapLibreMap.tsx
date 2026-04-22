import { useEffect, useRef, useState, useCallback } from 'react';
import Map, { Marker, Popup, NavigationControl, FullscreenControl } from 'react-map-gl/maplibre';
import { Home } from 'lucide-react';
import type { BaseMapProps } from '@/types/map.types';
import type { Property } from '@/types/property.types';
import { formatDistance } from '@/utils/geoCalculations';
import 'maplibre-gl/dist/maplibre-gl.css';

const MapLibreMap = ({
  properties,
  selectedPropertyId,
  hoveredPropertyId,
  viewport,
  showAmenities = true,
  onPropertyClick,
  onPropertyHover,
  onViewportChange,
  height = 'calc(100vh - 200px)',
  className = ''
}: BaseMapProps) => {
  const mapRef = useRef<any>(null);
  const [popupInfo, setPopupInfo] = useState<Property | null>(null);
  const [viewState, setViewState] = useState({
    longitude: viewport.longitude,
    latitude: viewport.latitude,
    zoom: viewport.zoom
  });

  // Debug: Log properties on mount and when they change
  useEffect(() => {
    console.log('MapLibreMap - Properties count:', properties.length);
    console.log('MapLibreMap - First property:', properties[0]);
    console.log('MapLibreMap - Viewport:', viewport);
  }, [properties, viewport]);

  // Sync viewState with viewport prop changes
  useEffect(() => {
    const map = mapRef.current?.getMap();
    if (map) {
      // Check if viewport changed significantly
      const currentCenter = map.getCenter();
      const latDiff = Math.abs(currentCenter.lat - viewport.latitude);
      const lngDiff = Math.abs(currentCenter.lng - viewport.longitude);
      const zoomDiff = Math.abs(map.getZoom() - viewport.zoom);
      
      // If there's a significant change, fly to new location
      if (latDiff > 0.001 || lngDiff > 0.001 || zoomDiff > 0.5) {
        // Calculate offset to center the marker with popup visible above it
        // Popup is approximately 350px tall, offset down so marker+popup are centered
        const offsetLat = -0.0025; // Negative offset moves map view down, marker appears higher
        
        map.flyTo({
          center: [viewport.longitude, viewport.latitude + offsetLat],
          zoom: viewport.zoom,
          duration: 1000
        });
      }
    }
    
    // Always update viewState
    setViewState({
      longitude: viewport.longitude,
      latitude: viewport.latitude,
      zoom: viewport.zoom
    });
  }, [viewport.latitude, viewport.longitude, viewport.zoom]);

  // Open popup when property is selected
  useEffect(() => {
    if (selectedPropertyId) {
      const property = properties.find(p => p.id === selectedPropertyId);
      if (property) {
        setPopupInfo(property);
      }
    } else {
      setPopupInfo(null);
    }
  }, [selectedPropertyId, properties]);

  const handleMove = useCallback((evt: any) => {
    setViewState(evt.viewState);
    if (onViewportChange) {
      onViewportChange({
        latitude: evt.viewState.latitude,
        longitude: evt.viewState.longitude,
        zoom: evt.viewState.zoom
      });
    }
  }, [onViewportChange]);

  const getMarkerColor = (property: Property) => {
    if (property.id === selectedPropertyId) return '#2563EB'; // blue-600
    if (property.id === hoveredPropertyId) return '#60A5FA'; // blue-400
    
    // Color by AI Valuation
    if (property.predictedPrice) {
      if (property.price < property.predictedPrice * 0.95) return '#16A34A'; // green-600 (Undervalued / Good Deal)
      if (property.price > property.predictedPrice * 1.05) return '#DC2626'; // red-600 (Overvalued / Expensive)
      return '#F59E0B'; // amber-500 (Fair Value)
    }

    return '#9CA3AF'; // gray-400
  };

  const getMarkerSize = (property: Property) => {
    if (property.id === selectedPropertyId) return 40;
    if (property.id === hoveredPropertyId) return 36;
    return 32;
  };

  const handleMarkerClick = (property: Property, e: any) => {
    e.originalEvent.stopPropagation();
    setPopupInfo(property);
    if (onPropertyClick) {
      onPropertyClick(property);
    }
  };

  return (
    <div className={`relative w-full rounded-lg overflow-hidden border border-border ${className}`} style={{ height }}>
      <Map
        ref={mapRef}
        {...viewState}
        onMove={handleMove}
        mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
        style={{ width: '100%', height: '100%' }}
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        <FullscreenControl position="top-right" />

        {/* Property Markers */}
        {properties.map((property) => (
          <Marker
            key={property.id}
            latitude={property.coordinates.lat}
            longitude={property.coordinates.lng}
            anchor="bottom"
            onClick={(e) => handleMarkerClick(property, e)}
          >
            <div
              className="cursor-pointer transition-transform hover:scale-110"
              style={{
                width: getMarkerSize(property),
                height: getMarkerSize(property)
              }}
              onMouseEnter={() => onPropertyHover?.(property)}
              onMouseLeave={() => onPropertyHover?.(null)}
            >
              <div
                className="w-full h-full rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                style={{ backgroundColor: getMarkerColor(property) }}
              >
                <Home className="w-4 h-4 text-white" />
              </div>
            </div>
          </Marker>
        ))}

        {/* Amenity Markers */}
        {showAmenities && (
          <>
            {properties
              .filter(p => p.id === selectedPropertyId || p.id === hoveredPropertyId || properties.length <= 10)
              .map((p) => (
                <div key={`amenities-${p.id}`}>
                  {/* Park */}
                  <Marker
                    latitude={p.nearestAmenities.park.coordinates.lat}
                    longitude={p.nearestAmenities.park.coordinates.lng}
                    anchor="center"
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md border-2 border-white cursor-help group relative">
                      <span className="text-white text-[10px] font-bold">P</span>
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-card px-2 py-1 rounded shadow-lg text-[10px] whitespace-nowrap z-50">
                        {p.nearestAmenities.park.name} ({formatDistance(p.nearestAmenities.park.distanceM)})
                      </div>
                    </div>
                  </Marker>
                  
                  {/* Bus Station */}
                  <Marker
                    latitude={p.nearestAmenities.busStation.coordinates.lat}
                    longitude={p.nearestAmenities.busStation.coordinates.lng}
                    anchor="center"
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-md border-2 border-white cursor-help group relative">
                      <span className="text-white text-[10px] font-bold">B</span>
                      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-card px-2 py-1 rounded shadow-lg text-[10px] whitespace-nowrap z-50">
                        {p.nearestAmenities.busStation.name} ({formatDistance(p.nearestAmenities.busStation.distanceM)})
                      </div>
                    </div>
                  </Marker>
                </div>
              ))}
          </>
        )}

        {/* Property Popup */}
        {popupInfo && (
          <Popup
            latitude={popupInfo.coordinates.lat}
            longitude={popupInfo.coordinates.lng}
            anchor="top"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
            className="property-popup"
            maxWidth="none"
          >
            <div className="p-3 w-[320px]">
              <img 
                src={popupInfo.images[0]} 
                alt={popupInfo.title}
                className="w-full h-32 object-cover rounded mb-2"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200';
                }}
              />
              <h3 className="font-bold text-sm mb-1">{popupInfo.title}</h3>
              <p className="text-lg font-bold text-accent mb-2">
                €{popupInfo.price.toLocaleString()}
              </p>
              <div className="flex gap-3 text-xs text-muted-foreground mb-2">
                <span>{popupInfo.beds} beds</span>
                <span>{popupInfo.baths} baths</span>
                <span>{popupInfo.sqm} sqm</span>
              </div>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Park:</span>
                  <span>{formatDistance(popupInfo.nearestAmenities.park.distanceM)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Bus:</span>
                  <span>{formatDistance(popupInfo.nearestAmenities.busStation.distanceM)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">Score:</span>
                  <span className="font-bold text-accent">{popupInfo.desirabilityScore}/100</span>
                </div>
              </div>
              <a
                href={`/property/${popupInfo.slug}`}
                className="block mt-3 text-center bg-accent text-accent-foreground py-1.5 rounded text-xs font-bold hover:opacity-90 transition-opacity"
              >
                VIEW DETAILS
              </a>
            </div>
          </Popup>
        )}
      </Map>

      {/* Map Legend */}
      {showAmenities && (
        <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-border">
          <h4 className="text-xs font-bold mb-2">Map Legend</h4>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#16A34A] rounded-full"></div>
              <span>Undervalued (Good Deal)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#F59E0B] rounded-full"></div>
              <span>Fair Value</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#DC2626] rounded-full"></div>
              <span>Overvalued</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white">
                <span className="text-[8px] font-bold">P</span>
              </div>
              <span>Parks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <span className="text-[8px] font-bold">B</span>
              </div>
              <span>Bus Stations</span>
            </div>
          </div>
        </div>
      )}

      {/* Map Engine Badge */}
      <div className="absolute top-4 left-4 bg-card/95 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-muted-foreground border border-border">
        MapLibre GL JS
      </div>
    </div>
  );
};

export default MapLibreMap;
