const Itinerary = require('./Itinerary');
describe('Itinerary Model', () => {
  it('requires a name', () => {
    const itinerary = new Itinerary({
      tripId: {},
      latLng: 'New York'
    });
    const { errors } = itinerary.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });
  it('requires a tripId', () => {
    const itinerary = new Itinerary({
      name: 'spring break',
      latLng: 'New York'
    });
    const { errors } = itinerary.validateSync();
    expect(errors.tripId.message).toEqual('Path `tripId` is required.');
  });
  it('requires a latLng', () => {
    const itinerary = new Itinerary({
      tripId: {},
      name: 'New York'
    });
    const { errors } = itinerary.validateSync();
    expect(errors.latLng.message).toEqual('Path `latLng` is required.');
  });
})
;
