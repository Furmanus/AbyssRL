/**
 * Class representing main game controller. GameController is responsible for taking input from user and manipulating game model and view in appriopiate way.
 */
import {GameView} from '../view/game_view';
import {Dungeon} from '../model/dungeon/dungeon_model';
import {ArenaGenerator} from '../model/dungeon/generators/arena';
import {config} from '../global/config';
import {Observer} from '../core/observer';
import {CANVAS_CELL_CLICK} from '../constants/actions';

export class GameController extends Observer{

    /**
     * GameController class constructor.
     * @param {HTMLImageElement}  tileset  HTML Img element with tiles to draw.
     * @constructor
     */
    constructor(tileset){
        super();

        this.dungeon = new Dungeon();
        this.levelGenerator = new ArenaGenerator();
        this.currentLevel = null;

        this.view = new GameView(
            config.TILE_SIZE * config.ROWS,
            config.TILE_SIZE * config.COLUMNS,
            config.TILE_SIZE, tileset,
            this.dungeon.levels[1]
        );

        this.initialize();
        this.attachEvents();
    }
    /**
     * Method responsible for initialization of game controller.
     */
    initialize(){
        this.levelGenerator.generate(this.dungeon.levels[1]);
        this.currentLevel = this.dungeon.levels[1];
        this.view.drawScreen(this.currentLevel);
    }
    attachEvents(){
        this.view.on(this, CANVAS_CELL_CLICK, this.onCanvasCellClick.bind(this));
    }
    /**
     * Method responsible for moving camera in view.
     * @param {number}  deltaX  Value by which camera should be moved horizontally.
     * @param {number}  deltaY  Value by which camera should be moved vertically.
     */
    moveCameraInView(deltaX, deltaY){
        this.view.camera.moveCamera(deltaX, deltaY);
        this.view.refreshScreen(this.currentLevel);
    }
    /**
     * Changes size of canvas game display.
     * @param {number}  newWidth    New width of canvas.
     * @param {number}  newHeight   New height of canvas.
     */
    changeGameScreenInView(newWidth, newHeight){
        this.view.changeGameScreenSize(newWidth, newHeight);
    }
    /**
     * Method triggered when user clicks on game screen.
     */
    onCanvasCellClick(){
        this.view.refreshScreen(this.currentLevel);
    }
}