import fs from 'fs';
import path from 'path';

const inputPath = path.join(import.meta.dirname, '../src/data/properties_predictions.json');
const outputPath = path.join(import.meta.dirname, '../src/data/processed_properties.json');

console.log('Reading properties predictions...');
const rawData = fs.readFileSync(inputPath, 'utf8');
const allProperties = JSON.parse(rawData);

// Take a subset to ensure performance (e.g., 1000 properties)
// We take a larger slice of recent properties and then shuffle to get variety
const recentProperties = allProperties
  .filter(p => p.year >= 2020)
  .slice(0, 5000);

const propertiesToProcess = recentProperties
  .sort(() => 0.5 - Math.random()) // Shuffle
  .slice(0, 1000);

console.log(`Processing ${propertiesToProcess.length} properties...`);

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

const shapKeyMap = {
  'local_median_log': 'Local Median Price',
  'district_code': 'Neighborhood Profile',
  'year': 'Market Timing',
  'is_new': 'Property Condition',
  'dist_park_km': 'Proximity to Greenery',
  'dist_cycle_track_km': 'Cycling Infrastructure',
  'dist_parking_km': 'Parking Availability',
  'crime_count': 'Area Safety',
  'latitude': 'Geographic Location',
  'longitude': 'Geographic Location',
  'local_sale_count': 'Market Activity',
  'resale_count': 'Property History',
  'is_apartment': 'Property Type',
  'quarter': 'Seasonal Trends',
  'month': 'Seasonal Trends'
};

