import { ICoordinates } from '../../interfaces/common';
import { CameraView } from '../camera.view';

export class TileDecorator {
  public constructor(
    private context: CanvasRenderingContext2D,
    private camera: CameraView,
  ) {}

  public drawBloodDrops({ x, y }: ICoordinates): void {
    // TODO create later
  }
}
