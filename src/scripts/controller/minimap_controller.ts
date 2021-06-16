import { MinimapView } from '../view/map_view';
import { config } from '../global/config';
import { Controller } from './controller';

const constructorToken = Symbol('MiniMap Controller');
let instance: MiniMapController;

/**
 * Controller of game mini map.
 */
export class MiniMapController extends Controller {
  private view: MinimapView;

  constructor(token: symbol) {
    super();

    if (token !== constructorToken) {
      throw new Error('Invalid constructor call');
    }

    this.view = new MinimapView(
      config.SCREEN_WIDTH - config.TILE_SIZE * config.ROWS - 30,
      config.SCREEN_HEIGHT - config.TILE_SIZE * config.COLUMNS - 40,
    );
  }

  public static getInstance(): MiniMapController {
    if (!instance) {
      instance = new MiniMapController(constructorToken);
    }

    return instance;
  }

  /**
   * Method responsible for changing size of mini map HTML element in view.
   * @param   newWidth        New width of info screen.
   * @param   newHeight       New height of info screen.
   */
  public changeMinimapSize(newWidth: number, newHeight: number): void {
    this.view.changeSize(newWidth, newHeight);
  }
}
