/**
 * Class representing direction. Instances of this class takes form of objects {x: IDirection, y: IDirection}, where
 * x and y can take values only from set -1, 0, 1.
 */
import { directionType } from '../../interfaces/common';

export class Direction {
    public x: directionType = 0;
    public y: directionType = 0;

    constructor(x: directionType, y: directionType) {
      this.x = x;
      this.y = y;
    }
}
