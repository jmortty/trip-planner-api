const mongoose = require('mongoose');
const destinationSchema = new mongoose.Schema({
  city: String,
  country: String,
  description: String
});
module.exports = mongoose.model('Destination', destinationSchema);
