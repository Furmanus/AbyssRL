import * as Utility from '../../helper/utility';
import { config } from '../../global/config';
import {
  END_PLAYER_TURN,
  PLAYER_WALK_CONFIRM_NEEDED,
  PlayerActions,
  START_PLAYER_TURN,
} from '../../constants/entity/player_actions';
import { PlayerModel } from '../../model/entity/player_model';
import { globalMessagesController } from '../../global/messages';
import { IAnyFunction, IAnyObject } from '../../interfaces/common';
import { Cell } from '../../model/dungeon/cells/cell_model';
import { UseAttemptResult } from '../../model/dungeon/cells/effects/use_attempt_result';
import { UseEffectResult } from '../../model/dungeon/cells/effects/use_effect_result';
import { LevelModel } from '../../model/dungeon/level_model';
import { DungeonEvents } from '../../constants/dungeon_events';
import { ICombatResult } from '../../helper/combat_helper';
import { ItemsCollection } from '../../collections/items_collection';
import { MessagesController } from '../messages_controller';
import { ItemModel } from '../../model/items/item_model';
import { InventoryController } from '../inventory_controller';
import {
  globalContainerInventoryController,
  globalInventoryController,
} from '../../global/modal';
import {
  EntityEvents,
  EntityInventoryActions,
  InventoryModalEvents,
} from '../../constants/entity_events';
import { boundMethod } from 'autobind-decorator';
import { WeaponModel } from '../../model/items/weapons/weapon_model';
import {
  ContainerInventoryModalController,
  ContainerInventoryTransferData,
} from '../container_inventory_modal_controller';
import { ContainerInventoryModalEvents } from '../../constants/events/containerInventoryModalEvents';
import { ArmourModel } from '../../model/items/armours/armour_model';
import { EntityStatusFactory } from '../../factory/entity/entity_status_factory';
import { EntityStatusesCollection } from '../../collections/entity_statuses_collection';
import { globalInfoController } from '../../global/info_controller';
import { SerializedEntityModel } from '../../model/entity/entity_model';
import { dungeonState } from '../../state/application.state';
import { LevelController } from '../dungeon/level_controller';
import { EntityController } from './entity_controller';

export interface IMoveResolve {
  canMove: boolean;
  message: string;
  shouldEndPlayerTurn?: boolean;
}
interface IInventoryActionConfirmData {
  action: EntityInventoryActions;
  selectedItems: ItemModel[];
}

const constructorToken = Symbol('Player controller');
let instance: PlayerController;

export class PlayerController extends EntityController<PlayerModel> {
  public hasMoved = false;
  private globalMessageController: MessagesController =
    globalMessagesController;

  private globalInventoryController: InventoryController =
    globalInventoryController;

  private containerInventoryController = globalContainerInventoryController;
  private get currentLevelController(): LevelController {
    return dungeonState.getCurrentLevelController();
  }

  constructor(token: symbol, constructorConfig: SerializedEntityModel) {
    super();

    if (token !== constructorToken) {
      throw new Error('Invalid constructor');
    }

    this.model = new PlayerModel(constructorConfig);
    this.attachEvents();

    dungeonState.entityManager.addEntityToLevel(
      this,
      dungeonState.currentLevelNumber,
    );
  }

  public static getInstance(
    constructorConfig?: SerializedEntityModel,
  ): PlayerController {
    if (!constructorConfig && !instance) {
      throw new Error('Controller not initialized yet');
    }

    if (!instance) {
      instance = new PlayerController(constructorToken, constructorConfig);
    }

    return instance;
  }

  protected attachEvents(): void {
    super.attachEvents();

    this.model.on(
      this,
      EntityEvents.EntityModelStatusChange,
      this.onEntityStatusChange,
    );
    this.globalInventoryController.on(
      this,
      InventoryModalEvents.InventoryActionConfirmed,
      this.onInventoryActionConfirmed,
    );

    this.containerInventoryController.on(
      this,
      ContainerInventoryModalEvents.ItemsTransferred,
      this.onContainerInventoryModalItemsTransferred,
    );
  }

  @boundMethod
  private onInventoryActionConfirmed(data: IInventoryActionConfirmData): void {
    const { action, selectedItems } = data;

    if (!selectedItems.length) {
      this.globalInventoryController.closeModal();
      return;
    }

    if (action === EntityInventoryActions.Drop) {
      this.dropItems(selectedItems);
    } else if (action === EntityInventoryActions.PickUp) {
      this.pickUpItems(selectedItems);
    } else if (action === EntityInventoryActions.Equip) {
      this.equipItem(selectedItems[0]);
    }

    this.globalInventoryController.closeModal();
  }

