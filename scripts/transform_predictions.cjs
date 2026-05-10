/**
 * Transform predictions_5000.json into processed_properties.json
 * Maps the XGBoost prediction data to the Property interface format
 */
const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'src', 'data', 'predictions_5000.json');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'processed_properties.json');
const metadataOutputPath = path.join(__dirname, '..', 'src', 'data', 'model_metadata.json');

const raw = JSON.parse(fs.readFileSync(inputPath, 'utf-8'));
const metadata = raw.metadata;
const predictions = raw.predictions;

// Save model metadata separately
fs.writeFileSync(metadataOutputPath, JSON.stringify(metadata, null, 2));
console.log('Model metadata saved:', metadata);

// --- Helper functions ---

const propertyImages = [
  'https://images.unsplash.com/photo-1545324418-cc41bb5b0968?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1515263487990-61f08bd0960a?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1502672027447-7597382401cd?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&q=80&w=1200'
];

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').substring(0, 80);
}

function getImages(index) {
  const i = index % propertyImages.length;
  return [
    propertyImages[i],
    propertyImages[(i + 3) % propertyImages.length],
    propertyImages[(i + 7) % propertyImages.length]
  ];
}

function extractTitle(address) {
  const parts = address.split(',').map(p => p.trim());
  return parts[0].length > 40 ? parts[0].substring(0, 40) : parts[0];
}

function splitAddress(address) {
  return address.split(',').map(p => p.trim()).filter(Boolean);
}

// Derive beds/baths/sqm from price and property characteristics
function derivePropertyDetails(pred) {
  const price = pred.actual_price;
  const isNew = pred.is_new === 1;
  // Use a seeded approach based on price + location for consistency
  const seed = Math.abs(Math.round(pred.latitude * 1000 + pred.longitude * 1000));
  
  let beds, baths, sqm;
  if (price < 200000) {
    beds = 1; baths = 1; sqm = 35 + (seed % 20);
  } else if (price < 300000) {
    beds = 1 + (seed % 2); baths = 1; sqm = 50 + (seed % 25);
  } else if (price < 450000) {
    beds = 2 + (seed % 2); baths = 1 + (seed % 2); sqm = 65 + (seed % 30);
  } else if (price < 650000) {
    beds = 3 + (seed % 2); baths = 2; sqm = 85 + (seed % 35);
  } else if (price < 900000) {
    beds = 3 + (seed % 2); baths = 2 + (seed % 2); sqm = 110 + (seed % 40);
  } else {
    beds = 4 + (seed % 2); baths = 2 + (seed % 2); sqm = 140 + (seed % 60);
  }
  return { beds, baths, sqm };
}

// BER rating from is_new and year
function deriveBER(pred) {
  if (pred.is_new === 1) {
    const ratings = ['A1', 'A2', 'A3'];
    return { berRating: ratings[Math.abs(Math.round(pred.latitude * 100)) % 3], berColor: 'green' };
  }
  if (pred.year >= 2023) {
    return { berRating: 'B2', berColor: 'green' };
  }
  if (pred.year >= 2021) {
    const r = Math.abs(Math.round(pred.longitude * 100)) % 3;
    const ratings = [['B3', 'green'], ['C1', 'yellow'], ['C2', 'yellow']];
    return { berRating: ratings[r][0], berColor: ratings[r][1] };
  }
  const r = Math.abs(Math.round(pred.latitude * 10 + pred.longitude * 10)) % 4;
  const ratings = [['C2', 'yellow'], ['C3', 'yellow'], ['D1', 'orange'], ['D2', 'orange']];
  return { berRating: ratings[r][0], berColor: ratings[r][1] };
}

// District code to area name mapping
const districtNames = {
  0: 'Dublin', 1: 'Dublin 1', 2: 'Dublin 2', 3: 'Dublin 3', 4: 'Dublin 4',
  5: 'Dublin 5', 6: 'Dublin 6', 7: 'Dublin 7', 8: 'Dublin 8', 9: 'Dublin 9',
  10: 'Dublin 10', 11: 'Dublin 11', 12: 'Dublin 12', 13: 'Dublin 13', 14: 'Dublin 14',
  15: 'Dublin 15', 16: 'Dublin 16', 17: 'Dublin 17', 18: 'Dublin 18', 20: 'Dublin 20',
  22: 'Dublin 22', 24: 'Dublin 24', 30: 'Dún Laoghaire', 31: 'Blackrock',
  32: 'Foxrock/Cabinteely', 33: 'Leopardstown', 34: 'Dundrum',
  38: 'Newcastle', 39: 'Citywest', 41: 'Malahide/Portmarnock',
  45: 'North County Dublin'
};

