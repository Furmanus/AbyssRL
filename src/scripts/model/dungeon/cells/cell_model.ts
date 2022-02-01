import { WalkAttemptResult } from './effects/walk_attempt_result';
import { UseAttemptResult } from './effects/use_attempt_result';
import { UseEffectResult } from './effects/use_effect_result';
import { IAnyObject } from '../../../interfaces/common';
import { BaseModel } from '../../../core/base_model';
import { EntityModel } from '../../entity/entity_model';
import type { EntityController } from '../../../controller/entity/entity_controller';
import type { PlayerController } from '../../../controller/entity/player_controller';
import { ICellModel } from '../../../interfaces/cell';
import { ItemsCollection } from '../../../collections/items_collection';
import { MiscTiles } from '../../../constants/cells/sprites';
import {
  CellSpecialConditions,
  cellSpecialConditionToWalkMessage,
  CellTypes,
} from '../../../constants/cells/cell_types';
import { DungeonStateEntityManager } from '../../../state/managers/dungeonStateEntity.manager';
import { dungeonState } from '../../../state/application.state';
import { SerializedItem } from '../../items/item_model';

export type SerializedCell = {
  x: number;
  y: number;
  inventory: SerializedItem[];
  wasDiscoveredByPlayer: boolean;
  specialConditions: CellSpecialConditions[];
  type: CellTypes;
  containerInventory: SerializedItem[];
};

/**
 * Class representing single map square(field).
 */
export abstract class Cell extends BaseModel implements ICellModel {
  /**
   * Horizontal position on level grid.
   */
  public x: number;
  /**
   * Vertical position on level grid.
   */
  public y: number;
  /**
   * Array of items in cell.
   */
  public inventory: ItemsCollection = new ItemsCollection();
  /**
   * Boolean variable indicating whether cells display can be changed or not.
   */
  public preventDisplayChange: boolean = false;
  public description: string;
  /**
   * Variable indicating if cell was discovered by player (used for purpose of drawing visited but not currently
   * visible cells)
   */
  public wasDiscoveredByPlayer: boolean = false;
  /**
   * Whether confirmation from player is needed before entering cell.
   */
  public confirmMovement: boolean = false;
  /**
   * // TODO write description later
   */
  public displaySet: string = null;
  /**
   * Display of cell to draw only if it is visible by player, otherwise displaySet is used
   */
  public displayWhenVisible: string = null;
  /**
   * Array of strings describing cell special conditions, for example pool of blood which might be slippery
   */
  public specialConditions = new Set<CellSpecialConditions>();
  /**
   * Type of cell.
   */
  public type: CellTypes = null;
  /**
   * Inventory of cell container, difference between container inventory and inventory is that items in inventory are
   * seen as laying on ground and containerInventory must be activated to display modal with inventory.
   */
  public containerInventory: ItemsCollection = null;
  /**
   * Whether cell is container, so it can be activated to display its inventory in separate modal
   */
  public get isContainer(): boolean {
    return Array.isArray(this.containerInventory);
  }

  /**
   * Entity (monster or player) occupying cell.
   */
  public get entity(): EntityModel {
    return dungeonState.entityManager.findEntityByCell(this)?.getModel();
  }

  /**
   * Initializes cell and fills it with data. Data are imported from {@code cellTypes} object, where constructor parameter is used as key.
   *
   * @param   x       Horizontal position on level grid.
   * @param   y       Vertical position on level grid.
   * @param   config  Object with additional configuration data.
   */
  constructor(config: SerializedCell) {
    super();

    this.x = config.x;
    this.y = config.y;

    if (config) {
      this.specialConditions = new Set(config.specialConditions);
      this.containerInventory = ItemsCollection.getInstanceFromSerializedData(
        config.containerInventory,
      );
      this.inventory = ItemsCollection.getInstanceFromSerializedData(
        config.inventory,
      );
      this.wasDiscoveredByPlayer = config.wasDiscoveredByPlayer;
    }
  }

  /**
   * Whether cell blocks entity movement.
   */
  get blockMovement(): boolean {
    return false;
  }

  /**
   * Whether cell blocks entities line of sight.
   */
  get blocksLos(): boolean {
    return false;
  }

  /**
   * String pointing which sprite should be used as cell display. Must be implemented in sub classes.
   */
  abstract get display(): string;

  abstract set display(display: string);

  /**
   * Message displayed when player walks over cell.
   */
  get walkMessage(): string {
    return this.cellSpecialConditionsToWalkMessage();
  }

  /**
   * Object with properties which are modified in entities who enters this cell.
   */
  get modifiers(): IAnyObject {
    return null;
  }

  /**
   * Enables possibility to change cell display.
   */
  public enableDisplayChange(): void {
    this.preventDisplayChange = false;
  }

  /**
   * Disables possibility to change cell display.
   */
  public disableDisplayChange(): void {
    this.preventDisplayChange = true;
  }

  /**
   * Changes display of cell.
   *
   * @param   tiles   Array of new tiles names.
   */
  public changeDisplay(tiles: string[]): void {
    if (!this.preventDisplayChange) {
      this.displaySet = tiles.random();
    }
  }

  /**
   * Effect from certain cell while entity walks over it. Default function is below empty function. Can be implemented
   * in child classes.
   */
  public walkEffect(entity?: EntityController): void {
    // do nothing
  }

  /**
   * Method triggered when certain entity (usually player) tries to walk on cell. Default function is below empty
   * function. Can be implemented in child classes.
   */
  public walkAttempt(entity: PlayerController): WalkAttemptResult {
    return new WalkAttemptResult();
  }

  /**
   * Method triggered when certain entity (player included) uses cell. Default function, can be overriden in child
   * classes.
   */
  public useEffect(entity: EntityController): UseEffectResult {
    return new UseEffectResult(false, "You can't activate that.");
  }

  /**
   * Method triggered when certain entity (usually player) tries to use cell. Default function, can be overriden in
   * child classes.
   */
  public useAttempt(entity: EntityController): UseAttemptResult {
    return new UseAttemptResult();
  }

  public createPoolOfBlood(): void {
    this.displayWhenVisible = MiscTiles.PoolOfBlood;
    this.specialConditions.add(CellSpecialConditions.Bloody);
  }

  public clearPoolOfBlood(): void {
    this.displayWhenVisible = null;
    this.specialConditions.delete(CellSpecialConditions.Bloody);
  }

  public dryPoolOfBlood(): void {
    if (this.specialConditions.has(CellSpecialConditions.Bloody)) {
      this.specialConditions.delete(CellSpecialConditions.Bloody);
      this.specialConditions.add(CellSpecialConditions.DriedBlood);
    }
  }

  private cellSpecialConditionsToWalkMessage(): string {
    return Array.from(this.specialConditions).reduce((result, condition) => {
      if (!(condition in cellSpecialConditionToWalkMessage)) {
        return result;
      }

      if (result === '') {
        return cellSpecialConditionToWalkMessage[condition];
      } else {
        return `${result}. ${cellSpecialConditionToWalkMessage[condition]}`;
      }
    }, '');
  }

  public getDataToSerialization(): SerializedCell {
    return {
      x: this.x,
      y: this.y,
      type: this.type,
      specialConditions: Array.from(this.specialConditions),
      wasDiscoveredByPlayer: this.wasDiscoveredByPlayer,
      inventory: this.inventory?.getDataForSerialization(),
      containerInventory: this.containerInventory?.getDataForSerialization(),
    };
  }
}
