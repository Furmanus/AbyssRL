import { Vector } from '../vector';

describe('Test Vector class', () => {
  let vector: Vector;

  beforeEach(() => {
    vector = new Vector(1, 1);
  });

  it('Method add should modify vector in correct way', () => {
    vector.add(new Vector(2, 2));

    expect(vector.x).toBe(3);
    expect(vector.y).toBe(3);
  });
  it('Method substract should modify vector in correct way', () => {
    vector.substract(new Vector(1, 1));

    expect(vector.x).toBe(0);
    expect(vector.y).toBe(0);
  });
});
