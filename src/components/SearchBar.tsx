import { Search, ChevronDown } from "lucide-react";
import { useSearchStore } from "@/store/searchStore";

const SearchBar = () => {
  const { filters, setFilter } = useSearchStore();
  const showAdvanced = filters.propertyType !== '' || filters.minBeds !== '' || filters.maxBeds !== '' || filters.minBaths !== '' || filters.maxBaths !== '' || filters.minEnergyRating !== '';

  const priceOptions = ["", "500", "600", "700", "750", "800", "900", "1000", "1250", "1500", "1750", "2000", "2500", "3000", "3500", "4000", "5000", "7000"];
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
    }
  };

  return (
    <div className="bg-search-bar border-b border-border">
      <div className="max-w-[1800px] mx-auto px-4 py-4">
        {/* Main search row */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Search Type</label>
            <select
              value={filters.searchType}
              onChange={(e) => setFilter('searchType', e.target.value)}
              className="search-input text-sm"
            >
              <option>Residential To Let</option>
              <option>Residential For Sale</option>
              <option>Commercial To Let</option>
              <option>Commercial For Sale</option>
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

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Price Per Month</label>
            <div className="flex gap-2">
              <select 
                value={filters.minPrice} 
                onChange={(e) => setFilter('minPrice', e.target.value)} 
                className="search-input text-sm w-28"
              >
                <option value="">No Min</option>
                {priceOptions.filter(p => p).map((p) => (
                  <option key={p} value={p}>€{Number(p).toLocaleString()}</option>
                ))}
              </select>
              <select 
                value={filters.maxPrice} 
                onChange={(e) => setFilter('maxPrice', e.target.value)} 
                className="search-input text-sm w-28"
              >
                <option value="">No Max</option>
                {priceOptions.filter(p => p).map((p) => (
                  <option key={p} value={p}>€{Number(p).toLocaleString()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button 
              className="bg-accent text-accent-foreground px-8 py-2.5 rounded font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
              onClick={() => {
                // Search is reactive, this button is for visual feedback
                console.log('Search filters applied:', filters);
              }}
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Advanced search toggle */}
        <button
          onClick={toggleAdvanced}
          className="mt-3 text-accent text-xs font-bold uppercase tracking-wider flex items-center gap-1 ml-auto"
        >
          {showAdvanced ? 'Hide' : 'Show'} Advanced Search
          <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

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
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
