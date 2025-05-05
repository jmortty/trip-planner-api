const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const { swaggerUi, specs } = require('./swagger');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// Import routes
const tripRoutes = require('./routes/trips');
const userRoutes = require('./routes/users');
const destinationRoutes = require('./routes/destinations');

// Root route
app.get('/', (req, res) => {
  res.send('🌍 Trip Planner API is running!');
});

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// API routes
app.use('/api', tripRoutes);
app.use('/api', userRoutes);
app.use('/api', destinationRoutes);

// Global error handler (optional, good practice)
app.use((err, req, res, next) => {
  console.error('Global error:', err.stack);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
