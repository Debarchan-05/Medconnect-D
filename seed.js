require('dotenv').config();

const mongoose = require('mongoose');
const User = require('./models/user');

const demoUsers = [
  {
    name: 'Amit Kumar',
    phone: '9876543210',
    role: 'patient',
    email: 'amit.kumar@email.com',
    age: 28,
    gender: 'Male'
  },
  {
    name: 'Dr. Rahul Sharma',
    phone: '9123456780',
    role: 'doctor',
    specialization: 'General Physician',
    experience: '10 years',
    fee: 500,
    rating: 4.9,
    reviews: 120
  },
  {
    name: 'Dr. Divya Nair',
    phone: '9000000001',
    role: 'doctor',
    specialization: 'Dermatologist',
    experience: '7 years',
    fee: 600,
    rating: 4.8,
    reviews: 85
  },
  {
    name: 'Dr. Amit Patel',
    phone: '9000000002',
    role: 'doctor',
    specialization: 'Cardiologist',
    experience: '15 years',
    fee: 800,
    rating: 4.9,
    reviews: 200
  },
  {
    name: 'Dr. Suresh Kumar',
    phone: '9000000003',
    role: 'doctor',
    specialization: 'Nutritionist',
    experience: '5 years',
    fee: 400,
    rating: 4.7,
    reviews: 60
  },
  {
    name: 'Sunita Patel',
    phone: '9111111111',
    role: 'patient',
    email: 'sunita@email.com',
    age: 35,
    gender: 'Female'
  },
  {
    name: 'Rajesh Jain',
    phone: '9222222222',
    role: 'patient',
    email: 'rajesh@email.com',
    age: 45,
    gender: 'Male'
  }
];

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error('Missing MONGO_URI in environment');
  }

  const primaryUri = process.env.MONGO_URI;
  const fallbackUri =
    process.env.MONGO_FALLBACK_URI || 'mongodb://127.0.0.1:27017';
  const connectTimeoutMs = Number(process.env.MONGO_CONNECT_TIMEOUT_MS) || 5000;
  const candidates = [{ uri: primaryUri, label: 'primary' }];

  if (fallbackUri && fallbackUri !== primaryUri) {
    candidates.push({ uri: fallbackUri, label: 'fallback' });
  }

  let connectionInfo = null;
  let lastError = null;

  for (const candidate of candidates) {
    try {
      await mongoose.connect(candidate.uri, {
        dbName: process.env.MONGO_DB_NAME || 'Medconnect',
        serverSelectionTimeoutMS: connectTimeoutMs
      });
      connectionInfo = candidate;
      break;
    } catch (error) {
      lastError = error;
      await mongoose.disconnect().catch(() => {});
      console.warn(`${candidate.label} MongoDB connection failed: ${error.message}`);
    }
  }

  if (!connectionInfo) {
    throw lastError;
  }

  const operations = demoUsers.map((user) => ({
    updateOne: {
      filter: { phone: user.phone },
      update: { $set: user },
      upsert: true
    }
  }));

  const result = await User.bulkWrite(operations);

  console.log(`Seeded demo users. Upserted: ${result.upsertedCount}, modified: ${result.modifiedCount}`);
  console.log(`MongoDB database: ${mongoose.connection.name}`);
  console.log(`MongoDB source: ${connectionInfo.label}`);

  await mongoose.disconnect();
}

seed().catch(async (error) => {
  console.error('Seed failed:', error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
