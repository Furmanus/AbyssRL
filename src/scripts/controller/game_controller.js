/**
 * Class representing main game controller. GameController is responsible for taking input from user and manipulating game model and view in appriopiate way.
 */
import {GameView} from '../view/game_view';
import {Dungeon} from '../model/dungeon/dungeon_model';
import {ArenaGenerator} from '../model/dungeon/generators/arena';
import {config} from '../global/config';
import {Observer} from '../core/observer';
import {CANVAS_CELL_CLICK} from '../constants/game_actions';
import {entities} from '../constants/sprites';
import {
    SHOW_MESSAGE_IN_VIEW,
    PLAYER_ACTION_MOVE_PLAYER,
    PLAYER_WALK_CONFIRM_NEEDED
} from '../constants/player_actions';
import {PlayerController} from './entity/player_controller';

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
        this.playerController = null;

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
        this.levelGenerator.generate(this.dungeon.getLevel(1));
        this.currentLevel = this.dungeon.getLevel(1);

        this.initializePlayer();

        this.view.drawScreen(this.currentLevel);
    }
    /**
     * Attaches events to view and models.
     */
    attachEvents(){
        this.view.on(this, CANVAS_CELL_CLICK, this.onCanvasCellClick.bind(this));
        this.playerController.on(this, PLAYER_WALK_CONFIRM_NEEDED, this.onPlayerMoveConfirmNeeded.bind(this));
    }
    /**
     * Creates player character.
     */
    initializePlayer(){
        //TODO wersja robocza, przerobic później
        const inititalPlayerCell = this.currentLevel.getCell(5, 10);

        this.playerController = new PlayerController({
            display: entities.AVATAR,
            position: inititalPlayerCell
        });

        inititalPlayerCell.entity = this.playerController.getModel();
    }
    takePlayerAction(action, data){
        switch(action){
            case PLAYER_ACTION_MOVE_PLAYER:
                this.movePlayer(data);
                break;
        }
    }
    /**
     * Method responsible for moving camera in view.
     * @param {number}  deltaX  Value by which camera should be moved horizontally.
     * @param {number}  deltaY  Value by which camera should be moved vertically.
     */
    moveCameraInView(deltaX, deltaY){
        this.view.camera.moveCamera(deltaX, deltaY);
        this.refreshGameScreen();
    }
    /**
     * Async ethod responsible for moving player (changing data in player model and appropiate cell models)
     * @param {Object}  direction       Object with data about move direction.
     * @param {number}  direction.x     Horizontal direction where player will move.
     * @param {number}  direction.y     Vertical direction where player will move.
     */
    async movePlayer(direction){
        const playerModel = this.playerController.getModel();
        const newCellCoordinateX = playerModel.position.x;
        const newCellCoordinateY = playerModel.position.y;
        const newPlayerCellPosition = this.currentLevel.getCell(newCellCoordinateX + direction.x, newCellCoordinateY + direction.y);
        /**
         * Await for movement object. It happens immediately except for situation when player tries to move into dangerous terrain and he needs to confirm move.
         * @type {Object}
         */
        const movementResult = await this.playerController.move(newPlayerCellPosition);

        if(!movementResult.canMove){
            this.notify(SHOW_MESSAGE_IN_VIEW, movementResult.message);
        }

        this.view.camera.centerOnCoordinates(newPlayerCellPosition.x, newPlayerCellPosition.y);
        this.refreshGameScreen();
    }
    /**
     * Method responsible for refreshing game screen.
     */
    refreshGameScreen(){
        this.view.refreshScreen(this.currentLevel);
    }
    /**
     * Changes size of canvas game display.
     * @param {number}  newWidth    New width of canvas.
     * @param {number}  newHeight   New height of canvas.
     */
    changeGameScreenInView(newWidth, newHeight){
        this.view.changeGameScreenSize(newWidth, newHeight, this.currentLevel);
    }
    /**
     * Method triggered when user clicks on game screen.
     */
    onCanvasCellClick(){
        this.view.refreshScreen(this.currentLevel);
    }
    /**
     * Method triggered after player model notifies about needed movement confirm from player.
     * @param {Object}  data    Object with additional data about confirmation.
     */
    onPlayerMoveConfirmNeeded(data){
        this.notify(PLAYER_WALK_CONFIRM_NEEDED, data);
    }
}