import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qms';
mongoose.connect(MONGODB_URI, {
  retryWrites: true,
  w: 'majority'
})
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    console.log('Connection string format (without password):', MONGODB_URI.replace(/:[^:@]+@/, ':****@'));
  });

// Equipment Schema
const equipmentSchema = new mongoose.Schema({
  name: String,
  type: String,
  status: { type: String, default: 'Active' },
  lastInspection: Date,
  nextInspection: Date,
  location: String,
  maintenanceHistory: [{
    date: Date,
    documentation: String,
    technician: String,
    notes: String
  }]
}, { timestamps: true });

const Equipment = mongoose.model('Equipment', equipmentSchema);

// Routes

// Get all equipment
app.get('/api/equipment', async (req, res) => {
  try {
    const equipment = await Equipment.find().lean();
    console.log('Returning equipment:', equipment.length, 'items');
    if (equipment.length > 0) {
      console.log('First item fields:', Object.keys(equipment[0]));
      console.log('First item data:', equipment[0]);
    }
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single equipment
app.get('/api/equipment/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    res.json(equipment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create equipment
app.post('/api/equipment', async (req, res) => {
  try {
    const equipment = new Equipment(req.body);
    await equipment.save();
    res.status(201).json(equipment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update equipment
app.put('/api/equipment/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findById(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    
    // Update basic fields
    if (req.body.name !== undefined) equipment.name = req.body.name;
    if (req.body.type !== undefined) equipment.type = req.body.type;
    if (req.body.status !== undefined) equipment.status = req.body.status;
    if (req.body.location !== undefined) equipment.location = req.body.location;
    if (req.body.lastInspection !== undefined) {
      equipment.lastInspection = req.body.lastInspection ? new Date(req.body.lastInspection) : null;
    }
    if (req.body.nextInspection !== undefined) {
      equipment.nextInspection = req.body.nextInspection ? new Date(req.body.nextInspection) : null;
    }
    
    // Handle maintenanceHistory - replace the entire array
    if (req.body.maintenanceHistory !== undefined && Array.isArray(req.body.maintenanceHistory)) {
      equipment.maintenanceHistory = req.body.maintenanceHistory.map(entry => ({
        date: entry.date ? new Date(entry.date) : new Date(),
        documentation: entry.documentation || '',
        technician: entry.technician || '',
        notes: entry.notes || ''
      }));
    }
    
    await equipment.save();
    
    console.log('Equipment updated:', equipment._id);
    console.log('Maintenance history count:', equipment.maintenanceHistory?.length || 0);
    if (equipment.maintenanceHistory && equipment.maintenanceHistory.length > 0) {
      console.log('Latest entry:', equipment.maintenanceHistory[equipment.maintenanceHistory.length - 1]);
    }
    
    res.json(equipment);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ error: error.message });
  }
});

// Delete equipment
app.delete('/api/equipment/:id', async (req, res) => {
  try {
    const equipment = await Equipment.findByIdAndDelete(req.params.id);
    if (!equipment) return res.status(404).json({ error: 'Equipment not found' });
    res.json({ message: 'Equipment deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Dashboard stats
app.get('/api/dashboard', async (req, res) => {
  try {
    const total = await Equipment.countDocuments();
    const active = await Equipment.countDocuments({ status: 'Active' });
    const maintenance = await Equipment.countDocuments({ status: 'Maintenance' });
    const inactive = await Equipment.countDocuments({ status: 'Inactive' });
    
    res.json({ total, active, maintenance, inactive });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

