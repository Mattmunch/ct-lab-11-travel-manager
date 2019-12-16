const { Router } = require('express');
const Itinerary = require('../models/Itinerary');
const Trip = require('../models/Trip');

module.exports = Router()
  .post('/', (req, res) => {
    Trip
      .create(req.body)
      .then(trip => res.send(trip));
  })

  .get('/', (req, res) => {
    let tripQuery = {};
    if(req.query.ingredient) {
      tripQuery = { 'ingredients.name': req.query.ingredient };
    }

    Trip
      .find(tripQuery)
      .then(trips => res.send(trips));
  })

  .get('/:id', (req, res) => {
    Promise.all([
      Trip.findById(req.params.id),
      Itinerary.find({ tripId: req.params.id })
    ])
      .then(([trip, events]) => res.send({ ...trip.toJSON(), events }));
  })

  .patch('/:id', (req, res) => {
    Trip
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(trip => res.send(trip));
  })

  .delete('/:id', (req, res) => {
    Promise.all([
      Trip.findByIdAndDelete(req.params.id),
      Itinerary.deleteMany({ tripId: req.params.id })
    ])
      .then(([trip]) => res.send(trip));
  });

