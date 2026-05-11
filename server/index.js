import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Property from './models/Property.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { dbName: 'properties' })
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Seed data if empty
    try {
      const count = await Property.countDocuments();
      if (count === 0) {
        console.log('Database is empty. Seeding data from JSON...');
        const dataPath = path.join(__dirname, '../src/data/processed_properties.json');
        
        if (fs.existsSync(dataPath)) {
          const rawData = fs.readFileSync(dataPath, 'utf8');
          const properties = JSON.parse(rawData);
          
          console.log(`Found ${properties.length} properties to seed.`);
          // Using insertMany for bulk insertion. Using ordered: false to continue if there are duplicates
          await Property.insertMany(properties, { ordered: false }).catch(err => {
            console.error('Some errors occurred during insertion:', err.message);
          });
          console.log('Database seeding completed!');
        } else {
          console.log('Could not find processed_properties.json to seed.');
        }
      } else {
        console.log(`Database already has ${count} properties.`);
      }
    } catch (err) {
      console.error('Error during database seeding:', err);
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/api/properties', async (req, res) => {
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

    // Global Search (title, address, type)
    if (globalSearch) {
      query.$or = [
        { title: { $regex: globalSearch, $options: 'i' } },
        { address: { $regex: globalSearch, $options: 'i' } },
        { type: { $regex: globalSearch, $options: 'i' } }
      ];
    }

    // Location
    if (location && location !== 'Dublin') {
      query.address = { $regex: location, $options: 'i' };
    }

    // Price
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Beds
    if (minBeds || maxBeds) {
      query.beds = {};
      if (minBeds) query.beds.$gte = Number(minBeds);
      if (maxBeds) query.beds.$lte = Number(maxBeds);
    }

    // Baths
    if (minBaths || maxBaths) {
      query.baths = {};
      if (minBaths) query.baths.$gte = Number(minBaths);
      if (maxBaths) query.baths.$lte = Number(maxBaths);
    }

    // Property Type
    if (propertyType) {
      query.type = propertyType;
    }

    // Energy Rating (BER)
    if (minEnergyRating) {
      const ratingOrder = ['G', 'F', 'E', 'D', 'C', 'B', 'A'];
      const minIndex = ratingOrder.indexOf(minEnergyRating);
      const acceptableRatings = ratingOrder.slice(minIndex);
      // Regex to match any of the acceptable ratings at the start of the string
      query.berRating = { $regex: new RegExp(`^[${acceptableRatings.join('')}]`, 'i') };
    }

    // AI Valuation
    if (onlyUndervalued === 'true') {
      // Must have a predicted price and current price must be < 95% of predicted price
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

    const properties = await Property.find(query).sort({ id: 1 });
    res.json(properties);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/api/properties/:slug', async (req, res) => {
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

app.get('/api/properties/id/:id', async (req, res) => {
  try {
    const property = await Property.findOne({ id: Number(req.params.id) });
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

// Serve static files from the Vite build in production
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Handle SPA routing - send all other requests to index.html
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
