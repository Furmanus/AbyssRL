/**
 * Class representing direction. Instances of this class takes form of objects {x: IDirection, y: IDirection}, where
 * x and y can take values only from set -1, 0, 1.
 */
import { DirectionType } from '../../interfaces/common';
import { ExcludeFunctionProperties } from '../../interfaces/utility.interfaces';

export type SerializedDirection = ExcludeFunctionProperties<Direction>;

export class Direction {
  public x: DirectionType = 0;
  public y: DirectionType = 0;

  public constructor(x: DirectionType, y: DirectionType) {
    this.x = x;
    this.y = y;
  }

  public getDataToSerialization(): SerializedDirection {
    return { ...this };
  }
}
