import { Position } from './position';
import { Vector } from './vector';

export class Rectangle {
  public leftTop: Position;
  public height: number;
  public width: number;

  constructor(leftTopCorner: Position, width: number, height: number) {
    this.leftTop = leftTopCorner;
    this.width = width;
    this.height = height;
  }

  get left(): number {
    return this.leftTop.x;
  }

  get top(): number {
    return this.leftTop.y;
  }

  get right(): number {
    return this.rightBottom.x;
  }

  get bottom(): number {
    return this.rightBottom.y;
  }

  get rightTop(): Position {
    return new Position(this.leftTop.x + this.width, this.leftTop.y);
  }

  get leftBottom(): Position {
    return new Position(this.leftTop.x, this.leftTop.y + this.height);
  }

  get rightBottom(): Position {
    return new Position(
      this.leftTop.x + this.width,
      this.leftTop.y + this.height,
    );
  }

  get area(): number {
    return this.width * this.height;
  }

  /**
   * Scales rectangle by given ratio.
   */
  public scale(ratio: number): void {
    this.width = Math.floor(this.width * ratio);
    this.height = Math.floor(this.height * ratio);
  }

  /**
   * Moves rectangle by given vector.
   */
  public move(vector: Vector): void {
    this.leftTop = new Position(
      this.leftTop.x + vector.x,
      this.leftTop.y + vector.y,
    );
  }

  /**
   * Makes a copy of rectangle.
   */
  public copy(): Rectangle {
    return new Rectangle(this.leftTop, this.width, this.height);
  }

  /**
   * Returns horizontal distance from given rectangle;
   */
  public getHorizontalDistanceFromRect(rect: Rectangle): number {
    const firstRect: Rectangle = rect.left < this.left ? rect : this;
    const secondRect: Rectangle = firstRect === this ? rect : this;

    return Math.max(secondRect.left - firstRect.right, 0);
  }

  /**
   * Returns vertical distance from given rectangle
   */
  public getVerticalDistanceFromRect(rect: Rectangle): number {
    const firstRect = rect.top < this.top ? rect : this;
    const secondRect = firstRect === this ? rect : this;

    return Math.max(secondRect.top - firstRect.bottom, 0);
  }
}
