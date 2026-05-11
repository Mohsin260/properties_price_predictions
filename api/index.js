import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import Property from './models/Property.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connection caching for serverless environments
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI, { dbName: 'properties' });
    isConnected = db.connections[0].readyState;
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};

// Routes
app.get('/api/properties', async (req, res) => {
  await connectDB();
  try {
    const { 
      location, 
      minPrice, 
      maxPrice, 
      minBeds, 
      maxBeds, 
      minBaths, 
      maxBaths, 
      propertyType, 
      minEnergyRating,
      onlyUndervalued,
      minConfidence,
      globalSearch
    } = req.query;

    const query = {};

    if (globalSearch) {
      query.$or = [
        { title: { $regex: globalSearch, $options: 'i' } },
        { address: { $regex: globalSearch, $options: 'i' } },
        { type: { $regex: globalSearch, $options: 'i' } }
      ];
    }

    if (location && location !== 'Dublin') {
      query.address = { $regex: location, $options: 'i' };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (minBeds || maxBeds) {
      query.beds = {};
      if (minBeds) query.beds.$gte = Number(minBeds);
      if (maxBeds) query.beds.$lte = Number(maxBeds);
    }

    if (minBaths || maxBaths) {
      query.baths = {};
      if (minBaths) query.baths.$gte = Number(minBaths);
      if (maxBaths) query.baths.$lte = Number(maxBaths);
    }

    if (propertyType) {
      query.type = propertyType;
    }

    if (minEnergyRating) {
      const ratingOrder = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];
      const minIndex = ratingOrder.indexOf(minEnergyRating);
      const acceptableRatings = ratingOrder.slice(minIndex);
      query.berRating = { $regex: new RegExp(`^[${acceptableRatings.join('')}]`, 'i') };
    }

    if (onlyUndervalued === 'true') {
      query.$expr = {
        $and: [
          { $gt: ["$predictedPrice", 0] },
          { $lt: ["$price", { $multiply: ["$predictedPrice", 0.95] }] }
        ]
      };
    }

    if (minConfidence) {
      query.confidencePct = { $gte: Number(minConfidence) };
    }

    const properties = await Property.find(query).sort({ id: 1 }).limit(100); // Limit results for performance on serverless
    res.json(properties);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/api/properties/:slug', async (req, res) => {
  await connectDB();
  try {
    const property = await Property.findOne({ slug: req.params.slug });
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Export the app for Vercel
export default app;
