import { useState, useMemo } from "react";
import SiteHeader from "@/components/SiteHeader";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import PropertyPagination from "@/components/Pagination";
import MapWrapper from "@/components/maps/shared/MapWrapper";
import Footer from "@/components/Footer";
import { dublinProperties } from "@/data/dublinProperties";
import { usePropertyStore } from "@/store/propertyStore";
import { useSearchStore } from "@/store/searchStore";
import type { SortBy } from "@/types/property.types";

const ITEMS_PER_PAGE = 10;

const sortOptions = [
  { label: "Choose option", value: "" },
  { label: "Date: Oldest to Newest", value: "date-asc" },
  { label: "Date: Newest to Oldest", value: "date-desc" },
  { label: "Price: Lowest to Highest", value: "price-asc" },
  { label: "Price: Highest to Lowest", value: "price-desc" },
  { label: "Desirability: Highest to Lowest", value: "desirability-desc" },
  { label: "Best Value", value: "value-desc" },
];

const Index = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { 
    sortBy, 
    setSortBy, 
    selectedPropertyId, 
    hoveredPropertyId,
    mapViewport, 
    setHoveredProperty, 
    centerMapOnProperty 
  } = usePropertyStore();
  
  const { filters } = useSearchStore();

  // Apply search filters
  const filteredProperties = useMemo(() => {
    return dublinProperties.filter(property => {
      // Global search - searches in title, address, and type
      if (filters.globalSearch) {
        const searchLower = filters.globalSearch.toLowerCase();
        const matchesGlobal = 
          property.title.toLowerCase().includes(searchLower) ||
          property.address.toLowerCase().includes(searchLower) ||
          property.type.toLowerCase().includes(searchLower);
        if (!matchesGlobal) return false;
      }

      // Location filter
      if (filters.location && filters.location !== 'Dublin') {
        if (!property.address.toLowerCase().includes(filters.location.toLowerCase())) {
          return false;
        }
      }

      // Price filters
      if (filters.minPrice && property.price < Number(filters.minPrice)) return false;
      if (filters.maxPrice && property.price > Number(filters.maxPrice)) return false;

      // Bedroom filters
      if (filters.minBeds && property.beds < Number(filters.minBeds)) return false;
      if (filters.maxBeds && property.beds > Number(filters.maxBeds)) return false;

      // Bathroom filters
      if (filters.minBaths && property.baths < Number(filters.minBaths)) return false;
      if (filters.maxBaths && property.baths > Number(filters.maxBaths)) return false;

      // Property type filter
      if (filters.propertyType && property.type !== filters.propertyType) return false;

      // Energy rating filter (BER)
      if (filters.minEnergyRating) {
        const ratingOrder = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];
        const propertyRatingLetter = property.berRating.charAt(0);
        const minRatingIndex = ratingOrder.indexOf(filters.minEnergyRating);
        const propertyRatingIndex = ratingOrder.indexOf(propertyRatingLetter);
        if (propertyRatingIndex < minRatingIndex) return false;
      }

      // AI Valuation Filters
      if (filters.onlyUndervalued === 'true' && property.predictedPrice) {
        // Must be less than 95% of predicted price to be undervalued
        if (property.price >= property.predictedPrice * 0.95) return false;
      }
      
      if (filters.minConfidence && property.confidencePct) {
        if (property.confidencePct < Number(filters.minConfidence)) return false;
      }

      return true;
    });
  }, [filters]);

  const sortedProperties = useMemo(() => {
    const sorted = [...filteredProperties];
    switch (sortBy) {
      case "price-asc":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-desc":
        return sorted.sort((a, b) => b.price - a.price);
      case "date-asc":
        return sorted.sort((a, b) => new Date(a.listedDate).getTime() - new Date(b.listedDate).getTime());
      case "date-desc":
        return sorted.sort((a, b) => new Date(b.listedDate).getTime() - new Date(a.listedDate).getTime());
      case "desirability-desc":
        return sorted.sort((a, b) => b.desirabilityScore - a.desirabilityScore);
      case "value-desc":
        return sorted.sort((a, b) => {
          const valueA = a.desirabilityScore / a.pricePerSqm;
          const valueB = b.desirabilityScore / b.pricePerSqm;
          return valueB - valueA;
        });
      default:
        return sorted;
    }
  }, [filteredProperties, sortBy]);

  const totalPages = Math.ceil(sortedProperties.length / ITEMS_PER_PAGE);
  const paginatedProperties = sortedProperties.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [filters]);

  const handlePropertyClick = (property: typeof dublinProperties[0]) => {
    centerMapOnProperty(property);
  };

  const handlePropertyHover = (property: typeof dublinProperties[0] | null) => {
    setHoveredProperty(property?.id || null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <SearchBar />

      <main className="flex-1 flex">
        <div className="max-w-[1800px] mx-auto w-full flex">
          {/* Properties Container - Scrollable */}
          <div className="flex-1 flex flex-col h-[calc(100vh-200px)] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border bg-background">
              <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                Properties Available In Dublin
              </h1>
              
              {/* Sort & Pagination */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="search-input text-sm"
                  >
                    {sortOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <PropertyPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>

            {/* Scrollable Property Grid */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
                {paginatedProperties.map((property, i) => (
                  <PropertyCard key={property.id} property={property} index={i} />
                ))}
              </div>
            </div>

            {/* Bottom Pagination */}
            <div className="px-6 py-4 border-t border-border bg-background">
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">
                  Showing page {currentPage} of {totalPages} ({sortedProperties.length} properties)
                </p>
                <PropertyPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </div>

          {/* Full Height Map - Right Side */}
          <div className="hidden lg:block w-[600px] h-[calc(100vh-200px)]">
            <MapWrapper
              engine="maplibre"
              properties={sortedProperties}
              selectedPropertyId={selectedPropertyId}
              hoveredPropertyId={hoveredPropertyId}
              viewport={mapViewport}
              showAmenities={true}
              onPropertyClick={handlePropertyClick}
              onPropertyHover={handlePropertyHover}
              height="100%"
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
