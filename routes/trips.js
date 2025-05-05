const express = require('express');
const Trip = require('../models/Trip');
const Destination = require('../models/Destination');
const router = express.Router();

/**
 * @swagger
 * /user/{userId}/orders:
 *   get:
 *     summary: Retrieve all trips for a user
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of user trips
 */
router.get('/user/:userId/orders', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const trips = await Trip.find({ userId: req.params.userId })
      .populate('destinationId')
      .limit(limit * 1)
      .skip((page - 1) * limit);
    const count = await Trip.countDocuments({ userId: req.params.userId });
    res.json({
      trips,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /trip/{tripId}:
 *   get:
 *     summary: Get detailed information about a specific trip
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip details
 */
router.get('/trip/:tripId', async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.tripId).populate('destinationId');
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(trip);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /trip:
 *   post:
 *     summary: Create a new trip
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Trip created
 */
router.post('/trip', async (req, res) => {
  try {
    const { userId, destinationId, startDate, endDate, status } = req.body;

    if (!userId || !destinationId || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const destinationExists = await Destination.findById(destinationId);
    if (!destinationExists) {
      return res.status(400).json({ message: 'Invalid destinationId' });
    }

    const trip = new Trip({ userId, destinationId, startDate, endDate, status });
    await trip.save();
    res.status(201).json(trip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /trip/{tripId}:
 *   put:
 *     summary: Update an existing trip
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Trip updated
 */
router.put('/trip/:tripId', async (req, res) => {
  try {
    const updatedTrip = await Trip.findByIdAndUpdate(req.params.tripId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json(updatedTrip);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /trip/{tripId}:
 *   delete:
 *     summary: Delete a trip
 *     parameters:
 *       - in: path
 *         name: tripId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trip deleted
 */
router.delete('/trip/:tripId', async (req, res) => {
  try {
    const deletedTrip = await Trip.findByIdAndDelete(req.params.tripId);
    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found' });
    }
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
