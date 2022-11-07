import { Dice } from '../dice';

jest.mock('../../global/config', () => ({
  applicationConfigService: {},
}));

describe('Test dice class', () => {
  it('Should construct dice correctly', () => {
    const dice = new Dice('2d1 + 5');

    expect(dice.getMultiplier()).toEqual(2);
    expect(dice.getSides()).toEqual(1);
    expect(dice.getAdditional()).toEqual(5);
  });
  it('Invalid constructor description should throw error', () => {
    expect(() => {
      new Dice('sdfsfsf' as never);
    }).toThrowError();
  });
  it('Should calculate roll correctly', () => {
    const dice = new Dice('1d1+1');

    expect(dice.roll()).toEqual(2);
  });
  it('Serialized data should return proper string', () => {
    const dice = new Dice('3d7 + 5');

    expect(dice.getDataToSerialization()).toEqual('3d7+5');
  });
});
