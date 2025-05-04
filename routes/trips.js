const express = require('express');
const Trip = require('../models/Trip');
const router = express.Router();

// GET /user/:userId/orders
router.get('/user/:userId/orders', async (req, res) => {
  const trips = await Trip.find({ userId: req.params.userId }).populate('destinationId');
  res.json(trips);
});

// GET /trip/:tripId
router.get('/trip/:tripId', async (req, res) => {
  const trip = await Trip.findById(req.params.tripId).populate('destinationId');
  res.json(trip);
});

// POST /trip
router.post('/trip', async (req, res) => {
  const trip = new Trip(req.body);
  await trip.save();
  res.status(201).json(trip);
});

// PUT /trip/:tripId
router.put('/trip/:tripId', async (req, res) => {
  const trip = await Trip.findByIdAndUpdate(req.params.tripId, req.body, { new: true });
  res.json(trip);
});

// DELETE /trip/:tripId
router.delete('/trip/:tripId', async (req, res) => {
  await Trip.findByIdAndDelete(req.params.tripId);
  res.json({ message: 'Trip deleted' });
});

module.exports = router;
