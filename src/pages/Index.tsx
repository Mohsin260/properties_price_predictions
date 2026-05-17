import { useState, useMemo } from "react";
import SiteHeader from "@/components/SiteHeader";
import SearchBar from "@/components/SearchBar";
import PropertyCard from "@/components/PropertyCard";
import PropertyPagination from "@/components/Pagination";
import MapWrapper from "@/components/maps/shared/MapWrapper";
import Footer from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { modelMetadata } from "@/data/dublinProperties";
import { usePropertyStore } from "@/store/propertyStore";
import { useSearchStore } from "@/store/searchStore";
import type { Property, SortBy } from "@/types/property.types";
import { Sparkles } from "lucide-react";

const ITEMS_PER_PAGE = 10;

const sortOptions = [
  { label: "AI Best Deal", value: "ai-deal-desc" },
  { label: "Date: Oldest to Newest", value: "date-asc" },
  { label: "Date: Newest to Oldest", value: "date-desc" },
  { label: "Price: Lowest to Highest", value: "price-asc" },
  { label: "Price: Highest to Lowest", value: "price-desc" },
  { label: "Desirability: Highest to Lowest", value: "desirability-desc" },
  { label: "Best Value (GIS)", value: "value-desc" },
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

  const { data: dublinProperties = [], isLoading, error } = useQuery({
    queryKey: ['properties', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiBase}/api/properties?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch properties');
      }
      return response.json() as Promise<Property[]>;
    }
  });

  // Since filtering is now server-side, filteredProperties is just dublinProperties
  const filteredProperties = dublinProperties;

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
      case "ai-deal-desc":
        return sorted.sort((a, b) => {
          const dealA = a.predictedPrice ? a.predictedPrice / a.price : 0;
          const dealB = b.predictedPrice ? b.predictedPrice / b.price : 0;
          return dealB - dealA;
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

  const handlePropertyClick = (property: Property) => {
    centerMapOnProperty(property);
  };

  const handlePropertyHover = (property: Property | null) => {
    setHoveredProperty(property?.id || null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SiteHeader />
      <SearchBar />

      {/* Model Info Banner */}
      <div className="bg-gradient-to-r from-accent/5 via-accent/10 to-accent/5 border-b border-accent/20">
        <div className="max-w-full px-6 py-2 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-bold text-accent">{modelMetadata.model}</span>
            <span className="text-xs text-muted-foreground">|</span>
            <span className="text-xs text-muted-foreground">{modelMetadata.n_predictions.toLocaleString()} predictions</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>MAPE: <strong className="text-foreground">{modelMetadata.mape}%</strong></span>
            <span>Median APE: <strong className="text-foreground">{modelMetadata.median_ape}%</strong></span>
            <span>Period: <strong className="text-foreground">{modelMetadata.test_set_period}</strong></span>
          </div>
        </div>
      </div>

      <main className="flex-1 flex">
        <div className="max-w-full w-full flex">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center h-[calc(100vh-240px)]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : error ? (
            <div className="flex-1 flex items-center justify-center h-[calc(100vh-240px)]">
              <p className="text-destructive font-semibold">Error loading properties.</p>
            </div>
          ) : (
            <>
              {/* Properties Container - Scrollable */}
              <div className="w-full lg:w-[70%] flex flex-col h-[calc(100vh-240px)] overflow-hidden">
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
          <div className="hidden lg:block w-full lg:w-[30%] h-[calc(100vh-240px)]">
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
        </>
        )}
      </div>
    </main>

      <Footer />
    </div>
  );
};

export default Index;
