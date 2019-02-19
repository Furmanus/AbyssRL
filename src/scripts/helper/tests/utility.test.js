import * as Utility from '../utility';

describe('Test getDistance method', () => {
    it('should return correct value for two points', () => {
        expect(Utility.getDistance(1, 1, 1, 4)).toEqual(3);
    });
});