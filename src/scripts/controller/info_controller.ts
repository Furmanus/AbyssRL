import {InfoView} from '../view/info_view';
import {config} from '../global/config';
import {Controller} from './controller';

/**
 * Controller of info data visible to player (player character info like HP, stats...).
 */
export class InfoController extends Controller {
    private view: InfoView;

    constructor() {
        super();

        this.view = new InfoView(
            config.SCREEN_WIDTH - config.TILE_SIZE * config.ROWS - 30,
            config.TILE_SIZE * config.COLUMNS,
        );
    }
    /**
     * Method responsible for changing size of info screen.
     * @param   newWidth        New width of info screen.
     * @param   newHeight       New height of info screen.
     */
    public changeInfoScreenSize(newWidth: number, newHeight: number): void {
        this.view.changeSize(newWidth, newHeight);
    }
}
