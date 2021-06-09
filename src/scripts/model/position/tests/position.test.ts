import { Position } from '../position';

describe('Test Position class instances', () => {
  let position: Position;

  beforeEach(() => {
    position = new Position(1, 1);
  });

  it('Should be instance of class', () => {
    expect(position).toBeInstanceOf(Position);
  });
  it('Should return proper coordinates', () => {
    expect(position.x).toBe(1);
    expect(position.y).toBe(1);
  });
  it('Method check if adjacent should return proper value', () => {
    expect(position.checkIfIsAdjacent(2, 1)).toBe(true);
    expect(position.checkIfIsAdjacent(3, 3)).toBe(false);
  });
  it('Method getDistanceFromPosition should return proper value', () => {
    const positionB = new Position(1, 3);
    const positionC = new Position(4, 5);

    expect(position.getDistanceFromPosition(positionB)).toBe(2);
    expect(Math.floor(position.getDistanceFromPosition(positionC))).toBe(5);
  });
});