function formatShapFactors(shapString) {
  if (!shapString) return '';
  return shapString.split(';').map(factor => {
    const [key, value] = factor.split(':').map(s => s.trim());
    const label = shapKeyMap[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return `${label}: ${value}`;
  }).join('; ');
}

const apartmentImages = [
  'https://images.unsplash.com/photo-1545324418-cc41bb5b0968?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1515263487990-61f08bd0960a?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1502672027447-7597382401cd?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200'
];

const houseImages = [
  'https://images.unsplash.com/photo-1570129477035-9b4c090a845e?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1572120339574-6382511fe08c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1583608205727-5a30af3fe273?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200'
];

function getPointAtDistance(lat, lng, distKm) {
  // Rough approximation for small distances
  const angle = Math.random() * Math.PI * 2;
  const dLat = (distKm * Math.cos(angle)) / 111.32;
  const dLon = (distKm * Math.sin(angle)) / (111.32 * Math.cos(lat * (Math.PI / 180)));
  return { lat: lat + dLat, lng: lng + dLon };
}

const processedProperties = propertiesToProcess.map((p, index) => {
  const isApartment = p.is_apartment === 1;
  const propertyType = isApartment ? 'Apartment' : 'House';
  
  // Randomly pick an image from the variety
  const pool = isApartment ? apartmentImages : houseImages;
  const mainImageIndex = index % pool.length;
  const secondaryImageIndex = (index + 1) % pool.length;
  const thirdImageIndex = (index + 2) % pool.length;
  
  const images = [pool[mainImageIndex], pool[secondaryImageIndex], pool[thirdImageIndex]];
  
  const parkNames = ['Phoenix Park', 'St Stephens Green', 'Herbert Park', 'Merrion Square', 'Iveagh Gardens', 'Marlay Park', 'Bushy Park', 'Palmerston Park', 'Saint Annes Park', 'Corkagh Park'];
  const busStopNames = ['Dublin Bus Stop 1234', 'Dublin Bus Stop 5678', 'Dublin Bus Stop 9012', 'Dublin Bus Stop 3456', 'Dublin Bus Stop 7890', 'Aircoach Stop', 'Green Line Luas Stop', 'Red Line Luas Stop'];
  
  const parkName = parkNames[index % parkNames.length];
  const busStopName = busStopNames[index % busStopNames.length];
  
  // Procedural generation of beds, baths, sqm based on price and type
  let beds = isApartment ? Math.max(1, Math.floor(p.actual_price / 150000)) : Math.max(2, Math.floor(p.actual_price / 200000));
  beds = Math.min(beds, 6);
  
  const baths = Math.max(1, Math.floor(beds / 2));
  
  const baseSqm = isApartment ? 40 : 80;
  const sqm = baseSqm + (beds * 15) + Math.floor(Math.random() * 20);
  
  // Create a realistic-looking slug and title from the address
  const addressParts = p.address.split(',').map(s => s.trim());
  const title = addressParts[0].split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  const slug = slugify(p.address) + '-' + index;
  
  // Calculate distances and realistic coordinates
  const parkDistKm = p.dist_park_km || (Math.random() * 1.5 + 0.2);
  const busDistKm = p.dist_parking_km || (Math.random() * 0.8 + 0.1); // using parking as proxy for transport
  const cycleDistKm = p.dist_cycle_track_km || (Math.random() * 1.2 + 0.3);
  
  const parkCoords = getPointAtDistance(p.latitude, p.longitude, parkDistKm);
  const busCoords = getPointAtDistance(p.latitude, p.longitude, busDistKm);
  const cycleCoords = getPointAtDistance(p.latitude, p.longitude, cycleDistKm);
  const walkCoords = getPointAtDistance(p.latitude, p.longitude, parkDistKm + 0.1);

  // Crime and Desirability mapping
  const crimeScore = Math.min(100, Math.floor((p.crime_count / 3000) * 100));
  const desirabilityScore = Math.min(100, Math.floor(100 - (crimeScore * 0.3) - (parkDistKm * 20) + (p.local_sale_count / 10)));
  
  return {
    id: index + 1000,
    slug: slug,
    title: title,
    price: p.actual_price,
    address: p.address,
    fullAddress: addressParts,
    coordinates: {
      lat: p.latitude,
      lng: p.longitude
    },
    beds: beds,
    baths: baths,
    sqm: sqm,
    berRating: p.is_new === 1 ? 'A2' : 'C1',
    berColor: p.is_new === 1 ? 'green' : 'yellow',
    images: images,
    description: `A stunning ${propertyType.toLowerCase()} situated at ${p.address}. This property represents a fantastic opportunity in the current market.`,
    features: ['Central Heating', 'Double Glazed Windows', 'Parking', p.is_new === 1 ? 'New Build' : 'Established Area'].filter(Boolean),
    type: propertyType,
    
    nearestAmenities: {
      park: {
        name: parkName,
        distanceM: Math.floor(parkDistKm * 1000),
        walkMinutes: Math.floor((parkDistKm * 1000) / 80),
        coordinates: parkCoords
      },
      cycleTrack: {
        name: 'Local Cycle Route',
        distanceM: Math.floor(cycleDistKm * 1000),
        walkMinutes: Math.floor((cycleDistKm * 1000) / 80),
        coordinates: cycleCoords
      },
      walkingTrack: {
        name: 'Walking Trail',
        distanceM: Math.floor((parkDistKm + 0.1) * 1000),
        walkMinutes: Math.floor(((parkDistKm + 0.1) * 1000) / 80),
        coordinates: walkCoords
      },
      busStation: {
        name: busStopName,
        distanceM: Math.floor(busDistKm * 1000),
        walkMinutes: Math.floor((busDistKm * 1000) / 80),
        coordinates: busCoords,
        routes: ['14', '15', '46A', '145', '155'].slice(0, Math.floor(Math.random() * 3) + 1)
      }
    },
    
    crimeScore: crimeScore,
    desirabilityScore: desirabilityScore,
    pricePerSqm: Math.floor(p.actual_price / sqm),
    
    listedDate: p.sale_date.split('T')[0],
    status: 'available',
    
    // AI Fields
    predictedPrice: p.predicted_price,
    lowerBound: p.lower_bound,
    upperBound: p.upper_bound,
    confidencePct: p.confidence_pct,
    shapTopPositive: formatShapFactors(p.shap_top_positive),
    shapTopNegative: formatShapFactors(p.shap_top_negative)
  };
});

fs.writeFileSync(outputPath, JSON.stringify(processedProperties, null, 2));
console.log(`Successfully wrote ${processedProperties.length} processed properties to ${outputPath}`);