  private onContainerInventoryModalItemsTransferred(
    data: ContainerInventoryTransferData,
  ): void {
    const { mode, items } = data;

    switch (mode) {
      case 'put':
        if (items.length === 1) {
          this.globalMessageController.showMessageInView(
            `You put ${items[0].fullDescription} into container.`,
          );
        } else if (items.length > 1) {
          this.globalMessageController.showMessageInView(
            `You put ${items.length} items into container.`,
          );
        }
        break;
      case 'withdraw':
        if (items.length === 1) {
          this.globalMessageController.showMessageInView(
            `You take ${items[0].fullDescription} from container.`,
          );
        } else if (items.length > 1) {
          this.globalMessageController.showMessageInView(
            `You take ${items.length} items from container.`,
          );
        }
        break;
    }

    if (items.length > 0) {
      this.endTurn();
    }
  }

  public dropItems(items: ItemModel[]): void {
    super.dropItems(items);

    this.notify(PlayerActions.EndPlayerTurn);
  }

  /**
   * Method triggered at beginning of each player turn.
   */
  public act(): void {
    super.act();

    this.notify(START_PLAYER_TURN);
    this.hasMoved = true;
  }

  /**
   * Method responsible for attempting to move player into target cell. A little bit magic happens here: function
   * returns a promise. If movement is instantly possible or not possible, promise is resolved immediately. If
   * confirmation from player is needed, game controller is notified about that. Along with notification, two
   * functions are passed. First is callback function triggered when player confirms movement, second is triggered
   * when player rejects movement attempt. Both those functions inside calls promise resolve function.
   *
   * @param       newCell     New target cell object.
   * @returns                 Returns promise. Resolved promise returns object with data with information whether
   *                          move is allowed and movement message.
   */
  public move(newCell: Cell): Promise<IMoveResolve> {
    const { x, y } = newCell;
    const playerController = this;
    const playerModel = this.model;

    if (
      x < 0 ||
      y < 0 ||
      x > config.LEVEL_WIDTH - 1 ||
      y > config.LEVEL_HEIGHT - 1
    ) {
      throw new Error('Entity moved beyond level grid');
    }

    return new Promise((resolve) => {
      if (this.isStunned()) {
        this.makeRandomMovement(resolve);
      } else if (newCell.blockMovement) {
        playerController.moveAttempt(newCell, resolve);
      } else if (newCell.confirmMovement) {
        if (newCell.type === playerModel.position.type) {
          playerController.moveAttempt(newCell, resolve);
        } else {
          /**
           * Magic part: promise is not resolved here, instead game controller is notified about needed
           * movement confirmation from player. Along with notification object two functions are passed. One
           * function is called after player confirms movement, other when player rejects. Both function
           * calls promise resolve.
           */
          playerController.notify(PLAYER_WALK_CONFIRM_NEEDED, {
            message: `Do you really want to walk into ${newCell.description}? (y/n)`,
            confirm: () => {
              playerController.moveAttempt(newCell, resolve);
            },
            decline: () => {
              resolve({
                canMove: false,
                message: 'You abort your attempt.',
                shouldEndPlayerTurn: false,
              });
            },
          });
        }
      } else {
        playerController.moveAttempt(newCell, resolve);
      }
    });
  }

  /**
   * Method responsible for attempt to activate certain cell.
   *
   * @param   cell    Cell model which player is trying to activate
   */
  public activate(cell: Cell): void {
    /**
     * In first step, attempt to use cell is made. Method returns useAttemptResult object, which describes
     * effect and result of attempt (is attempt was successful, message to display and if attempt should end
     * player turn.
     */
    const useAttemptResult: UseAttemptResult = cell.useAttempt(this);
    let useEffect: UseEffectResult;

    globalMessagesController.showMessageInView(useAttemptResult.message);
    if (useAttemptResult.canUse) {
      /**
       * If attempt was successful, player entity uses target cell.
       */
      useEffect = cell.useEffect(this);

      globalMessagesController.showMessageInView(useEffect.message);
      if (useEffect.endTurn) {
        this.notify(END_PLAYER_TURN);
      }
    } else {
      if (useAttemptResult.endTurn) {
        this.notify(END_PLAYER_TURN);
      }
    }
  }

