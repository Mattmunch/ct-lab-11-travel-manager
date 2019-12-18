const mongoose = require('mongoose');


const schema = new mongoose.Schema({
  tripId: {
    type: mongoose.Types.ObjectId,
    ref: 'Trip',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  latLng: {
    type: String,
    required: true
  }
    
})
;

module.exports = mongoose.model('Itinerary', schema);
