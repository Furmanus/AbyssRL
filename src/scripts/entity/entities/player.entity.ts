import * as Utility from '../../utils/utility';
import { applicationConfigService, config } from '../../global/config';
import { PlayerModel } from '../models/player.model';
import {
  globalMessagesController,
} from '../../messages/messages.service';
import { Cell } from '../../dungeon/models/cells/cell_model';
import { UseAttemptResult } from '../../dungeon/models/cells/effects/use_attempt_result';
import { UseEffectResult } from '../../dungeon/models/cells/effects/use_effect_result';
import { ICombatResult } from '../../combat/combatHelper';
import { ItemsCollection } from '../../items/items_collection';

import { ItemModel } from '../../items/models/item.model';
import {
  globalContainerInventoryController, globalInventoryController,
} from '../../global/modal';
import { SerializedEntityModel } from '../models/entity.model';
import { dungeonState } from '../../state/application.state';
import { Level } from '../../dungeon/level';
import { Entity } from './entity';
import { TestFeaturesService } from '../../utils/test_features.service';
import { entityEventBus } from '../../eventBus/entityEventBus/entityEventBus';
import { EntityEventBusEventNames } from '../../eventBus/entityEventBus/entityEventBus.constants';
import { exhaustiveCheck } from '../../utils/utility';
import { EntityInventoryActions } from '../../inventory/inventory.constants';
import { gameEventBus } from '../../eventBus/gameEventBus/gameEventBus';
import { GameEventBusEventNames } from '../../eventBus/gameEventBus/gameEventBus.constants';

export interface IMoveResolve {
  canMove: boolean;
  message: string;
  shouldEndPlayerTurn?: boolean;
}

const constructorToken = Symbol('Player controller');
let instance: PlayerEntity;

export class PlayerEntity extends Entity<PlayerModel> {
  public hasMoved = false;
  private containerInventoryController = globalContainerInventoryController;
  private get currentLevelController(): Level {
    return dungeonState.getCurrentLevelController();
  }

  constructor(token: symbol, constructorConfig: SerializedEntityModel) {
    super();

    if (token !== constructorToken) {
      throw new Error('Invalid constructor');
    }

    this.model = new PlayerModel(constructorConfig);

    if (applicationConfigService.isTestMode || applicationConfigService.isDevMode) {
      window._application.playerModel = this.model;
    }

    dungeonState.entityManager.addEntityToLevel(
      this,
      dungeonState.currentLevelNumber,
    );
  }

  public static getInstance(
    constructorConfig?: SerializedEntityModel,
  ): PlayerEntity {
    if (!constructorConfig && !instance) {
      throw new Error('Controller not initialized yet');
    }

    if (!instance) {
      instance = new PlayerEntity(constructorToken, constructorConfig);

      instance.initialize();
    }

    return instance;
  }

  public initialize(): void {
    TestFeaturesService.getInstance().initPlayerData(this);
  }

  public dropItems(items: ItemModel[]): void {
    super.dropItems(items);

    this.endTurn();
  }

  /**
   * Method triggered at beginning of each player turn.
   */
  public act(): void {
    super.act();

    entityEventBus.publish(EntityEventBusEventNames.PlayerTurnStart);
    this.hasMoved = true;
  }

  /**
   * Method responsible for attempting to move player into target cell. Function
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
          gameEventBus.publish(
            GameEventBusEventNames.PlayerMovementConfirmNeeded,
            `Do you really want to walk into ${newCell.description}? (y/n)`,
            () => {
              playerController.moveAttempt(newCell, resolve);
            },
            () => {
              resolve({
                canMove: false,
                message: 'You abort your attempt.',
                shouldEndPlayerTurn: false,
              });
            },
          );
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
        this.endTurn();
      }
    } else {
      if (useAttemptResult.endTurn) {
        this.endTurn();
      }
    }
  }

  /**
   * Attempts to pick up item from ground (ie. removing it from Cell inventory and moving to entity inventory).
   */
  public async pickUp(): Promise<void> {
    const currentCellInventory: ItemsCollection =
      this.model.getCurrentCellInventory();

    if (currentCellInventory.size === 0) {
      globalMessagesController.showMessageInView(
        'What do you want to pick up?',
      );
    } else if (currentCellInventory.size === 1) {
      this.pickUpItems([currentCellInventory.getFirstItem()]);
    } else {
      const itemsSelectedToPickUp = await globalInventoryController.openModal(currentCellInventory, EntityInventoryActions.PickUp).waitForPlayerSelection();

      if (itemsSelectedToPickUp?.selectedItems.size) {
        this.pickUpItems(itemsSelectedToPickUp.selectedItems.get());
      }

      globalInventoryController.closeModal();
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

    entityEventBus.publish(EntityEventBusEventNames.EntityPickItem, this, items);

    this.endTurn();
  }

  public addItemToInventory(item: ItemModel[]): void {
    this.model.addItemToInventory(item);
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
      if (cellModel.entity.getModel().isHostile) {
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
            cellModel.entity.getModel().description,
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
    entityEventBus.publish(EntityEventBusEventNames.PlayerEndTurn);
  }

  public healPlayer(): void {
    this.model.setCurrentHpToMax();

    this.endTurn();
  }

  public async openContainer(cell: Cell): Promise<void> {
    const { containerInventory } = cell;
    this.containerInventoryController.openModal();
    this.containerInventoryController.init(
      containerInventory,
      this.getPlayerInventory(),
    );
    const selectionResult = await this.containerInventoryController.waitForPlayerSelection();

    if (selectionResult?.items.length > 0) {
      const { items, mode } = selectionResult;

      switch (mode) {
        case 'put':
          this.removeFromInventory(items);
          cell.containerInventory.add(items);
          break;
        case 'withdraw':
          cell.containerInventory.remove(items);
          this.addItemToInventory(items);
          break;
        default:
          exhaustiveCheck(mode);
      }

      entityEventBus.publish(EntityEventBusEventNames.EntityTransferItemsContainer, this, cell, items, mode);
    }

    this.containerInventoryController.closeModal();
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
