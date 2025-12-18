import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

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

async function checkData() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const equipment = await Equipment.find();
    console.log(`\nTotal equipment found: ${equipment.length}\n`);
    
    equipment.forEach((item, index) => {
      console.log(`Equipment ${index + 1}:`);
      console.log('  ID:', item._id);
      console.log('  Name:', item.name || '(empty)');
      console.log('  Type:', item.type || '(empty)');
      console.log('  Status:', item.status || '(empty)');
      console.log('  Location:', item.location || '(empty)');
      console.log('  Last Inspection:', item.lastInspection || '(empty)');
      console.log('  Next Inspection:', item.nextInspection || '(empty)');
      console.log('');
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkData();

