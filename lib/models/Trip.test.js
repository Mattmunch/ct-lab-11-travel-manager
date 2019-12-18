const Trip = require('./Trip');
describe('Trip model', () => {
  it('requires a name', () => {
    const trip = new Trip({
      location: 'New York'
    });
    const { errors } = trip.validateSync();
    expect(errors.name.message).toEqual('Path `name` is required.');
  });
  it('requires a location', () => {
    const trip = new Trip({
      name: 'New York'
    });
    const { errors } = trip.validateSync();
    expect(errors.location.message).toEqual('Path `location` is required.');
  });
});
