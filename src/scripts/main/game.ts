import { GameView } from './game.view';
import { config } from '../global/config';
import { CANVAS_CELL_CLICK } from './constants/gameActions.constants';
import { entities } from '../dungeon/constants/sprites.constants';
import { PlayerActions } from './constants/playerActions.constants';
import { PlayerEntity } from '../entity/entities/player.entity';
import { Dungeon } from '../dungeon/dungeon';
import { Cell } from '../dungeon/models/cells/cell_model';
import { IAnyObject, IDirection } from '../interfaces/common';
import { CellTypes } from '../dungeon/constants/cellTypes.constants';
import { globalMessagesController } from '../messages/messages.service';
import { ASCEND, DESCEND } from '../constants/directions';
import { EntityDungeonPosition, IEntityStatsObject } from '../entity/models/entity.model';
import { ItemsCollection } from '../items/items_collection';
import { PlayerModel } from '../entity/models/player.model';
import { dungeonState } from '../state/application.state';
import { reaction } from 'mobx';
import { Position } from '../position/position';
import { MonstersTypes } from '../entity/constants/monsters';
import { entityEventBus } from '../eventBus/entityEventBus/entityEventBus';
import { EntityEventBusEventNames } from '../eventBus/entityEventBus/entityEventBus.constants';
import { Entity } from '../entity/entities/entity';
import { exhaustiveCheck } from '../utils/utility';

/**
 * Class representing main game controller. GameController is responsible for taking input from user and manipulating
 * game model and view in appriopiate way.
 */
export class Game {
  private dungeonController: Dungeon;
  private playerController: PlayerEntity;
  private view: GameView;
  private currentlyExaminedCell: Cell;
  /**
   * GameController class constructor.
   * @param   tileset    HTML Img element with tiles to draw.
   */
  constructor(tileset: HTMLImageElement) {
    this.dungeonController = new Dungeon();
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
    this.startGame();
  }

  /**
   * Method responsible for initialization of game controller.
   */
  protected initialize(): void {
    this.initializePlayer();
    this.drawLevelInView();
  }

  /**
   * Attaches events to view and models.
   */
  private attachEvents(): void {
    this.view.on(CANVAS_CELL_CLICK, this.onCanvasCellClick);

    entityEventBus.subscribe(EntityEventBusEventNames.PlayerTurnStart, this.onPlayerStartTurn);
    entityEventBus.subscribe(EntityEventBusEventNames.PlayerEndTurn, this.onPlayerEndTurn);
    entityEventBus.subscribe(EntityEventBusEventNames.EntityMove, this.onEntityMove);
    entityEventBus.subscribe(EntityEventBusEventNames.EntityDeath, this.onEntityDeath);
    entityEventBus.subscribe(EntityEventBusEventNames.EntityHit, this.onEntityHit);

    reaction(
      () => dungeonState.currentLevelNumber,
      (currentLevelNumber, previousLevelNumber) => {
        const direction =
          Math.sign(currentLevelNumber - previousLevelNumber) === 1
            ? DESCEND
            : ASCEND;
        // TODO przeanalizować logikę i zrefaktorować
        if (!dungeonState.doesLevelExist(currentLevelNumber)) {
          this.dungeonController.generateNewLevelAtNumber(currentLevelNumber);
        }
        this.onDungeonStateCurrentLevelChange(
          previousLevelNumber,
          currentLevelNumber,
        );
      },
    );
  }

  /**
   * Creates player character and adds it to proper level controller time engine.
   */
  private initializePlayer(): void {
    const currentLevel = dungeonState.getCurrentLevelController();
    const initialPlayerCell: Cell = currentLevel.getStairsUpCell();

    this.playerController = PlayerEntity.getInstance({
      id: null,
      display: entities.AVATAR,
      position: {
        branch: dungeonState.currentBranch,
        level: dungeonState.currentLevelNumber,
        position: new Position(initialPlayerCell.x, initialPlayerCell.y),
      },
      speed: 100,
      perception: 6,
      strength: 12,
      dexterity: 12,
      intelligence: 12,
      toughness: 12,
      hitPoints: 20,
      maxHitPoints: 20,
      type: MonstersTypes.Player,
      equippedWeapon: null,
      equippedArmour: null,
      entityStatuses: [],
    });

    this.playerController.calculateFov();

    currentLevel.addActorToTimeEngine(this.playerController);

    this.view.camera.centerOnCoordinates(
      this.playerController.getModel().position.x,
      this.playerController.getModel().position.y,
    );
  }

