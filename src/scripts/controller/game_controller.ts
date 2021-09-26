import { GameView } from '../view/game_view';
import { config } from '../global/config';
import {
  CANVAS_CELL_CLICK,
  EXAMINE_CELL,
  STOP_EXAMINE_CELL,
} from '../constants/game_actions';
import { entities } from '../constants/cells/sprites';
import {
  SHOW_MESSAGE_IN_VIEW,
  PLAYER_ACTION_MOVE_PLAYER,
  PLAYER_WALK_CONFIRM_NEEDED,
  START_PLAYER_TURN,
  END_PLAYER_TURN,
  PLAYER_ACTION_ACTIVATE_OBJECT,
  PLAYER_ACTION_GO_UP,
  PLAYER_ACTION_GO_DOWN,
  PLAYER_DEATH,
  PlayerActions,
} from '../constants/entity/player_actions';
import { PlayerController } from './entity/player_controller';
import { DungeonController } from './dungeon/dungeon_controller';
import { Cell } from '../model/dungeon/cells/cell_model';
import { IAnyObject, IDirection } from '../interfaces/common';
import { LevelController } from './dungeon/level_controller';
import { Controller } from './controller';
import { cellTypes } from '../constants/cells/cell_types';
import { globalMessagesController } from '../global/messages';
import { DungeonEvents } from '../constants/dungeon_events';
import { ASCEND } from '../constants/directions';
import { EntityModel, IEntityStatsObject } from '../model/entity/entity_model';
import { boundMethod } from 'autobind-decorator';
import { EntityEvents } from '../constants/entity_events';
import { ItemsCollection } from '../collections/items_collection';
import { PlayerModel } from '../model/entity/player_model';

/**
 * Class representing main game controller. GameController is responsible for taking input from user and manipulating
 * game model and view in appriopiate way.
 */
