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
  let itinerary;
  beforeEach(async() => {
    trip = await Trip.create({
      name: 'Spring Break 2020',
      location: 'Panama City',
      
    });
    
    itinerary = await Itinerary.create({
      tripId: trip._id,
      name: 'Pool Party',
      latLng:'35, 40'
    });
  });
  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates an itinerary', () => {
    return request(app)
      .post('/api/v1/itineraries')
      .send({
        tripId: trip._id,
        name: 'Night Party',
        latLng:'40, 45'
      }).then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tripId: trip._id.toString(),
          name: 'Night Party',
          latLng:'40, 45',
          __v: 0
        });
      });
  });
  it('gets all itineraries', async() => {
    const itineraries = await Itinerary.create([
      { tripId: trip._id, name: 'Snowboarding', latLng: '30, 28' },
      { tripId: trip._id, name: 'Business', latLng: '50, 65' },
      { tripId: trip._id, name: 'Spiritual Journey', latLng: '20, 23' }
    ]);

    return request(app)
      .get('/api/v1/itineraries')
      .then(res => {
        itineraries.forEach(itinerary => {
          expect(res.body).toContainEqual(JSON.parse(JSON.stringify(itinerary)));
        });
      });
  });
  it('gets an itinerary by id', async() => {
    return request(app)
      .get(`/api/v1/itineraries/${itinerary._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          tripId: JSON.parse(JSON.stringify(trip)),
          name: 'Pool Party',
          latLng:'35, 40',
          __v: 0
        });
      });
  });
  it('updates a itinerary by id', async() => {
    return request(app)
      .patch(`/api/v1/trips/${trip._id}`)
      .send({ name: 'Spring Break 3030' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Spring Break 3030',
          location: 'Panama City',
          __v: 0
        });
      });
  });

  it('deletes an itinerary by id', async() => {
    return request(app)
      .delete(`/api/v1/trips/${trip._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Spring Break 2020',
          location: 'Panama City',
          __v: 0
        });

        return Itinerary.find();
      })
      .then(itineraries => {
        expect(itineraries).toHaveLength(0);
      });
  });
});

