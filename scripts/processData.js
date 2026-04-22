import fs from 'fs';
import path from 'path';

const inputPath = path.join(import.meta.dirname, '../src/data/properties_predictions.json');
const outputPath = path.join(import.meta.dirname, '../src/data/processed_properties.json');

console.log('Reading properties predictions...');
const rawData = fs.readFileSync(inputPath, 'utf8');
const allProperties = JSON.parse(rawData);

// Take a subset to ensure performance (e.g., 500 properties)
// Let's filter for year >= 2020 and take the first 500
const propertiesToProcess = allProperties
  .filter(p => p.year >= 2020)
  .slice(0, 500);

console.log(`Processing ${propertiesToProcess.length} properties...`);

function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

const apartmentImages = [
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1502672260266-1c1e525044c7?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200'
];

const houseImages = [
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1200'
];

const processedProperties = propertiesToProcess.map((p, index) => {
  const isApartment = p.is_apartment === 1;
  const propertyType = isApartment ? 'Apartment' : 'House';
  
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
  
  // Calculate distances (convert km to meters)
  const parkDistanceM = Math.floor((p.dist_park_km || Math.random() * 2) * 1000);
  const cycleDistanceM = Math.floor((p.dist_cycle_track_km || Math.random() * 2) * 1000);
  const busDistanceM = Math.floor((p.dist_parking_km || Math.random() * 1) * 1000); // using parking as proxy
  
  // Crime and Desirability mapping
  // crime_count ranges from ~100 to 3000+
  const crimeScore = Math.min(100, Math.floor((p.crime_count / 3000) * 100));
  const desirabilityScore = Math.min(100, Math.floor(100 - (crimeScore * 0.3) - (parkDistanceM / 50) + (p.local_sale_count / 10)));
  
  // Ensure array
  const images = isApartment ? apartmentImages : houseImages;
  
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
        name: 'Local Park',
        distanceM: parkDistanceM,
        walkMinutes: Math.floor(parkDistanceM / 80),
        coordinates: { lat: p.latitude + 0.005, lng: p.longitude + 0.005 }
      },
      cycleTrack: {
        name: 'Local Cycle Route',
        distanceM: cycleDistanceM,
        walkMinutes: Math.floor(cycleDistanceM / 80),
        coordinates: { lat: p.latitude + 0.003, lng: p.longitude - 0.003 }
      },
      walkingTrack: {
        name: 'Walking Trail',
        distanceM: parkDistanceM + 200,
        walkMinutes: Math.floor((parkDistanceM + 200) / 80),
        coordinates: { lat: p.latitude + 0.006, lng: p.longitude + 0.006 }
      },
      busStation: {
        name: 'Nearest Bus Stop',
        distanceM: busDistanceM,
        walkMinutes: Math.floor(busDistanceM / 80),
        coordinates: { lat: p.latitude - 0.002, lng: p.longitude - 0.002 },
        routes: ['14', '15', '46A'].slice(0, Math.floor(Math.random() * 3) + 1)
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
    shapTopPositive: p.shap_top_positive,
    shapTopNegative: p.shap_top_negative
  };
});

fs.writeFileSync(outputPath, JSON.stringify(processedProperties, null, 2));
console.log(`Successfully wrote ${processedProperties.length} processed properties to ${outputPath}`);
