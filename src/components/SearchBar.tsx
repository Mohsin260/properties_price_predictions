import { Search, ChevronDown } from "lucide-react";
import { useState } from "react";

const SearchBar = () => {
  const [searchType, setSearchType] = useState("Residential To Let");
  const [location, setLocation] = useState("Dublin");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [minBeds, setMinBeds] = useState("");
  const [maxBeds, setMaxBeds] = useState("");
  const [propertyType, setPropertyType] = useState("");

  const priceOptions = ["", "500", "600", "700", "750", "800", "900", "1000", "1250", "1500", "1750", "2000", "2500", "3000", "3500", "4000", "5000", "7000"];
  const bedOptions = ["", "1", "2", "3", "4", "5", "6", "7"];

  return (
    <div className="bg-search-bar border-b border-border">
      <div className="max-w-[1800px] mx-auto px-4 py-4">
        {/* Main search row */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch">
          <div className="flex flex-col gap-1 min-w-[180px]">
            <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Search Type</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
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
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="search-input text-sm"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Price Per Month</label>
            <div className="flex gap-2">
              <select value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="search-input text-sm w-28">
                <option value="">No Min</option>
                {priceOptions.filter(p => p).map((p) => (
                  <option key={p} value={p}>€{Number(p).toLocaleString()}</option>
                ))}
              </select>
              <select value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="search-input text-sm w-28">
                <option value="">No Max</option>
                {priceOptions.filter(p => p).map((p) => (
                  <option key={p} value={p}>€{Number(p).toLocaleString()}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-end">
            <button className="bg-accent text-accent-foreground px-8 py-2.5 rounded font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Advanced search toggle */}
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="mt-3 text-accent text-xs font-bold uppercase tracking-wider flex items-center gap-1 ml-auto"
        >
          Advanced Search
          <ChevronDown className={`w-3 h-3 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
        </button>

        {/* Advanced filters */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Property Type</label>
              <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="search-input text-sm">
                <option value="">All Types</option>
                <option>Apartment</option>
                <option>House</option>
                <option>Duplex</option>
                <option>Bungalow</option>
                <option>Cottage</option>
                <option>Country Homes</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Min Energy Rating</label>
              <select className="search-input text-sm">
                <option>All</option>
                <option>A</option><option>B</option><option>C</option><option>D</option><option>E</option><option>F</option><option>G</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Bedrooms</label>
              <div className="flex gap-2">
                <select value={minBeds} onChange={(e) => setMinBeds(e.target.value)} className="search-input text-sm flex-1">
                  <option value="">No Min</option>
                  {bedOptions.filter(b => b).map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                <select value={maxBeds} onChange={(e) => setMaxBeds(e.target.value)} className="search-input text-sm flex-1">
                  <option value="">No Max</option>
                  {bedOptions.filter(b => b).map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-bold text-muted-foreground tracking-wider uppercase">Bathrooms</label>
              <div className="flex gap-2">
                <select className="search-input text-sm flex-1">
                  <option>No Min</option><option>1</option><option>2</option><option>3</option>
                </select>
                <select className="search-input text-sm flex-1">
                  <option>No Max</option><option>1</option><option>2</option><option>3</option>
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
