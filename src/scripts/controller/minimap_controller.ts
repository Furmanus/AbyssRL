import {MinimapView} from '../view/map_view';
import {config} from '../global/config';
import {Observer} from '../core/observer';

/**
 * Controller of game mini map.
 */
export class MiniMapController extends Observer {
    private view: MinimapView;
    constructor() {
        super();

        this.view = new MinimapView(
            config.SCREEN_WIDTH - config.TILE_SIZE * config.ROWS - 30,
            config.SCREEN_HEIGHT - config.TILE_SIZE * config.COLUMNS - 40,
        );
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
