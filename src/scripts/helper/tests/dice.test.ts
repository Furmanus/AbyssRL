import { Dice } from '../../model/dice';

describe('Test dice class', () => {
  it('Should construct dice correctly', () => {
    const dice = new Dice('2d1 + 5');

    expect(dice.getMultiplier()).toEqual(2);
    expect(dice.getSides()).toEqual(1);
    expect(dice.getAdditional()).toEqual(5);
  });
  it('Invalid constructor description should throw error', () => {
    expect(() => {
      const dice = new Dice('sdfsfsf');
    }).toThrowError();
  });
  it('Should calculate roll correctly', () => {
    const dice = new Dice('1d1+1');

    expect(dice.roll()).toEqual(2);
  });
  it('Serialized data should return proper string', () => {
    const dice = new Dice('3d7 + 5');

    expect(dice.getSerializedData()).toEqual('3d7+5');
  });
});
