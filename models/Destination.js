const express = require('express');
const Destination = require('../models/Destination');
const router = express.Router();

/**
 * @swagger
 * /destinations:
 *   get:
 *     summary: Get all destinations
 *     responses:
 *       200:
 *         description: List of destinations
 */
router.get('/destinations', async (req, res) => {
  try {
    const destinations = await Destination.find();
    res.json(destinations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /destinations/{destinationId}:
 *   get:
 *     summary: Get destination details
 *     parameters:
 *       - in: path
 *         name: destinationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Destination details
 */
router.get('/destinations/:destinationId', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.destinationId);
    if (!destination) return res.status(404).json({ message: 'Destination not found' });
    res.json(destination);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /destinations:
 *   post:
 *     summary: Create a new destination
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Destination created
 */
router.post('/destinations', async (req, res) => {
  try {
    const { city, country, description } = req.body;
    if (!city || !country) return res.status(400).json({ message: 'Missing city or country' });
    const destination = new Destination({ city, country, description });
    await destination.save();
    res.status(201).json(destination);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /destinations/{destinationId}:
 *   put:
 *     summary: Update a destination
 *     parameters:
 *       - in: path
 *         name: destinationId
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
 *         description: Destination updated
 */
router.put('/destinations/:destinationId', async (req, res) => {
  try {
    const updatedDestination = await Destination.findByIdAndUpdate(req.params.destinationId, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedDestination) return res.status(404).json({ message: 'Destination not found' });
    res.json(updatedDestination);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /destinations/{destinationId}:
 *   delete:
 *     summary: Delete a destination
 *     parameters:
 *       - in: path
 *         name: destinationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Destination deleted
 */
router.delete('/destinations/:destinationId', async (req, res) => {
  try {
    const deletedDestination = await Destination.findByIdAndDelete(req.params.destinationId);
    if (!deletedDestination) return res.status(404).json({ message: 'Destination not found' });
    res.json({ message: 'Destination deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
