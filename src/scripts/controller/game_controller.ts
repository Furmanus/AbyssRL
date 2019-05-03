import {GameView} from '../view/game_view';
import {config} from '../global/config';
import {CANVAS_CELL_CLICK} from '../constants/game_actions';
import {entities} from '../constants/sprites';
import {
    SHOW_MESSAGE_IN_VIEW,
    PLAYER_ACTION_MOVE_PLAYER,
    PLAYER_WALK_CONFIRM_NEEDED,
    START_PLAYER_TURN,
    END_PLAYER_TURN,
    PLAYER_ACTION_ACTIVATE_OBJECT,
    PLAYER_ACTION_GO_UP,
    PLAYER_ACTION_GO_DOWN,
} from '../constants/player_actions';
import {PlayerController} from './entity/player_controller';
import {DungeonController} from './dungeon/dungeon_controller';
import {Cell} from '../model/dungeon/cells/cell_model';
import {IAnyObject, IDirection} from '../interfaces/common';
import {LevelController} from './dungeon/level_controller';
import {Controller} from './controller';
import {cellTypes} from '../constants/cell_types';
import {globalMessagesController} from '../global/messages';
import {DungeonEvents} from '../constants/dungeon_events';
import {ASCEND} from '../constants/directions';

/**
 * Class representing main game controller. GameController is responsible for taking input from user and manipulating
 * game model and view in appriopiate way.
 */
