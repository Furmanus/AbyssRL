/**
 * Class representing two dimensional vector.
 */
export class Vector {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public add(vector: Vector): this {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  }

  public substract(vector: Vector): this {
    this.x -= vector.x;
    this.y -= vector.y;

    return this;
  }
}
