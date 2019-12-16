const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  }
});
schema.virtual('itineraries', {
  ref: 'Itinerary',
  localField: '_id',
  foreignField: 'tripId'
});


module.exports = mongoose.model('Trip', schema);
