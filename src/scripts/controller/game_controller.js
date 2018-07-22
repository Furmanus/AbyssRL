/**
 * Class representing main game controller. GameController is responsible for taking input from user and manipulating game model and view in appriopiate way.
 */
import {GameView} from '../view/game_view';
import {config} from '../global/config';
import {Observer} from '../core/observer';
import {CANVAS_CELL_CLICK} from '../constants/game_actions';
import {entities} from '../constants/sprites';
import {
    SHOW_MESSAGE_IN_VIEW,
    PLAYER_ACTION_MOVE_PLAYER,
    PLAYER_WALK_CONFIRM_NEEDED,
    START_PLAYER_TURN,
    END_PLAYER_TURN
} from '../constants/player_actions';
import {PlayerController} from './entity/player_controller';
import {DungeonController} from './dungeon/dungeon_controller';

export class GameController extends Observer{

    /**
     * GameController class constructor.
     * @param {HTMLImageElement}  tileset  HTML Img element with tiles to draw.
     * @constructor
     */
    constructor(tileset){
        super();

        this.dungeonController = new DungeonController();
        this.currentLevel = null;
        this.playerController = null;

        this.view = new GameView(
            config.TILE_SIZE * config.ROWS,
            config.TILE_SIZE * config.COLUMNS,
            config.TILE_SIZE, tileset,
            this.dungeonController.levels[1]
        );

        this.initialize();
        this.attachEvents();
        this.startGame();
    }
    /**
     * Method responsible for initialization of game controller.
     */
    initialize(){
        this.currentLevel = this.dungeonController.getLevel(1);

        this.initializePlayer();

        this.view.drawScreen(this.currentLevel.getModel(), this.playerController.model.fov);
    }
    /**
     * Attaches events to view and models.
     */
    attachEvents(){
        this.view.on(this, CANVAS_CELL_CLICK, this.onCanvasCellClick.bind(this));
        this.playerController.on(this, PLAYER_WALK_CONFIRM_NEEDED, this.onPlayerMoveConfirmNeeded.bind(this));
        this.playerController.on(this, START_PLAYER_TURN, this.onPlayerStartTurn.bind(this));
        this.playerController.on(this, END_PLAYER_TURN, this.onPlayerEndTurn.bind(this));
    }
    /**
     * Creates player character and adds it to proper level controller time engine.
     */
    initializePlayer(){
        const inititalPlayerCell = this.currentLevel.getStairsUpCell();
        const playerLevel = this.currentLevel;

        this.playerController = new PlayerController({
            level: playerLevel,
            display: entities.AVATAR,
            position: inititalPlayerCell,
            speed: 100,
            perception: 6
        });

        inititalPlayerCell.entity = this.playerController.getModel();
        this.playerController.calculateFov();
        this.currentLevel.addActorToScheduler(this.playerController);
        this.view.camera.centerOnCoordinates(inititalPlayerCell.x, inititalPlayerCell.y);
    }
    /**
     * Starts game by starting time engine on current level.
     */
    startGame(){
        this.currentLevel.startTimeEngine();
    }
    /**
     * Method responsible for processing user input and taking proper actions(methods) depending on input.
     * @param {string}  action  String describing type of action.
     * @param {Object}  data    Object containing additional data.
     */
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
        const playerFov = playerModel.fov;
        /**
         * Await for movement object. It happens immediately except for situation when player tries to move into dangerous terrain and he needs to confirm move.
         * @type {Object}
         */
        const movementResult = await this.playerController.move(newPlayerCellPosition);

        if (movementResult.canMove) {
            this.view.camera.centerOnCoordinates(newPlayerCellPosition.x, newPlayerCellPosition.y);
            this.refreshGameScreen();
        } else {
            this.notify(SHOW_MESSAGE_IN_VIEW, movementResult.message);
        }
    }
    /**
     * Method responsible for refreshing game screen.
     */
    refreshGameScreen(){
        const levelModel = this.currentLevel.getModel();
        const playerFov = this.playerController.model.fov;

        this.view.refreshScreen(levelModel, playerFov);
    }
    /**
     * Changes size of canvas game display.
     * @param {number}  newWidth    New width of canvas.
     * @param {number}  newHeight   New height of canvas.
     */
    changeGameScreenInView(newWidth, newHeight){
        this.view.changeGameScreenSize(newWidth, newHeight, this.currentLevel.getModel());
    }
    /**
     * Method triggered when user clicks on game screen.
     */
    onCanvasCellClick(){
        this.view.refreshScreen(this.currentLevel.getModel());
    }
    /**
     * Method triggered after player model notifies about needed movement confirm from player.
     * @param {Object}  data    Object with additional data about confirmation.
     */
    onPlayerMoveConfirmNeeded(data){
        this.notify(PLAYER_WALK_CONFIRM_NEEDED, data);
    }
    /**
     * Method triggered after player controller notifies about beginning of player turn.
     */
    onPlayerStartTurn(){
        this.currentLevel.lockTimeEngine();
    }
    /**
     * Method triggered after player controller notifies about end of player turn.
     */
    onPlayerEndTurn(){
        this.currentLevel.unlockTimeEngine();
    }
}