  /**
   * Starts game by starting time engine on current level.
   */
  private startGame(): void {
    const currentLevelController = dungeonState.getCurrentLevelController();

    if (currentLevelController) {
      currentLevelController.startTimeEngine();
    } else {
      throw new Error('Current level controller not found');
    }
  }

  /**
   * Method responsible for processing user input and taking proper actions(methods) depending on input.
   *
   * @param   action  String describing type of action.
   * @param   data    Object containing additional data.
   */
  public takePlayerAction(action: PlayerActions, data?: IAnyObject): void {
    switch (action) {
      case PlayerActions.Move:
        this.movePlayer(data as IDirection);
        break;
      case PlayerActions.ActivateObject:
        this.activateObject(data as IDirection);
        break;
      case PlayerActions.GoUp:
        this.ascendUpLevel();
        break;
      case PlayerActions.GoDown:
        this.descentDownLevel();
        break;
      case PlayerActions.PickUp:
        this.playerPickUp();
        break;
      default:
        exhaustiveCheck(action);
    }
  }

  /**
   * Makes attempt to descent player down one level in dungeon.
   */
  private descentDownLevel(): void {
    const playerPositionCellType: string =
      this.playerController.getEntityPosition().type;

    if (playerPositionCellType === CellTypes.StairsDown) {
      this.dungeonController.changeLevel(dungeonState.currentLevelNumber + 1);
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

    if (playerPositionCellType === CellTypes.StairsUp) {
      this.dungeonController.changeLevel(dungeonState.currentLevelNumber - 1);
    } else {
      globalMessagesController.showMessageInView("You can't go up here.");
    }
  }

  private onEntityDeath = (entity: Entity): void => {
    if (entity.getModel().type === MonstersTypes.Player) {
      this.view.clearGameWindowAnimations();
    }
  }

  private onEntityHit = (entity: Entity): void => {
    const dungeonPosition = entity.getModel().entityPosition;

    if (dungeonState.isPositionInCurrentLevel(dungeonPosition)) {
      this.view.showExplosionAtPosition(
        {
          x: dungeonPosition.position.x,
          y: dungeonPosition.position.y,
        },
        entity.getModel(),
      );
    }
  }

  private onEntityMove = (entity: Entity, newPosition: EntityDungeonPosition, oldPosition: EntityDungeonPosition): void => {
    if (dungeonState.isPositionInCurrentLevel(newPosition)) {
      this.view.updateEntityPositionInTemporaryDrawnSprites(entity.getModel());
    }
  }

  private onDungeonStateCurrentLevelChange(
    previousLevelNumber: number,
    currentLevelNumber: number,
  ): void {
    const direction =
      Math.sign(currentLevelNumber - previousLevelNumber) === 1
        ? DESCEND
        : ASCEND;
    const previousLevelController = dungeonState.getLevelController(
      dungeonState.currentBranch,
      previousLevelNumber,
    );
    const newLevelController = dungeonState.getCurrentLevelController();
    let newPlayerCell: Cell;

    if (newLevelController) {
      previousLevelController.lockTimeEngine();
      previousLevelController.removeActorFromTimeEngine(this.playerController);

      newLevelController.addActorToTimeEngine(this.playerController);

      if (newLevelController.wasTimeEngineStarted()) {
        newLevelController.unlockTimeEngine();
      } else {
        newLevelController.startTimeEngine();
      }

      if (direction === ASCEND) {
        newPlayerCell = newLevelController.getStairsDownCell();
      } else {
        newPlayerCell = newLevelController.getStairsUpCell();
      }
      this.playerController.changeLevel(
        previousLevelNumber,
        currentLevelNumber,
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
    const currentLevel = dungeonState.getCurrentLevelController();
    const playerModel = this.playerController.getModel();
    const newCellCoordinateX = playerModel.position.x;
    const newCellCoordinateY = playerModel.position.y;
    const newPlayerCellPosition = currentLevel.getCell(
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
      this.view.removeAllTemporaryMessages();
    }

    if (movementResult.message && !(direction.x === 0 && direction.y === 0)) {
      globalMessagesController.showMessageInView(movementResult.message);
    }

    if (movementResult.shouldEndPlayerTurn) {
      this.onPlayerEndTurn();
    }

    this.view.camera.centerOnCoordinates(
      playerModel.position.x,
      playerModel.position.y,
    );

    this.refreshGameScreen();
  }

  private activateObject(direction: IDirection): void {
    const currentLevel = dungeonState.getCurrentLevelController();
    const { x, y } = direction;
    const playerModel = this.playerController.getModel();
    const playerXPosition = playerModel.position.x;
    const playerYPosition = playerModel.position.y;
    const activatedObjectCell = currentLevel.getCell(
      playerXPosition + x,
      playerYPosition + y,
    );

    this.playerController.activate(activatedObjectCell);
  }

  /**
   * Method responsible for refreshing game screen.
   */
  private refreshGameScreen(): void {
    const levelModel = dungeonState.getCurrentLevelController().getModel();
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
    const levelModel = dungeonState.getCurrentLevelController().getModel();
    const playerFov = this.playerController.getPlayerFov();

    this.view.changeGameScreenSize(newWidth, newHeight, levelModel, playerFov);
  }

  /**
   * Method triggered when user clicks on game screen.
   */
  private onCanvasCellClick = (): void => {
    this.refreshGameScreen();
  };

  /**
   * Method triggered after player controller notifies about beginning of player turn.
   */
  private onPlayerStartTurn = (): void => {
    const currentLevel = dungeonState.getCurrentLevelController();

    currentLevel.lockTimeEngine();
    this.playerController.calculateFov();
    this.refreshGameScreen();
  };

  /**
   * Method triggered after player controller notifies about end of player turn.
   */
  private onPlayerEndTurn = (): void => {
    const currentLevel = dungeonState.getCurrentLevelController();

    currentLevel.unlockTimeEngine();
  };

  /**
   * Draws current level on canvas game view.
   */
  private drawLevelInView(): void {
    const levelModel = dungeonState.getCurrentLevelController().getModel();

    this.view.drawScreen(levelModel, this.playerController.getFov());
  }

  /**
   * Displays information about cell in direction from currently examined cell.
   *
   * @param direction Direction object with x and y coordinates
   */
  public examineCellInDirection(direction: IDirection): Cell {
    const currentLevel = dungeonState.getCurrentLevelController();
    const lastCell =
      this.currentlyExaminedCell || this.playerController.getEntityPosition();
    const nextCell = currentLevel.getCell(
      lastCell.x + direction.x,
      lastCell.y + direction.y,
    );
    if (nextCell) {
      const playerFov = this.playerController.getPlayerFov();
      const { x, y } = nextCell;

      if (playerFov.includes(nextCell)) {
        this.view.centerCameraOnCoordinates({ x, y });
        this.view.refreshScreen(currentLevel.getModel(), playerFov);
        this.view.drawAnimatedBorder(x, y);
        this.currentlyExaminedCell = nextCell;

        return nextCell;
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
    const playerCell = this.playerController.getEntityPosition();

    this.view.enableExamineMode();
    this.view.drawAnimatedBorder(playerCell.x, playerCell.y);
  }

  public disableExamineMode(): void {
    const levelModel = dungeonState.getCurrentLevelController().getModel();
    const playerCell = this.playerController.getEntityPosition();

    this.view.disableExamineMode();
    this.currentlyExaminedCell = null;
    this.view.centerCameraOnCoordinates({ x: playerCell.x, y: playerCell.y });
    this.view.refreshScreen(levelModel, this.playerController.getFov());
  }

  private onDevDungeonModalRefresh(): void {
    console.log('dungeon size change');
  }
}
