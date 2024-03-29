import { WalkAttemptResult } from './effects/walk_attempt_result';
import { UseAttemptResult } from './effects/use_attempt_result';
import { UseEffectResult } from './effects/use_effect_result';
import { IAnyObject } from '../../../interfaces/common';
import { BaseModel } from '../../../core/base.model';
import { EntityModel } from '../../../entity/models/entity.model';
import type { Entity } from '../../../entity/entities/entity';
import type { PlayerEntity } from '../../../entity/entities/player.entity';
import { ICellModel } from '../../interfaces/cell';
import { ItemsCollection } from '../../../items/items_collection';
import { MiscTiles } from '../../constants/sprites.constants';
import {
  CellSpecialConditions,
  cellSpecialConditionToWalkMessage,
  CellTypes,
} from '../../constants/cellTypes.constants';
import { dungeonState } from '../../../state/application.state';
import { SerializedItem } from '../../../items/models/item.model';
import { Position } from '../../../position/position';

export type SerializedCell = {
  id: string;
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

  public get position(): Position {
    return Position.fromCoords(this.x, this.y);
  }

  public get drawLightened(): boolean {
    return false;
  }

  /**
   * Entity (monster or player) occupying cell.
   */
  public get entity(): Entity {
    return dungeonState.entityManager.findEntityByCell(this);
  }

  /**
   * Display of cell to draw only if it is visible by player, otherwise displaySet is used
   */
  public get displayWhenVisible(): MiscTiles {
    if (
      this.specialConditions.has(CellSpecialConditions.DriedBlood) ||
      this.specialConditions.has(CellSpecialConditions.Bloody)
    ) {
      return MiscTiles.PoolOfBlood;
    }

    return null;
  }

  /**
   * Initializes cell and fills it with data. Data are imported from {@code cellTypes} object, where constructor parameter is used as key.
   *
   * @param   x       Horizontal position on level grid.
   * @param   y       Vertical position on level grid.
   * @param   config  Object with additional configuration data.
   */
  constructor(config: SerializedCell) {
    super(config);

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
  public walkEffect(entity?: Entity): void {
    // do nothing
  }

  /**
   * Method triggered when certain entity (usually player) tries to walk on cell. Default function is below empty
   * function. Can be implemented in child classes.
   */
  public walkAttempt(entity: PlayerEntity): WalkAttemptResult {
    return new WalkAttemptResult();
  }

  /**
   * Method triggered when certain entity (player included) uses cell. Default function, can be overriden in child
   * classes.
   */
  public useEffect(entity: Entity): UseEffectResult {
    return new UseEffectResult(false, "You can't activate that.");
  }

  /**
   * Method triggered when certain entity (usually player) tries to use cell. Default function, can be overriden in
   * child classes.
   */
  public useAttempt(entity: Entity): UseAttemptResult {
    return new UseAttemptResult();
  }

  public createPoolOfBlood(): void {
    this.specialConditions.add(CellSpecialConditions.Bloody);
  }

  public clearPoolOfBlood(): void {
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
      id: this.id,
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
