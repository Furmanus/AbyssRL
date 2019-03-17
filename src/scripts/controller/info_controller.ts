import {InfoView} from '../view/info_view';
import {config} from '../global/config';
import {Controller} from './controller';
import {dungeonTypeToName} from '../constants/dungeon_types';
import {ILevelInfo} from '../interfaces/level';

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
    /**
     * Changes player name in view.
     *
     * @param name  New text
     */
    public changePlayerNameMessageInView(name: string): void {
        this.view.changePlayerNameMessage(name);
    }
    /**
     * Changes level information in view.
     *
     * @param levelInfo     Data with informations about level
     */
    public changeLevelInfoMessage(levelInfo: ILevelInfo): void {
        this.view.changeLevelInfoMessage(`Level ${levelInfo.levelNumber} of ${dungeonTypeToName[levelInfo.branch]}`);
    }
}
