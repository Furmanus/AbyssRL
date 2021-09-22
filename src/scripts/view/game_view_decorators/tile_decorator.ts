import { Position } from '../../model/position/position';
import { ICoordinates } from '../../interfaces/common';
import { Camera } from '../camera';

export class TileDecorator {
  public constructor(
    private context: CanvasRenderingContext2D,
    private camera: Camera,
  ) {}

  public drawBloodDrops({ x, y }: ICoordinates): void {
    // TODO create later
  }
}
