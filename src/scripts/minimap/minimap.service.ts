import { MinimapView } from './minimap.view';
import { config } from '../global/config';

const constructorToken = Symbol('MiniMap Controller');
let instance: MiniMapService;

/**
 * Controller of game mini map.
 */
export class MiniMapService {
  private view: MinimapView;

  constructor(token: symbol) {
    if (token !== constructorToken) {
      throw new Error('Invalid constructor call');
    }

    this.view = new MinimapView(
      config.SCREEN_WIDTH - config.TILE_SIZE * config.ROWS - 30,
      config.SCREEN_HEIGHT - config.TILE_SIZE * config.COLUMNS - 40,
    );
  }

  public static getInstance(): MiniMapService {
    if (!instance) {
      instance = new MiniMapService(constructorToken);
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

export const globalMiniMapController = MiniMapService.getInstance();
