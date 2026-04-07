import { Search } from "lucide-react";
import { useState } from "react";

const navItems = ["BUY", "SELL", "RENT", "VALUATIONS", "MORTGAGES", "COMMERCIAL", "RESEARCH", "CONTACT"];

const SiteHeader = () => {
  const [siteSearch, setSiteSearch] = useState("");

  return (
    <>
      {/* Top bar */}
      <div className="bg-primary py-1.5 px-4">
        <div className="max-w-[1800px] mx-auto flex justify-end gap-6">
          <span className="text-primary-foreground/80 text-xs font-semibold tracking-wide cursor-pointer hover:text-primary-foreground transition-colors">
            ABOUT SHERRY FITZGERALD
          </span>
          <span className="text-primary-foreground/40">|</span>
          <span className="text-primary-foreground/80 text-xs font-semibold tracking-wide cursor-pointer hover:text-primary-foreground transition-colors">
            NORTHERN IRELAND
          </span>
        </div>
      </div>

      {/* Main nav */}
      <header className="bg-nav px-4 py-3">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <div className="font-display text-nav-foreground text-xl font-bold italic tracking-tight">
            Sherry FitzGerald
          </div>

          <nav className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <a key={item} href="#" className="nav-link text-xs">
                {item}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center bg-nav-foreground/10 rounded px-3 py-1.5">
            <input
              type="text"
              placeholder="SITE SEARCH"
              value={siteSearch}
              onChange={(e) => setSiteSearch(e.target.value)}
              className="bg-transparent text-nav-foreground text-xs placeholder:text-nav-foreground/60 outline-none w-32"
            />
            <Search className="w-4 h-4 text-nav-foreground/60" />
          </div>
        </div>
      </header>
    </>
  );
};

export default SiteHeader;
