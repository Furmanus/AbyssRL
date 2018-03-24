import {InfoView} from '../view/info_view';
import {config} from "../global/config";
import {Observer} from '../core/observer';

export class InfoController extends Observer{

    constructor(){
        super();

        this.view = new InfoView(
            config.SCREEN_WIDTH - config.TILE_SIZE * config.ROWS - 30,
            config.TILE_SIZE * config.COLUMNS
        );
    }
    /**
     * Method responsible for changing size of info screen.
     * @param {number}  newWidth        New width of info screen.
     * @param {number}  newHeight       New height of info screen.
     */
    changeInfoScreenSize(newWidth, newHeight){
        this.view.changeSize(newWidth, newHeight);
    }
}