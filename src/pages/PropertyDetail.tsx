import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Bed, Bath, Maximize, MapPin, TrendingUp, Bus, TreePine, Bike, Shield, Sparkles, TrendingDown, BarChart3, GraduationCap } from 'lucide-react';
import SiteHeader from '@/components/SiteHeader';
import Footer from '@/components/Footer';
import MapWrapper from '@/components/maps/shared/MapWrapper';
import { getPropertyBySlug, modelMetadata } from '@/data/dublinProperties';
import { formatDistance, getDesirabilityLabel, getCrimeLabel } from '@/utils/geoCalculations';

const berColorMap: Record<string, string> = {
  green: "bg-ber-green text-accent-foreground",
  yellow: "bg-ber-yellow text-foreground",
  orange: "bg-ber-orange text-accent-foreground",
  red: "bg-ber-red text-accent-foreground",
};

const PropertyDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const property = slug ? getPropertyBySlug(slug) : undefined;

  if (!property) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <div className="max-w-[1400px] mx-auto px-4 py-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Property Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="text-accent hover:underline"
          >
            Return to listings
          </button>
        </div>
      </div>
    );
  }

  const desirabilityInfo = getDesirabilityLabel(property.desirabilityScore);
  const crimeInfo = getCrimeLabel(property.crimeScore);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      
      <main className="max-w-[1800px] mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-accent hover:underline mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to listings
        </button>

        {/* Image Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="md:col-span-2 h-[400px] rounded-lg overflow-hidden">
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200';
              }}
            />
          </div>
          {property.images.slice(1, 3).map((img, i) => (
            <div key={i} className="h-[200px] rounded-lg overflow-hidden">
              <img
                src={img}
                alt={`${property.title} - ${i + 2}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200';
                }}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="font-display text-3xl font-bold mb-2">{property.title}</h1>
              <p className="text-muted-foreground mb-4">{property.address}</p>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-accent">
                  €{property.price.toLocaleString()}
                </span>
                <span className={`ber-badge ${berColorMap[property.berColor]}`}>
                  BER {property.berRating}
                </span>
              </div>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="text-center">
                <Bed className="w-6 h-6 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold">{property.beds}</p>
                <p className="text-sm text-muted-foreground">Bedrooms</p>
              </div>
              <div className="text-center">
                <Bath className="w-6 h-6 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold">{property.baths}</p>
                <p className="text-sm text-muted-foreground">Bathrooms</p>
              </div>
              <div className="text-center">
                <Maximize className="w-6 h-6 mx-auto mb-2 text-accent" />
                <p className="text-2xl font-bold">{property.sqm}</p>
                <p className="text-sm text-muted-foreground">sqm</p>
              </div>
            </div>

            {/* Prediction Data Card */}
            {property.districtCode !== undefined && (
              <div className="p-6 bg-card border border-border rounded-lg">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-accent" />
                  Property Data (from Model)
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Sale Date</p>
                    <p className="font-bold">{property.dateOfSale ? new Date(property.dateOfSale).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">District Code</p>
                    <p className="font-bold">{property.districtCode}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Property Type</p>
                    <p className="font-bold">{property.isNew ? 'New Build' : 'Resale'} {property.isApartment ? 'Apartment' : 'House'}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Resale Count</p>
                    <p className="font-bold">{property.resaleCount ?? 0}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Crime Count</p>
                    <p className="font-bold">{property.crimeCount?.toLocaleString()}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Location</p>
                    <p className="font-bold">{property.isSouthDublin ? 'South Dublin' : 'North Dublin'}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Local Median (log)</p>
                    <p className="font-bold">{property.localMedianLog?.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Local Sales</p>
                    <p className="font-bold">{property.localSaleCount}</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Sale Period</p>
                    <p className="font-bold">Q{property.quarter} {property.year}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Desirability Score */}
            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Location Desirability Score</h2>
                <div className="flex items-center gap-2">
                  <TrendingUp className={`w-6 h-6 ${desirabilityInfo.color}`} />
                  <span className={`text-3xl font-bold ${desirabilityInfo.color}`}>
                    {property.desirabilityScore}/100
                  </span>
                </div>
              </div>
              <p className={`text-lg font-semibold ${desirabilityInfo.color} mb-4`}>
                {desirabilityInfo.label}
              </p>
              <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                  style={{ width: `${property.desirabilityScore}%` }}
                />
              </div>
            </div>

            {/* Nearby Amenities - using real distance data */}
            <div className="p-6 bg-card border border-border rounded-lg">
              <h2 className="text-xl font-bold mb-4">Nearby Amenities</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <TreePine className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold">{property.nearestAmenities.park.name}</p>
                      <p className="text-sm text-muted-foreground">Park ({property.distParkKm?.toFixed(2)} km)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatDistance(property.nearestAmenities.park.distanceM)}</p>
                    <p className="text-sm text-muted-foreground">{property.nearestAmenities.park.walkMinutes} min walk</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bus className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">{property.nearestAmenities.busStation.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Transport ({property.distTransportKm?.toFixed(2)} km)
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatDistance(property.nearestAmenities.busStation.distanceM)}</p>
                    <p className="text-sm text-muted-foreground">{property.nearestAmenities.busStation.walkMinutes} min walk</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bike className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-semibold">{property.nearestAmenities.cycleTrack.name}</p>
                      <p className="text-sm text-muted-foreground">Cycle Track ({property.distCycleTrackKm?.toFixed(2)} km)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatDistance(property.nearestAmenities.cycleTrack.distanceM)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-semibold">{property.nearestAmenities.walkingTrack.name}</p>
                      <p className="text-sm text-muted-foreground">School ({property.distSchoolKm?.toFixed(2)} km)</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatDistance(property.nearestAmenities.walkingTrack.distanceM)}</p>
                  </div>
                </div>

                {/* Parking distance */}
                {property.distParkingKm !== undefined && (
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-semibold">Nearest Parking</p>
                        <p className="text-sm text-muted-foreground">Accessible Parking</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatDistance(Math.round(property.distParkingKm * 1000))}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Crime Score */}
            <div className="p-6 bg-card border border-border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-muted-foreground" />
                  <h2 className="text-xl font-bold">Crime Rate</h2>
                </div>
                <span className={`text-lg font-bold ${crimeInfo.color}`}>
                  {crimeInfo.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Crime Score: {property.crimeScore}/100 (lower is better) · Raw count: {property.crimeCount?.toLocaleString()}
              </p>
            </div>

            {/* Description */}
            <div className="p-6 bg-card border border-border rounded-lg">
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed">{property.description}</p>
            </div>

            {/* Features */}
            <div className="p-6 bg-card border border-border rounded-lg">
              <h2 className="text-xl font-bold mb-4">Features</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {property.features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-accent rounded-full" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="p-6 bg-card border border-border rounded-lg sticky top-4">
              <h3 className="text-lg font-bold mb-4">Interested in this property?</h3>
              <button className="w-full bg-accent text-accent-foreground py-3 rounded font-bold hover:opacity-90 transition-opacity mb-3">
                Request Viewing
              </button>
              <button className="w-full border border-border py-3 rounded font-bold hover:bg-muted transition-colors">
                Contact Agent
              </button>
              
              <div className="mt-6 pt-6 border-t border-border space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Type:</span>
                  <span className="font-semibold">{property.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per sqm:</span>
                  <span className="font-semibold">€{property.pricePerSqm}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sale Date:</span>
                  <span className="font-semibold">
                    {new Date(property.listedDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* AI Valuation Card */}
            {property.predictedPrice && (
              <div className="p-6 bg-card border border-accent/30 rounded-lg relative overflow-hidden shadow-[0_0_15px_rgba(var(--accent),0.1)]">
                <div className="absolute top-0 right-0 p-3 opacity-10">
                  <Sparkles className="w-24 h-24 text-accent" />
                </div>
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <Sparkles className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-bold">AI Valuation Model</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-4">{modelMetadata.model} · {modelMetadata.n_predictions.toLocaleString()} predictions</p>
                
                <div className="mb-4 relative z-10">
                  <p className="text-sm text-muted-foreground mb-1">Predicted Value</p>
                  <p className="text-3xl font-bold text-accent">€{property.predictedPrice.toLocaleString()}</p>
                </div>

                {/* Error info */}
                {property.errorPct !== undefined && (
                  <div className="mb-4 relative z-10 flex gap-3">
                    <div className="flex-1 p-2 bg-muted rounded">
                      <p className="text-xs text-muted-foreground">Error</p>
                      <p className={`font-bold text-sm ${property.errorPct > 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {property.errorPct > 0 ? '+' : ''}{property.errorPct}%
                      </p>
                    </div>
                    <div className="flex-1 p-2 bg-muted rounded">
                      <p className="text-xs text-muted-foreground">Abs Error</p>
                      <p className="font-bold text-sm">{property.absErrorPct}%</p>
                    </div>
                    <div className="flex-1 p-2 bg-muted rounded">
                      <p className="text-xs text-muted-foreground">Confidence</p>
                      <p className="font-bold text-sm text-accent">{property.confidencePct}%</p>
                    </div>
                  </div>
                )}
                
                {property.lowerBound && property.upperBound && (
                  <div className="mb-4 relative z-10">
                    <p className="text-sm text-muted-foreground mb-1">Confidence Interval ({property.confidencePct || 80}%)</p>
                    <p className="font-semibold">€{property.lowerBound.toLocaleString()} - €{property.upperBound.toLocaleString()}</p>
                  </div>
                )}
                
                {(property.shapTopPositive || property.shapTopNegative) && (
                  <div className="mt-4 pt-4 border-t border-border relative z-10 space-y-3">
                    <p className="text-sm font-semibold">Key Price Drivers:</p>
                    
                    {property.shapTopPositive && (
                      <div className="space-y-2">
                        {property.shapTopPositive.split(';').slice(0, 2).map((factor, i) => (
                          <div key={`pos-${i}`} className="flex items-start gap-2 text-sm">
                            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{factor.trim()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {property.shapTopNegative && (
                      <div className="space-y-2 mt-2">
                        {property.shapTopNegative.split(';').slice(0, 2).map((factor, i) => (
                          <div key={`neg-${i}`} className="flex items-start gap-2 text-sm">
                            <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                            <span className="text-muted-foreground">{factor.trim()}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Map */}
            <div className="p-4 bg-card border border-border rounded-lg">
              <h3 className="text-lg font-bold mb-4">Location</h3>
              <MapWrapper
                engine="maplibre"
                properties={[property]}
                selectedPropertyId={property.id}
                viewport={{
                  latitude: property.coordinates.lat,
                  longitude: property.coordinates.lng,
                  zoom: 15
                }}
                showAmenities={true}
                height="400px"
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
