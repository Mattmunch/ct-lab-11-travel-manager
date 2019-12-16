require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Trip = require('../lib/models/Trip');
const Itinerary = require('../lib/models/Itinerary');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let trip;
  let itineraries;
  beforeEach(async() => {
    trip = await Trip.create({
      name: 'Spring Break 2020',
      location: 'Panama City',
      
    });
    
    itineraries = await Itinerary.create([{
      tripId: trip._id,
      name: 'Pool Party',
      latLng:'35, 40'
    }, {
      tripId: trip._id,
      name: 'Night Party',
      latLng:'40, 45'
    }]);
  });
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a trip', () => {
    return request(app)
      .post('/api/v1/trips')
      .send({
        name: 'Spring Break 2020',
        location: 'Panama City'
      }).then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Spring Break 2020',
          location: 'Panama City',
          __v: 0
        });
      });
  });
});