export class GameController extends Controller {
    private dungeonController: DungeonController;
    private currentLevel: LevelController;
    private playerController: PlayerController;
    private view: GameView;
    /**
     * GameController class constructor.
     * @param   tileset    HTML Img element with tiles to draw.
     */
    constructor(tileset: HTMLImageElement) {
        super();

        this.dungeonController = new DungeonController();
        this.currentLevel = null;
        this.playerController = null;

        this.view = new GameView(
            config.TILE_SIZE * config.ROWS,
            config.TILE_SIZE * config.COLUMNS,
            config.TILE_SIZE, tileset,
        );

        this.initialize();
        this.attachEvents();
        this.startGame();
    }
    /**
     * Method responsible for initialization of game controller.
     */
    protected initialize(): void {
        this.currentLevel = this.dungeonController.getLevel(1);

        this.initializePlayer();
        this.drawLevelInView();
        /**
         * setTimeout because main controller at this point doesn't have events attached, think how to solve it better
         */
        window.setTimeout(() => {
            this.notify(DungeonEvents.CHANGE_CURRENT_LEVEL, {
                branch: this.dungeonController.getType(),
                levelNumber: 1,
            });
        }, 1);
    }
    /**
     * Attaches events to view and models.
     */
    private attachEvents(): void {
        this.view.on(this, CANVAS_CELL_CLICK, this.onCanvasCellClick.bind(this));
        this.playerController.on(this, PLAYER_WALK_CONFIRM_NEEDED, this.onPlayerMoveConfirmNeeded.bind(this));
        this.playerController.on(this, START_PLAYER_TURN, this.onPlayerStartTurn.bind(this));
        this.playerController.on(this, END_PLAYER_TURN, this.onPlayerEndTurn.bind(this));
        this.playerController.on(this, DungeonEvents.CHANGE_CURRENT_LEVEL, (data: IAnyObject) => {
            this.notify(DungeonEvents.CHANGE_CURRENT_LEVEL, data);
        });

        this.dungeonController.on(this, DungeonEvents.CHANGE_CURRENT_LEVEL, this.onDungeonControllerLevelChange.bind(this));
    }
    /**
     * Creates player character and adds it to proper level controller time engine.
     */
    private initializePlayer(): void {
        const inititalPlayerCell: Cell = this.currentLevel.getStairsUpCell();
        const playerLevel: LevelController = this.currentLevel;

        this.playerController = new PlayerController({
            level: playerLevel,
            display: entities.AVATAR,
            position: inititalPlayerCell,
            speed: 15,
            perception: 6,
        });

        inititalPlayerCell.entity = this.playerController.getModel();
        this.playerController.calculateFov();
        this.currentLevel.addActorToTimeEngine(this.playerController);
        this.view.camera.centerOnCoordinates(inititalPlayerCell.x, inititalPlayerCell.y);
    }
    /**
     * Starts game by starting time engine on current level.
     */
    private startGame(): void {
        this.currentLevel.startTimeEngine();
    }
    /**
     * Method responsible for processing user input and taking proper actions(methods) depending on input.
     *
     * @param   action  String describing type of action.
     * @param   data    Object containing additional data.
     */
    public takePlayerAction(action: string, data?: IAnyObject): void {
        switch (action) {
            case PLAYER_ACTION_MOVE_PLAYER:
                this.movePlayer(data as IDirection);
                break;
            case PLAYER_ACTION_ACTIVATE_OBJECT:
                this.activateObject(data as IDirection);
                break;
            case PLAYER_ACTION_GO_UP:
                this.ascendUpLevel();
                break;
            case PLAYER_ACTION_GO_DOWN:
                this.descentDownLevel();
                break;
            default:
                // placeholder
        }
    }
    /**
     * Makes attempt to descent player down one level in dungeon.
     */
    private descentDownLevel(): void {
        const playerPositionCellType: string = this.playerController.getEntityPosition().type;

        if (playerPositionCellType === cellTypes.STAIRS_DOWN) {
            this.dungeonController.changeLevel(this.dungeonController.getCurrentLevelNumber() + 1);
        } else {
            globalMessagesController.showMessageInView('You can\'t go down here.');
        }
    }
    /**
     * Makes attempt to move player up one level in dungeon.
     */
    private ascendUpLevel(): void {
        const playerPositionCellType: string = this.playerController.getEntityPosition().type;

        if (playerPositionCellType === cellTypes.STAIRS_UP) {
            this.dungeonController.changeLevel(this.dungeonController.getCurrentLevelNumber() - 1);
        } else {
            globalMessagesController.showMessageInView('You can\'t go up here.');
        }
    }
    /**
     * Method triggered after dungeon controller notifies change on current level.
     *
     * @param data     Data passed along with event. Contains information about current level controller and
     *                 whether change of level was made through descending or ascending (used to calculate new player
     *                 position)
     */
    private onDungeonControllerLevelChange(data: {newLevelController: LevelController, direction: string}): void {
        const {
            newLevelController,
            direction,
        } = data;
        let newPlayerCell: Cell;

        if (newLevelController) {
            this.currentLevel.lockTimeEngine();
            this.currentLevel.removeActorFromTimeEngine(this.playerController);

            this.currentLevel = newLevelController;
            this.currentLevel.addActorToTimeEngine(this.playerController);

            if (this.currentLevel.wasTimeEngineStarted()) {
                this.currentLevel.unlockTimeEngine();
            } else {
                this.currentLevel.startTimeEngine();
            }

            if (direction === ASCEND) {
                newPlayerCell = newLevelController.getStairsDownCell();
            } else {
                newPlayerCell = newLevelController.getStairsUpCell();
            }
            this.playerController.changeLevel(this.currentLevel.getModel(), newPlayerCell);
            this.view.centerCameraOnCoordinates({
                x: newPlayerCell.x,
                y: newPlayerCell.y,
            });
            this.refreshGameScreen();
        }
    }
    /**
     * Method responsible for moving camera in view.
     *
     * @param   deltaX   Value by which camera should be moved horizontally.
     * @param   deltaY   Value by which camera should be moved vertically.
     */
    public moveCameraInView(deltaX: number, deltaY: number): void {
        this.view.camera.moveCamera(deltaX, deltaY);
        this.refreshGameScreen();
    }
    /**
     * Async method responsible for moving player (changing data in player model and appropiate cell models)
     *
     * @param   direction       Object with data about move direction.
     * @param   direction.x     Horizontal direction where player will move.
     * @param   direction.y     Vertical direction where player will move.
     */
    private async movePlayer(direction: IDirection): Promise<void> {
        const playerModel = this.playerController.getModel();
        const newCellCoordinateX = playerModel.position.x;
        const newCellCoordinateY = playerModel.position.y;
        const newPlayerCellPosition = this.currentLevel.getCell(
            newCellCoordinateX + direction.x,
            newCellCoordinateY + direction.y,
        );
        /**
         * Await for movement object. It happens immediately except for situation when player tries to move into
         * dangerous terrain and he needs to confirm move.
         */
        const movementResult = await this.playerController.move(newPlayerCellPosition);

        if (movementResult.canMove) {
            this.view.camera.centerOnCoordinates(newPlayerCellPosition.x, newPlayerCellPosition.y);
        }
        if (movementResult.message && !(direction.x === 0 && direction.y === 0)) {
            this.notify(SHOW_MESSAGE_IN_VIEW, {
                message: movementResult.message,
            });
        }

        this.refreshGameScreen();
    }
    private activateObject(direction: IDirection): void {
        const {
            x,
            y,
        } = direction;
        const playerModel = this.playerController.getModel();
        const playerXPosition = playerModel.position.x;
        const playerYPosition = playerModel.position.y;
        const activatedObjectCell = this.currentLevel.getCell(playerXPosition + x, playerYPosition + y);

        this.playerController.activate(activatedObjectCell);
    }
    /**
     * Method responsible for refreshing game screen.
     */
    private refreshGameScreen(): void {
        const levelModel = this.currentLevel.getModel();
        const playerFov = this.playerController.getFov();

        this.view.refreshScreen(levelModel, playerFov);
    }
    /**
     * Changes size of canvas game display.
     *
     * @param    newWidth    New width of canvas.
     * @param    newHeight   New height of canvas.
     */
    public changeGameScreenInView(newWidth: number, newHeight: number): void {
        const playerFov = this.playerController.getPlayerFov();

        this.view.changeGameScreenSize(newWidth, newHeight, this.currentLevel.getModel(), playerFov);
    }
    /**
     * Method triggered when user clicks on game screen.
     */
    private onCanvasCellClick(): void {
        this.refreshGameScreen();
    }
    /**
     * Method triggered after player model notifies about needed movement confirm from player.
     * @param   data    Object with additional data about confirmation.
     */
    private onPlayerMoveConfirmNeeded(data: IAnyObject): void {
        this.notify(PLAYER_WALK_CONFIRM_NEEDED, data);
    }
    /**
     * Method triggered after player controller notifies about beginning of player turn.
     */
    private onPlayerStartTurn(): void {
        this.currentLevel.lockTimeEngine();
        this.playerController.calculateFov();
        this.refreshGameScreen();
    }
    /**
     * Method triggered after player controller notifies about end of player turn.
     */
    private onPlayerEndTurn(): void {
        this.currentLevel.unlockTimeEngine();
    }
    /**
     * Draws current level on canvas game view.
     */
    private drawLevelInView(): void {
        this.view.drawScreen(this.currentLevel.getModel(), this.playerController.getFov());
    }
    /**
     * Returns player name taken from player controller.
     */
    public getPlayerName(): string {
        return this.playerController.getName();
    }
}
