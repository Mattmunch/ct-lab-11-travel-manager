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
  it('gets all trips', async() => {
    const trips = await Trip.create([
      { name: 'Snowboarding', location: 'Denver' },
      { name: 'Business', location: 'Los Angeles' },
      { name: 'Spiritual Journey', location: 'Portland' }
    ]);

    return request(app)
      .get('/api/v1/trips')
      .then(res => {
        trips.forEach(trip => {
          expect(res.body).toContainEqual({
            _id: trip._id.toString(),
            name: trip.name,
            location: trip.location,
            __v: 0
          });
        });
      });
  });
  it('gets a trip by id', async() => {
    return request(app)
      .get(`/api/v1/trips/${trip._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Spring Break 2020',
          location: 'Panama City',
          itineraries: JSON.parse(JSON.stringify(itineraries)),
          __v: 0
        });
      });
  });
  it('updates a trip by id', async() => {
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

  it('deletes a trip by id', async() => {
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