// Normalize crime_count to 0-100
// Data range: ~317 to ~7700
function normalizeCrime(crimeCount) {
  const minCrime = 300;
  const maxCrime = 8000;
  const score = Math.round(((crimeCount - minCrime) / (maxCrime - minCrime)) * 100);
  return Math.max(0, Math.min(100, score));
}

// Calculate desirability from amenity distances and crime
function calcDesirability(pred, crimeScore) {
  // Score each amenity (closer = better), max 100 each
  const parkScore = Math.max(0, 100 - pred.dist_park_km * 8);
  const cycleScore = Math.max(0, 100 - pred.dist_cycle_track_km * 20);
  const schoolScore = Math.max(0, 100 - pred.dist_school_km * 15);
  const transportScore = Math.max(0, 100 - pred.dist_transport_km * 25);
  const safetyScore = 100 - crimeScore;

  const total = parkScore * 0.2 + cycleScore * 0.15 + schoolScore * 0.15 +
                transportScore * 0.25 + safetyScore * 0.25;
  return Math.round(Math.max(0, Math.min(100, total)));
}

// Generate amenity coordinate near property
function nearbyCoord(lat, lng, distKm, angleDeg) {
  const R = 6371;
  const dLat = (distKm / R) * (180 / Math.PI);
  const dLng = dLat / Math.cos(lat * Math.PI / 180);
  const rad = angleDeg * Math.PI / 180;
  return {
    lat: +(lat + dLat * Math.cos(rad)).toFixed(7),
    lng: +(lng + dLng * Math.sin(rad)).toFixed(7)
  };
}

function walkMinutes(distKm) {
  return Math.round((distKm / 5) * 60);
}

function distMeters(distKm) {
  return Math.round(distKm * 1000);
}

// Generate features list
function generateFeatures(pred) {
  const features = [];
  if (pred.is_new === 1) features.push('New Build');
  else features.push('Established Property');
  features.push('Central Heating');
  features.push('Double Glazed Windows');
  if (pred.dist_park_km < 0.5) features.push('Near Park');
  if (pred.dist_transport_km < 0.3) features.push('Near Public Transport');
  if (pred.dist_school_km < 0.5) features.push('Near Schools');
  if (pred.dist_cycle_track_km < 0.3) features.push('Near Cycle Track');
  if (pred.is_south_dublin === 1) features.push('South Dublin Location');
  if (pred.resale_count > 0) features.push('Previously Sold');
  if (pred.local_sale_count > 50) features.push('Active Market Area');
  features.push('Parking');
  return features.slice(0, 6);
}

// Confidence: inverse of abs_error_pct, capped
function calcConfidence(absErrorPct) {
  if (absErrorPct <= 5) return 95;
  if (absErrorPct <= 10) return 88;
  if (absErrorPct <= 15) return 80;
  if (absErrorPct <= 20) return 72;
  if (absErrorPct <= 30) return 62;
  if (absErrorPct <= 50) return 48;
  return Math.max(20, Math.round(100 - absErrorPct));
}

// Generate SHAP-like explanations from features
function generateShapExplanations(pred) {
  const positives = [];
  const negatives = [];

  if (pred.local_median_log > 13) positives.push('Local Median Price: strong positive influence');
  else negatives.push('Local Median Price: below average area pricing');

  if (pred.is_new === 1) positives.push('New Build: premium condition');
  else negatives.push('Property Age: not a new build');

  if (pred.dist_transport_km < 0.3) positives.push('Transport Access: excellent proximity');
  else if (pred.dist_transport_km > 1) negatives.push('Transport Access: distant from transit');

  if (pred.dist_park_km < 0.5) positives.push('Park Proximity: very close to green space');
  else if (pred.dist_park_km > 3) negatives.push('Park Proximity: far from parks');

  if (pred.is_south_dublin === 1) positives.push('South Dublin: premium location area');
  else negatives.push('North Dublin: lower price area');

  if (pred.local_sale_count > 50) positives.push('Market Activity: high liquidity area');
  else if (pred.local_sale_count < 10) negatives.push('Market Activity: low sales volume');

  if (pred.crime_count < 1500) positives.push('Safety: low crime area');
  else if (pred.crime_count > 3000) negatives.push('Safety: higher crime area');

  return {
    shapTopPositive: positives.slice(0, 3).join('; ') || 'Market conditions: neutral',
    shapTopNegative: negatives.slice(0, 3).join('; ') || 'No significant negative factors'
  };
}

// Property type
function getPropertyType(pred) {
  if (pred.is_apartment === 1) return 'Apartment';
  return 'House';
}

// --- Main transform ---
const filteredPredictions = predictions.filter(pred => pred.error_pct >= -10 && pred.error_pct <= 10);

console.log(`Transforming ${filteredPredictions.length} predictions (filtered from ${predictions.length})...`);

