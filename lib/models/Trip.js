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
schema.statics.findByIdWithWeather = async function(id) {
  const trip = await this
    .findById(id)
    .populate('itinerary');

  const itinerary = await Promise.all(trip.itinerary.map(item => item.getWeather()));

  return {
    ...trip.toJSON(),
    itinerary
  };
};

module.exports = mongoose.model('Trip', schema);
