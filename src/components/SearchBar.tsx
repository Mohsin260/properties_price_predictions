import { Search, ChevronDown } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";

const SearchBar = () => {
  const { filters, setFilter } = useSearchStore();
  const showAdvanced = filters.propertyType !== '' || filters.minBeds !== '' || filters.maxBeds !== '' || filters.minBaths !== '' || filters.maxBaths !== '' || filters.minEnergyRating !== '' || filters.onlyUndervalued !== 'false' || filters.minConfidence !== '';

  const priceOptions = ["", "100000", "200000", "300000", "400000", "500000", "600000", "700000", "800000", "900000", "1000000", "1250000", "1500000", "2000000", "3000000", "5000000"];
  const bedOptions = ["", "1", "2", "3", "4", "5", "6", "7"];

  const toggleAdvanced = () => {
    if (showAdvanced) {
      // Reset advanced filters
      setFilter('propertyType', '');
      setFilter('minBeds', '');
      setFilter('maxBeds', '');
      setFilter('minBaths', '');
      setFilter('maxBaths', '');
      setFilter('minEnergyRating', '');
      setFilter('onlyUndervalued', 'false');
      setFilter('minConfidence', '');
    }
  };

  return (
    <div className="bg-search-bar border-b border-border">
      <div className="max-w-full px-6 py-4">
        {/* Main search row */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Search Type</label>
            <select
              value={filters.searchType}
              onChange={(e) => setFilter('searchType', e.target.value)}
              className="search-input text-sm"
            >
              <option>Residential For Sale</option>
              {/* <option>Residential To Let</option>
              <option>Commercial To Let</option>
              <option>Commercial For Sale</option> */}
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Location</label>
            <input
              type="text"
              placeholder="Address or Location"
              value={filters.location}
              onChange={(e) => setFilter('location', e.target.value)}
              className="search-input text-sm"
            />
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Keyword Search</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Title, address, etc."
                value={filters.globalSearch}
                onChange={(e) => setFilter('globalSearch', e.target.value)}
                className="search-input text-sm w-full"
              />
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Sale Price</label>
            <div className="flex gap-2">
              <select 
                value={filters.minPrice} 
                onChange={(e) => setFilter('minPrice', e.target.value)} 
                className="search-input text-sm w-28"
              >
                <option value="">No Min</option>
                {priceOptions.filter(p => p).map((p) => (
                  <option key={p} value={p}>€{(Number(p) / 1000).toLocaleString()}k</option>
                ))}
              </select>
              <select 
                value={filters.maxPrice} 
                onChange={(e) => setFilter('maxPrice', e.target.value)} 
                className="search-input text-sm w-28"
              >
                <option value="">No Max</option>
                {priceOptions.filter(p => p).map((p) => (
                  <option key={p} value={p}>€{(Number(p) / 1000).toLocaleString()}k</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button 
              className="bg-accent text-accent-foreground px-8 py-2.5 rounded font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap"
              disabled
            >
              Live Search Active
            </button>
          </div>
        </div>

        {/* Advanced search toggle */}
        {/* <button
          onClick={toggleAdvanced}
          className="mt-3 text-accent text-xs font-bold uppercase tracking-wider flex items-center gap-1 ml-auto"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Search
          <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button> */}

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Property Type</label>
              <select 
                value={filters.propertyType} 
                onChange={(e) => setFilter('propertyType', e.target.value)} 
                className="search-input text-sm"
              >
                <option value="">All Types</option>
                <option>Apartment</option>
                <option>House</option>
                <option>Detached House</option>
                <option>End Terrace House</option>
                <option>Duplex</option>
                <option>Bungalow</option>
                <option>Cottage</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Min Energy Rating</label>
              <select 
                value={filters.minEnergyRating}
                onChange={(e) => setFilter('minEnergyRating', e.target.value)}
                className="search-input text-sm"
              >
                <option value="">All</option>
                <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>F</option><option>G</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Bedrooms</label>
              <div className="flex gap-2">
                <select 
                  value={filters.minBeds} 
                  onChange={(e) => setFilter('minBeds', e.target.value)} 
                  className="search-input text-sm flex-1"
                >
                  <option value="">No Min</option>
                  {bedOptions.filter(b => b).map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <select 
                  value={filters.maxBeds} 
                  onChange={(e) => setFilter('maxBeds', e.target.value)} 
                  className="search-input text-sm flex-1"
                >
                  <option value="">No Max</option>
                  {bedOptions.filter(b => b).map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Bathrooms</label>
              <div className="flex gap-2">
                <select 
                  value={filters.minBaths}
                  onChange={(e) => setFilter('minBaths', e.target.value)}
                  className="search-input text-sm flex-1"
                >
                  <option value="">No Min</option><option>1</option><option>2</option><option>3</option>
                </select>
                <select 
                  value={filters.maxBaths}
                  onChange={(e) => setFilter('maxBaths', e.target.value)}
                  className="search-input text-sm flex-1"
                >
                  <option value="">No Max</option><option>1</option><option>2</option><option>3</option>
                </select>
              </div>
            </div>
            
            {/* AI Valuation Filters */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-accent tracking-wider uppercase flex items-center gap-1">
                AI Valuation
              </label>
              <select 
                value={filters.onlyUndervalued} 
                onChange={(e) => setFilter('onlyUndervalued', e.target.value)} 
                className="search-input text-sm border-accent/30 bg-accent/5"
              >
                <option value="false">All Properties</option>
                <option value="true">Undervalued Only</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-accent tracking-wider uppercase flex items-center gap-1">
                AI Confidence
              </label>
              <select 
                value={filters.minConfidence} 
                onChange={(e) => setFilter('minConfidence', e.target.value)} 
                className="search-input text-sm border-accent/30 bg-accent/5"
              >
                <option value="">Any Confidence</option>
                <option value="60">&gt; 60% Confidence</option>
                <option value="70">&gt; 70% Confidence</option>
                <option value="80">&gt; 80% Confidence</option>
                <option value="90">&gt; 90% Confidence</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