const properties = filteredPredictions.map((pred, index) => {
  const details = derivePropertyDetails(pred);
  const ber = deriveBER(pred);
  const crimeScore = normalizeCrime(pred.crime_count);
  const desirabilityScore = calcDesirability(pred, crimeScore);
  const pricePerSqm = Math.round(pred.actual_price / details.sqm);
  const shap = generateShapExplanations(pred);
  const confidence = calcConfidence(pred.abs_error_pct);
  const errorMargin = pred.abs_error_pct / 100;
  const lowerBound = Math.round(pred.predicted_price * (1 - errorMargin));
  const upperBound = Math.round(pred.predicted_price * (1 + errorMargin));

  const parkCoord = nearbyCoord(pred.latitude, pred.longitude, pred.dist_park_km, 45);
  const transportCoord = nearbyCoord(pred.latitude, pred.longitude, pred.dist_transport_km, 135);
  const cycleCoord = nearbyCoord(pred.latitude, pred.longitude, pred.dist_cycle_track_km, 225);
  const schoolCoord = nearbyCoord(pred.latitude, pred.longitude, pred.dist_school_km, 315);

  const district = districtNames[pred.district_code] || `Dublin District ${pred.district_code}`;

  return {
    id: 1000 + index,
    slug: slugify(pred.address) + '-' + index,
    title: extractTitle(pred.address),
    price: Math.round(pred.actual_price),
    address: pred.address,
    fullAddress: splitAddress(pred.address),
    coordinates: { lat: pred.latitude, lng: pred.longitude },
    beds: details.beds,
    baths: details.baths,
    sqm: details.sqm,
    berRating: ber.berRating,
    berColor: ber.berColor,
    images: getImages(index),
    description: `${getPropertyType(pred)} located at ${pred.address}. ${pred.is_new ? 'This is a new build property' : 'An established property'} in ${district}, sold on ${pred.date_of_sale} for €${Math.round(pred.actual_price).toLocaleString()}. The area has ${pred.local_sale_count} recent local sales. ${pred.dist_transport_km < 0.3 ? 'Excellent transport links nearby.' : ''} ${pred.dist_park_km < 0.5 ? 'Close to green spaces.' : ''}`.trim(),
    features: generateFeatures(pred),
    type: getPropertyType(pred),
    nearestAmenities: {
      park: {
        name: pred.dist_park_km < 1 ? 'Local Park' : 'Nearest Park',
        distanceM: distMeters(pred.dist_park_km),
        walkMinutes: walkMinutes(pred.dist_park_km),
        coordinates: parkCoord
      },
      cycleTrack: {
        name: 'Local Cycle Route',
        distanceM: distMeters(pred.dist_cycle_track_km),
        walkMinutes: walkMinutes(pred.dist_cycle_track_km),
        coordinates: cycleCoord
      },
      walkingTrack: {
        name: 'Nearest School',
        distanceM: distMeters(pred.dist_school_km),
        walkMinutes: walkMinutes(pred.dist_school_km),
        coordinates: schoolCoord
      },
      busStation: {
        name: pred.dist_transport_km < 0.2 ? 'Nearby Transport Stop' : 'Transport Stop',
        distanceM: distMeters(pred.dist_transport_km),
        walkMinutes: walkMinutes(pred.dist_transport_km),
        coordinates: transportCoord,
        routes: pred.district_code < 20 ? ['14', '15', '46A'] : ['33', '41', '75']
      }
    },
    crimeScore,
    desirabilityScore,
    pricePerSqm,
    listedDate: pred.date_of_sale,
    status: 'available',
    predictedPrice: Math.round(pred.predicted_price),
    lowerBound,
    upperBound,
    confidencePct: confidence,
    shapTopPositive: shap.shapTopPositive,
    shapTopNegative: shap.shapTopNegative,
    // New fields from predictions data
    errorPct: pred.error_pct,
    absErrorPct: pred.abs_error_pct,
    dateOfSale: pred.date_of_sale,
    districtCode: pred.district_code,
    isNew: pred.is_new === 1,
    isApartment: pred.is_apartment === 1,
    sizeCategory: pred.size_category,
    resaleCount: pred.resale_count,
    distParkKm: pred.dist_park_km,
    distParkingKm: pred.dist_parking_km,
    distCycleTrackKm: pred.dist_cycle_track_km,
    distSchoolKm: pred.dist_school_km,
    distTransportKm: pred.dist_transport_km,
    crimeCount: pred.crime_count,
    isSouthDublin: pred.is_south_dublin === 1,
    localMedianLog: pred.local_median_log,
    localSaleCount: pred.local_sale_count,
    year: pred.year,
    quarter: pred.quarter,
    month: pred.month
  };
});

fs.writeFileSync(outputPath, JSON.stringify(properties, null, 2));
console.log(`✅ Transformed ${properties.length} properties → ${outputPath}`);
console.log(`   File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
