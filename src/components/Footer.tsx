import { MapPin, Phone, Mail, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-nav text-nav-foreground border-t border-border/20">
      <div className="max-w-[1800px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Sherry FitzGerald</h3>
            <p className="text-nav-foreground/80 text-sm leading-relaxed mb-4">
              Ireland's leading property consultancy with over 40 years of experience in residential and commercial property services.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 bg-nav-foreground/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-nav-foreground/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-nav-foreground/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 bg-nav-foreground/10 rounded-full flex items-center justify-center hover:bg-accent transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-nav-foreground/80 hover:text-accent transition-colors">Buy Property</a></li>
              <li><a href="#" className="text-nav-foreground/80 hover:text-accent transition-colors">Sell Property</a></li>
              <li><a href="#" className="text-nav-foreground/80 hover:text-accent transition-colors">Rent Property</a></li>
              <li><a href="#" className="text-nav-foreground/80 hover:text-accent transition-colors">Property Valuations</a></li>
              <li><a href="#" className="text-nav-foreground/80 hover:text-accent transition-colors">Mortgage Services</a></li>
              <li><a href="#" className="text-nav-foreground/80 hover:text-accent transition-colors">Commercial Property</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-nav-foreground/80 hover:text-accent transition-colors">Property News</a></li>
              <li><a href="#" className="text-nav-foreground/80 hover:text-accent transition-colors">Market Reports</a></li>
              <li><a href="#" className="text-nav-foreground/80 hover:text-accent transition-colors">Area Guides</a></li>
              <li><a href="#" className="text-nav-foreground/80 hover:text-accent transition-colors">Buyer's Guide</a></li>
              <li><a href="#" className="text-nav-foreground/80 hover:text-accent transition-colors">Seller's Guide</a></li>
              <li><a href="#" className="text-nav-foreground/80 hover:text-accent transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-accent flex-shrink-0" />
                <span className="text-nav-foreground/80">
                  123 Grafton Street<br />
                  Dublin 2, D02 XY45<br />
                  Ireland
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-accent flex-shrink-0" />
                <a href="tel:+35312345678" className="text-nav-foreground/80 hover:text-accent transition-colors">
                  +353 1 234 5678
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent flex-shrink-0" />
                <a href="mailto:info@sherryfitz.ie" className="text-nav-foreground/80 hover:text-accent transition-colors">
                  info@sherryfitz.ie
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-nav-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-nav-foreground/60">
            <p>© {new Date().getFullYear()} Sherry FitzGerald. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-accent transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
