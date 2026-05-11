import mongoose from 'mongoose';

const coordinatesSchema = new mongoose.Schema({
  lat: Number,
  lng: Number
}, { _id: false });

const nearestAmenitySchema = new mongoose.Schema({
  name: String,
  distanceM: Number,
  walkMinutes: Number,
  coordinates: coordinatesSchema
}, { _id: false });

const nearestBusStationSchema = new mongoose.Schema({
  name: String,
  distanceM: Number,
  walkMinutes: Number,
  coordinates: coordinatesSchema,
  routes: [String]
}, { _id: false });

const nearestAmenitiesSchema = new mongoose.Schema({
  park: nearestAmenitySchema,
  cycleTrack: nearestAmenitySchema,
  walkingTrack: nearestAmenitySchema,
  busStation: nearestBusStationSchema
}, { _id: false });

const propertySchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  title: String,
  price: Number,
  address: String,
  fullAddress: [String],
  coordinates: coordinatesSchema,
  beds: Number,
  baths: Number,
  sqm: Number,
  berRating: String,
  berColor: String,
  images: [String],
  description: String,
  features: [String],
  type: String,

  // GIS-specific data
  nearestAmenities: nearestAmenitiesSchema,
  crimeScore: Number,
  desirabilityScore: Number,
  pricePerSqm: Number,

  // Metadata
  listedDate: String,
  status: { type: String, enum: ['available', 'pending', 'rented'] },

  // AI Valuation Data
  predictedPrice: Number,
  lowerBound: Number,
  upperBound: Number,
  confidencePct: Number,
  shapTopPositive: String,
  shapTopNegative: String,

  // Prediction-specific fields
  errorPct: Number,
  absErrorPct: Number,
  dateOfSale: String,
  districtCode: Number,
  isNew: Boolean,
  isApartment: Boolean,
  sizeCategory: Number,
  resaleCount: Number,
  distParkKm: Number,
  distParkingKm: Number,
  distCycleTrackKm: Number,
  distSchoolKm: Number,
  distTransportKm: Number,
  crimeCount: Number,
  isSouthDublin: Boolean,
  localMedianLog: Number,
  localSaleCount: Number,
  year: Number,
  quarter: Number,
  month: Number
}, {
  timestamps: true,
  suppressReservedKeysWarning: true
});

export default mongoose.model('Property', propertySchema);
