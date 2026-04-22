import { Bed, Bath, Maximize, ChevronRight, MapPin, TrendingUp, Sparkles } from "lucide-react";
import type { Property } from "@/types/property.types";
import { motion } from "framer-motion";
import { usePropertyStore } from "@/store/propertyStore";
import { formatDistance, getDesirabilityLabel } from "@/utils/geoCalculations";

const berColorMap: Record<string, string> = {
  green: "bg-ber-green text-accent-foreground",
  yellow: "bg-ber-yellow text-foreground",
  orange: "bg-ber-orange text-accent-foreground",
  red: "bg-ber-red text-accent-foreground",
};

const PropertyCard = ({ property, index }: { property: Property; index: number }) => {
  const { setHoveredProperty, setSelectedProperty, centerMapOnProperty } = usePropertyStore();
  const desirabilityInfo = getDesirabilityLabel(property.desirabilityScore);

  const handleCardClick = () => {
    setSelectedProperty(property.id);
    centerMapOnProperty(property);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="property-card cursor-pointer"
      onMouseEnter={() => setHoveredProperty(property.id)}
      onMouseLeave={() => setHoveredProperty(null)}
      onClick={handleCardClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200';
          }}
        />
        {/* Desirability Badge */}
        <div className="absolute top-2 left-2 bg-card/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-md">
          <div className="flex items-center gap-1">
            <TrendingUp className={`w-3 h-3 ${desirabilityInfo.color}`} />
            <span className={`text-xs font-bold ${desirabilityInfo.color}`}>
              {property.desirabilityScore}/100
            </span>
          </div>
        </div>
      </div>

      {/* Price & BER */}
      <div className="px-4 pt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-foreground">
            Price: €{property.price.toLocaleString()}
          </span>
          <span className={`ber-badge ${berColorMap[property.berColor]}`}>
            BER {property.berRating}
          </span>
        </div>
        
        {property.predictedPrice && property.price < property.predictedPrice * 0.95 && (
          <div className="flex items-center gap-1 text-xs text-green-600 font-bold bg-green-50 w-fit px-2 py-0.5 rounded border border-green-200">
            <Sparkles className="w-3 h-3" />
            Great Deal! (AI Predicted Price: €{property.predictedPrice.toLocaleString()})
          </div>
        )}
      </div>

      {/* Address */}
      <div className="px-4 pt-2 pb-3 border-b border-border">
        <p className="font-bold text-sm text-foreground">{property.title}</p>
        <p className="text-sm text-muted-foreground">{property.address}</p>
      </div>

      {/* Details */}
      <div className="px-4 py-3 flex items-center justify-between text-sm text-muted-foreground border-b border-border">
        <span className="flex items-center gap-1.5">
          <Bed className="w-4 h-4" />
          {property.beds} beds
        </span>
        <span className="flex items-center gap-1.5">
          <Bath className="w-4 h-4" />
          {property.baths} baths
        </span>
        <span className="flex items-center gap-1.5">
          <Maximize className="w-4 h-4" />
          {property.sqm} sqm
        </span>
      </div>

      {/* Amenities */}
      <div className="px-4 py-2 text-xs space-y-1 border-b border-border">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Park:</span>
          <span className="font-semibold">{formatDistance(property.nearestAmenities.park.distanceM)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Bus:</span>
          <span className="font-semibold">{formatDistance(property.nearestAmenities.busStation.distanceM)}</span>
        </div>
      </div>

      {/* View Property */}
      <div className="px-4 py-3 text-center">
        <a 
          href={`/property/${property.slug}`} 
          className="view-property-link"
          onClick={(e) => e.stopPropagation()}
        >
          VIEW PROPERTY <ChevronRight className="w-3 h-3" />
        </a>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