export class GameController extends Controller {
  private dungeonController: DungeonController;
  private currentLevel: LevelController;
  private playerController: PlayerController;
  private view: GameView;
  private currentlyExaminedCell: Cell;
  /**
   * GameController class constructor.
   * @param   tileset    HTML Img element with tiles to draw.
   */
  constructor(tileset: HTMLImageElement) {
    super();

    this.dungeonController = new DungeonController();
    this.currentLevel = null;
    this.playerController = null;
    this.currentlyExaminedCell = null;

    this.view = new GameView(
      config.TILE_SIZE * config.ROWS,
      config.TILE_SIZE * config.COLUMNS,
      config.TILE_SIZE,
      tileset,
    );

    this.initialize();
    this.attachEvents();
    this.attachEventsToCurrentLevel();
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
      this.notify(DungeonEvents.ChangeCurrentLevel, {
        branch: this.dungeonController.getType(),
        levelNumber: 1,
      });
    }, 1);
  }

  /**
   * Attaches events to view and models.
   */
  private attachEvents(): void {
    this.view.on(this, CANVAS_CELL_CLICK, this.onCanvasCellClick);
    this.playerController.on(
      this,
      PlayerActions.PickUp,
      this.onPlayerControllerPickUp,
    );
    this.playerController.on(
      this,
      PLAYER_WALK_CONFIRM_NEEDED,
      this.onPlayerMoveConfirmNeeded.bind(this),
    );
    this.playerController.on(
      this,
      START_PLAYER_TURN,
      this.onPlayerStartTurn.bind(this),
    );
    this.playerController.on(
      this,
      END_PLAYER_TURN,
      this.onPlayerEndTurn.bind(this),
    );
    this.playerController.on(
      this,
      DungeonEvents.ChangeCurrentLevel,
      (data: IAnyObject) => {
        this.notify(DungeonEvents.ChangeCurrentLevel, data);
      },
    );

    this.dungeonController.on(
      this,
      DungeonEvents.ChangeCurrentLevel,
      this.onDungeonControllerLevelChange.bind(this),
    );
  }

  /**
   * Method responsible for attaching listening on events on current level.
   */
  private attachEventsToCurrentLevel(): void {
    this.currentLevel.on(this, PLAYER_DEATH, this.onPlayerDeath);
    this.currentLevel.on(this, EntityEvents.EntityHit, this.onEntityHit);
  }

  /**
   * Creates player character and adds it to proper level controller time engine.
   */
  private initializePlayer(): void {
    const inititalPlayerCell: Cell = this.currentLevel.getStairsUpCell();
    const playerLevel: LevelController = this.currentLevel;

    this.playerController = PlayerController.getInstance({
      level: playerLevel.model,
      levelController: playerLevel,
      display: entities.AVATAR,
      position: inititalPlayerCell,
      speed: 15,
      perception: 6,
      strength: 12,
      dexterity: 12,
      intelligence: 12,
      toughness: 12,
      hitPoints: 20,
      maxHitPoints: 20,
    });

    inititalPlayerCell.entity = this.playerController.getModel();
    this.playerController.calculateFov();
    this.currentLevel.addActorToTimeEngine(this.playerController);
    this.view.camera.centerOnCoordinates(
      inititalPlayerCell.x,
      inititalPlayerCell.y,
    );
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
      case PlayerActions.PickUp:
        this.playerPickUp();
        break;
      default:
      // placeholder
    }
  }

  /**
   * Makes attempt to descent player down one level in dungeon.
   */
  private descentDownLevel(): void {
    const playerPositionCellType: string =
      this.playerController.getEntityPosition().type;

    if (playerPositionCellType === cellTypes.STAIRS_DOWN) {
      this.dungeonController.changeLevel(
        this.dungeonController.getCurrentLevelNumber() + 1,
      );
    } else {
      globalMessagesController.showMessageInView("You can't go down here.");
    }
  }

  /**
   * Attempts player to pick something from ground.
   */
  private playerPickUp(): void {
    this.playerController.pickUp();
  }

  /**
   * Makes attempt to move player up one level in dungeon.
   */
  private ascendUpLevel(): void {
    const playerPositionCellType: string =
      this.playerController.getEntityPosition().type;

    if (playerPositionCellType === cellTypes.STAIRS_UP) {
      this.dungeonController.changeLevel(
        this.dungeonController.getCurrentLevelNumber() - 1,
      );
    } else {
      globalMessagesController.showMessageInView("You can't go up here.");
    }
  }

  /**
   * Method triggered after current level notifies player death event.
   */
  @boundMethod
  private onPlayerDeath(): void {
    this.view.clearGameWindowAnimations();
    this.notify(PLAYER_DEATH);
  }

  /**
   * Method triggered after notification from currently active level controller about entity taking damage.
   *
   * @param entity    Entity model
   */
  @boundMethod
  private onEntityHit(entity: EntityModel): void {
    this.view.showExplosionAtPosition({
      x: entity.position.x,
      y: entity.position.y,
    });
  }

  /**
   * Method triggered after dungeon controller notifies change on current level.
   *
   * @param data     Data passed along with event. Contains information about current level controller and
   *                 whether change of level was made through descending or ascending (used to calculate new player
   *                 position)
   */
  private onDungeonControllerLevelChange(data: {
    newLevelController: LevelController;
    direction: string;
  }): void {
    const { newLevelController, direction } = data;
    let newPlayerCell: Cell;

    if (newLevelController) {
      this.currentLevel.lockTimeEngine();
      this.currentLevel.removeActorFromTimeEngine(this.playerController);

      this.currentLevel = newLevelController;
      this.currentLevel.addActorToTimeEngine(this.playerController);
      this.attachEventsToCurrentLevel();

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
      this.playerController.changeLevel(
        this.currentLevel.getModel(),
        newPlayerCell,
      );
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
    const movementResult = await this.playerController.move(
      newPlayerCellPosition,
    );

    if (movementResult.canMove) {
      this.view.camera.centerOnCoordinates(
        newPlayerCellPosition.x,
        newPlayerCellPosition.y,
      );
      this.view.removeAllTemporaryMessages();
    } else {
      this.view.camera.centerOnCoordinates(
        playerModel.position.x,
        playerModel.position.y,
      );
    }
    if (movementResult.message && !(direction.x === 0 && direction.y === 0)) {
      this.notify(SHOW_MESSAGE_IN_VIEW, {
        message: movementResult.message,
      });
    }

    this.refreshGameScreen();
  }

  private activateObject(direction: IDirection): void {
    const { x, y } = direction;
    const playerModel = this.playerController.getModel();
    const playerXPosition = playerModel.position.x;
    const playerYPosition = playerModel.position.y;
    const activatedObjectCell = this.currentLevel.getCell(
      playerXPosition + x,
      playerYPosition + y,
    );

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

    this.view.changeGameScreenSize(
      newWidth,
      newHeight,
      this.currentLevel.getModel(),
      playerFov,
    );
  }

  /**
   * Method triggered when user clicks on game screen.
   */
  private onCanvasCellClick = (): void => {
    this.refreshGameScreen();
  };

  /**
   * Method triggered after player model notifies about needed movement confirm from player.
   * @param   data    Object with additional data about confirmation.
   */
  private onPlayerMoveConfirmNeeded(data: IAnyObject): void {
    this.notify(PLAYER_WALK_CONFIRM_NEEDED, data);
  }

  /**
   * Method called when player controller notifies that player attempts to pick up items when there are multiple items
   * on ground.
   *
   * @param cellItems    Collection of items from cell where player is
   */
  @boundMethod
  private onPlayerControllerPickUp(cellItems: ItemsCollection): void {
    this.notify(PlayerActions.PickUp, cellItems);
  }

  /**
   * Method triggered after player controller notifies about beginning of player turn.
   */
  private onPlayerStartTurn(): void {
    this.currentLevel.lockTimeEngine();
    this.playerController.calculateFov();
    this.refreshGameScreen();

    this.notify(START_PLAYER_TURN);
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
    this.view.drawScreen(
      this.currentLevel.getModel(),
      this.playerController.getFov(),
    );
  }

  /**
   * Displays information about cell in direction from currently examined cell.
   *
   * @param direction Direction object with x and y coordinates
   */
  public examineCellInDirection(direction: IDirection): void {
    const lastCell: Cell =
      this.currentlyExaminedCell || this.playerController.getEntityPosition();
    const nextCell: Cell = this.currentLevel.getCell(
      lastCell.x + direction.x,
      lastCell.y + direction.y,
    );
    if (nextCell) {
      const playerFov: Cell[] = this.playerController.getPlayerFov();
      const { x, y } = nextCell;

      if (playerFov.includes(nextCell)) {
        this.view.centerCameraOnCoordinates({ x, y });
        this.view.refreshScreen(this.currentLevel.getModel(), playerFov);
        this.view.drawAnimatedBorder(x, y);
        this.currentlyExaminedCell = nextCell;

        this.notify(EXAMINE_CELL, nextCell);
      }
    }
  }

  /**
   * Returns player name taken from player controller.
   */
  public getPlayerName(): string {
    return this.playerController.getName();
  }

  public getPlayerStats(): IEntityStatsObject {
    return this.playerController.getStatsObject();
  }

  public getPlayerStatsModifiers(): Partial<IEntityStatsObject> {
    return this.playerController.getStatsModifiers();
  }

  /**
   * Returns player inventory.
   * @returns  ItemsCollection
   */
  public getPlayerInventory(): ItemsCollection {
    return this.playerController.getPlayerInventory();
  }

  public getPlayerModel(): PlayerModel {
    return this.playerController.getModel();
  }

  /**
   * Returns inventory of a cell on which player is actually standing.
   */
  public getPlayerCellInventory(): ItemsCollection {
    return this.playerController.getEntityPositionInventory();
  }

  public enableExamineMode(): void {
    const playerCell: Cell = this.playerController.getEntityPosition();

    this.view.enableExamineMode();
    this.view.drawAnimatedBorder(playerCell.x, playerCell.y);
  }

  public disableExamineMode(): void {
    const playerCell: Cell = this.playerController.getEntityPosition();

    this.view.disableExamineMode();
    this.currentlyExaminedCell = null;
    this.view.centerCameraOnCoordinates({ x: playerCell.x, y: playerCell.y });
    this.view.refreshScreen(
      this.currentLevel.getModel(),
      this.playerController.getFov(),
    );

    this.notify(STOP_EXAMINE_CELL);
  }

  private onDevDungeonModalRefresh(): void {
    console.log('dungeon size change');
  }
}
