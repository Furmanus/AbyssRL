import {
  getDistance,
  capitalizeString,
} from '../utility';

describe('Test getDistance method', () => {
  it('should return correct value for two points', () => {
    expect(getDistance(1, 1, 1, 4)).toEqual(3);
    expect(getDistance(1, 1, 4, 4)).toEqual(Math.sqrt(18));
  });
  it('should return zero for two same points', () => {
    expect(getDistance(1, 1, 1, 1)).toEqual(0);
  });
  it('should return correct value for negative coordinates', () => {
    expect(getDistance(-2, -4, 1, 1)).toEqual(Math.sqrt(34));
  });
});
describe('Test capitalizeString method', () => {
  it('should capitalize string', () => {
    expect(capitalizeString('asasass')).toEqual('Asasass');
  });
});
