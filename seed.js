const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Destination = require('./models/Destination');
const Trip = require('./models/Trip');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await User.deleteMany();
    await Destination.deleteMany();
    await Trip.deleteMany();
    console.log('Existing data cleared');

    // Insert users
    const users = await User.insertMany([
      { name: 'Alice Johnson', email: 'alice@example.com' },
      { name: 'Bob Smith', email: 'bob@example.com' },
      { name: 'Carol Davis', email: 'carol@example.com' },
      { name: 'David Lee', email: 'david@example.com' },
    ]);
    console.log('Users seeded');

    // Insert destinations
    const destinations = await Destination.insertMany([
      { city: 'Paris', country: 'France', description: 'The city of light and love.' },
      { city: 'Tokyo', country: 'Japan', description: 'A bustling metropolis blending tradition and technology.' },
      { city: 'New York', country: 'USA', description: 'The city that never sleeps.' },
      { city: 'Sydney', country: 'Australia', description: 'Beautiful beaches and the iconic Opera House.' },
    ]);
    console.log('Destinations seeded');

    // Insert trips
    await Trip.insertMany([
      {
        userId: users[0]._id,
        destinationId: destinations[0]._id,
        startDate: new Date('2025-06-01'),
        endDate: new Date('2025-06-10'),
        status: 'planned',
      },
      {
        userId: users[1]._id,
        destinationId: destinations[1]._id,
        startDate: new Date('2025-07-15'),
        endDate: new Date('2025-07-25'),
        status: 'completed',
      },
      {
        userId: users[2]._id,
        destinationId: destinations[2]._id,
        startDate: new Date('2025-08-05'),
        endDate: new Date('2025-08-12'),
        status: 'cancelled',
      },
      {
        userId: users[3]._id,
        destinationId: destinations[3]._id,
        startDate: new Date('2025-09-20'),
        endDate: new Date('2025-09-30'),
        status: 'planned',
      },
    ]);
    console.log('Trips seeded');

    console.log('✅ Database seeding completed');
    process.exit();
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exit(1);
  }
};

seed();
