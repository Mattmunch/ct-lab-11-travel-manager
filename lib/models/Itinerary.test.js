const Itinerary = require('./Itinerary');
describe('Itinerary Model', () => {
  it('requires a name', () => {
    const itinerary = new Itinerary({
      tripId: {},
      location: 'New York'
    });
    const { errors } = itinerary.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });
  it('requires a tripId', () => {
    const itinerary = new Itinerary({
      name: 'spring break',
      location: 'New York'
    });
    const { errors } = itinerary.validateSync();
    expect(errors.tripId.message).toEqual('Path `tripId` is required.');
  });
  it('requires a location', () => {
    const itinerary = new Itinerary({
      tripId: {},
      name: 'New York'
    });
    const { errors } = itinerary.validateSync();
    expect(errors.location.message).toEqual('Path `location` is required.');
  });
})
;