  /**
   * Attempts to pick up item from ground (ie. removing it from Cell inventory and moving to entity inventory).
   */
  public pickUp(): void {
    const currentCellInventory: ItemsCollection =
      this.model.getCurrentCellInventory();

    if (currentCellInventory.size === 0) {
      globalMessagesController.showMessageInView(
        'What do you want to pick up?',
      );
    } else if (currentCellInventory.size === 1) {
      this.model.pickUp(currentCellInventory.getFirstItem());
    } else {
      /* Notify to open inventory modal */
      this.notify(PlayerActions.PickUp, currentCellInventory);
    }
  }

  /**
   * Picks up items from given collection. For every items from collection pickUp method from model is called.
   *
   * @param items     Collection of items to pick up.
   */
  public pickUpItems(items: ItemModel[]): void {
    items.forEach((item: ItemModel) => {
      this.model.pickUp(item);
    });
  }

  public onEntityPickUp(item: ItemModel): void {
    super.onEntityPickUp(item);

    this.notify(PlayerActions.EndPlayerTurn);
  }

  public equipItem(item: ItemModel): void {
    if (item instanceof WeaponModel) {
      this.model.equipWeapon(item);
    } else if (item instanceof ArmourModel) {
      item.wear(this.model);
    }
  }

  /**
   * Function called when move attempt by player was successful. Called inside of move function.
   *
   * @param   cellModel                   Cell model where player moves
   * @param   promiseResolveFunction      Resolve function from promise returned by move method
   */
  public moveAttempt(
    cellModel: Cell,
    promiseResolveFunction: (moveResult: IMoveResolve) => void,
  ): void {
    const entityMoveFunction = super.move.bind(this);
    const walkAttemptCellResult = cellModel.walkAttempt(this);
    const canPlayerMove = walkAttemptCellResult.canMove;
    const newCellBlocksMovement = cellModel.blockMovement;
    let moveAttemptMessage = walkAttemptCellResult.message;

    if (newCellBlocksMovement) {
      promiseResolveFunction({
        canMove: false,
        message: `${Utility.capitalizeString(
          cellModel.description,
        )} is blocking your way.`,
        shouldEndPlayerTurn: false,
      });
      return;
    }
    if (cellModel.entity && cellModel.entity.type !== 'player') {
      if (cellModel.entity.isHostile) {
        const attackResult: ICombatResult = this.attack(cellModel.entity);

        promiseResolveFunction({
          canMove: false,
          message: attackResult.message,
          shouldEndPlayerTurn: true,
        });
      } else {
        promiseResolveFunction({
          canMove: false,
          message: `${Utility.capitalizeString(
            cellModel.entity.description,
          )} is in your way.`,
          shouldEndPlayerTurn: false,
        });
      }
      return;
    }

    if (canPlayerMove) {
      entityMoveFunction(cellModel);

      if (cellModel.walkMessage) {
        moveAttemptMessage = cellModel.walkMessage;
      }
    }

    promiseResolveFunction({
      canMove: canPlayerMove,
      message: moveAttemptMessage,
      shouldEndPlayerTurn: true,
    });
  }

  /**
   * Returns player field of view.
   */
  public getPlayerFov(): Cell[] {
    return this.model.fov;
  }

  /**
   * Returns player name.
   */
  public getName(): string {
    return this.model.description;
  }

  /**
   * Returns player inventory.
   * @returns Player inventory (ItemCollection)
   */
  public getPlayerInventory(): ItemsCollection {
    return this.model.inventory;
  }

  public endTurn(): void {
    this.notify(END_PLAYER_TURN);
  }

  public healPlayer(): void {
    this.model.setCurrentHpToMax();

    this.endTurn();
  }

  public openContainer(containerInventory: ItemsCollection): void {
    this.containerInventoryController.openModal();
    this.containerInventoryController.init(
      containerInventory,
      this.getPlayerInventory(),
    );
  }

  private onEntityStatusChange(statuses: EntityStatusesCollection): void {
    globalInfoController.setEntityStatusesInView(statuses);
  }

  public makeRandomMovement(
    resolveFunction: (moveResolution: IMoveResolve) => void,
  ): void {
    const randomNearestCell = this.currentLevelController.model
      .getCellNeighbours(this.getEntityPosition())
      .random();

    this.moveAttempt(randomNearestCell, resolveFunction);
  }
}
