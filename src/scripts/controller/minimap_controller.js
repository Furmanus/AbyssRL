import {MinimapView} from '../view/map_view';
import {config} from '../global/config';
import {Observer} from '../core/observer';

export class MiniMapController extends Observer{

    constructor(){
        super();

        this.view = new MinimapView(
            config.SCREEN_WIDTH - config.TILE_SIZE * config.ROWS - 30,
            config.SCREEN_HEIGHT - config.TILE_SIZE * config.COLUMNS - 40
        );
    }
    /**
     * Method responsible for changing size of info screen.
     * @param {number}  newWidth        New width of info screen.
     * @param {number}  newHeight       New height of info screen.
     */
    changeMinimapSize(newWidth, newHeight){
        this.view.changeSize(newWidth, newHeight);
    }
}