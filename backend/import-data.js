import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

// Use the same connection string as server.js  
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/qms';

const equipmentSchema = new mongoose.Schema({
  name: String,
  type: String,
  status: { type: String, default: 'Active' },
  lastInspection: Date,
  nextInspection: Date,
  location: String
}, { timestamps: true });

const Equipment = mongoose.model('Equipment', equipmentSchema);

async function importCSV() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Read CSV file
    const csvContent = fs.readFileSync('../sample_equipment.csv', 'utf-8');
    const lines = csvContent.trim().split('\n');
    
    // Skip header row
    const dataLines = lines.slice(1);

    // Clear existing equipment (optional - uncomment to clear before importing)
    // await Equipment.deleteMany({});
    // console.log('Cleared existing equipment');

    // Parse and insert data
    const equipmentData = [];
    
    for (const line of dataLines) {
      if (!line.trim()) continue; // Skip empty lines
      
      const [name, type, status, location, lastInspection, nextInspection] = line.split(',');
      
      if (!name) continue; // Skip if no name
      
      equipmentData.push({
        name: name.trim(),
        type: type.trim(),
        status: status.trim() || 'Active',
        location: location.trim() || '',
        lastInspection: lastInspection ? new Date(lastInspection.trim()) : null,
        nextInspection: nextInspection ? new Date(nextInspection.trim()) : null
      });
    }

    // Insert all equipment
    const result = await Equipment.insertMany(equipmentData);
    console.log(`Successfully imported ${result.length} equipment items`);
    
    await mongoose.disconnect();
    console.log('Import completed');
  } catch (error) {
    console.error('Error importing data:', error);
    process.exit(1);
  }
}

importCSV();

