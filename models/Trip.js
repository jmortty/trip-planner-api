const mongoose = require('mongoose');
const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  destinationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['planned', 'completed', 'cancelled'], default: 'planned' }
});
module.exports = mongoose.model('Trip', tripSchema);
