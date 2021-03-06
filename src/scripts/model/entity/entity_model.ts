import { BaseModel } from '../../core/base_model';
import { IAnyObject } from '../../interfaces/common';
import { Cell } from '../dungeon/cells/cell_model';
import { LevelModel } from '../dungeon/level_model';
import { EntityEvents } from '../../constants/entity_events';
import { IEntity } from '../../interfaces/entity_interfaces';
import {
  EntityStats,
  MonsterSizes,
  MonstersTypes,
} from '../../constants/monsters';
import { ItemsCollection } from '../../collections/items_collection';
import { INaturalWeapon, IWeapon } from '../../interfaces/combat';
import { ItemModel } from '../items/item_model';
import { weaponModelFactory } from '../../factory/item/weapon_model_factory';
import { WeaponModel } from '../items/weapons/weapon_model';
import { NaturalWeaponModel } from '../items/weapons/natural_weapon_model';

export interface IEntityStatsObject {
  [EntityStats.Strength]: number;
  [EntityStats.Dexterity]: number;
  [EntityStats.Intelligence]: number;
  [EntityStats.Toughness]: number;
  [EntityStats.Perception]: number;
  [EntityStats.Speed]: number;
  [EntityStats.HitPoints]: number;
  [EntityStats.MaxHitPoints]: number;
}

export class EntityModel extends BaseModel implements IEntity {
  /**
   * Visible sprite of entity. Member of file constants/sprites.js.
   */
  public display: string;
  /**
   * Level model where entity is.
   */
  public level: LevelModel;
  /**
   * Cell model where entity is.
   */
  public position: Cell;
  /**
   * Cell model where entity was in last turn.
   */
  public lastVisitedCell: Cell = null;
  public strength: number = null;
  public dexterity: number = null;
  public toughness: number = null;
  public intelligence: number = null;
  /**
   * Speed statistic of entity. Important stat, used by time engine to calculate how often entity should act.
   */
  public speed: number = null;
  public perception: number = null;
  /**
   * Array of cell model which are in entity field of view
   */
  public fov: Cell[] = [];
  /**
   * Description (usually text to display) of entity.
   */
  public description: string = 'unknown entity';
  /**
   * Type of entity.
   */
  public type: MonstersTypes = MonstersTypes.Unknown;
  /**
   * Is entity hostile to player.
   */
  public isHostile: boolean = false;
  public hitPoints: number = null;
  public maxHitPoints: number = null;
  public size: MonsterSizes = null;
  // TODO remove content of collection
  public inventory: ItemsCollection = new ItemsCollection([
    weaponModelFactory.getRandomWeaponModel(),
    weaponModelFactory.getRandomWeaponModel(),
  ]);

  /**
   * Natural weapon (for example fist, bite) used when entity is attacking without any weapon.
   */
  public naturalWeapon: IWeapon = null;
  public equippedWeapon: IWeapon = null;
  /**
   * Value of entity armour protection. Used to calculate how much of damage dealt will be absorbed by armor.
   */
  public protection: number = 0;

  get weapon(): IWeapon {
    return this.equippedWeapon || this.naturalWeapon;
  }

  constructor(config: IAnyObject) {
    super();

    this.display = config.display;
    this.level = config.level;
    this.position = config.position;
    this.lastVisitedCell = config.lastVisitedCell || null;
    this.speed = config.speed;
    this.perception = config.perception;
    this.type = config.type;
    // TODO add initialization of inventory
  }

  /**
   * Changes position property of entity.
   *
   * @param   newCell     New cell which entity will occupy.
   */
  public changePosition(newCell: Cell): void {
    this.setProperty('position', newCell);
  }

  /**
   * Changes level property and position property of entity.
   *
   * @param level         New entity level
   */
  public changeLevel(level: LevelModel): void {
    this.setProperty('level', level);
  }

  /**
   * Sets new fov array of entity.
   */
  public setFov(fovArray: Cell[]): void {
    this.setProperty('fov', fovArray);
  }

  /**
   * Method responsible for substracting damage from entity hp and calculating side effects.
   *
   * @param damage    Number of hit points to substract
   * @returns         Boolean variable indicating if entity is still alive (its hit points are above 0)
   */
  public takeHit(damage: number): boolean {
    this.hitPoints -= damage;

    this.notify(EntityEvents.EntityHit, this);

    if (this.hitPoints < 1) {
      this.notify(EntityEvents.EntityDeath, {
        entity: this,
      });
    }

    return this.hitPoints > 0;
  }

  /**
   * Changes position and lastVisitedCell properties of entity. Also changes properties of appropriate cells (clears
   * entity property on old cell, and sets entity property on new cell).
   *
   * @param newCell   New cell where entity currently is
   */
  public move(newCell: Cell): void {
    this.lastVisitedCell = this.position; // remember on what cell entity was in previous turn
    this.position.clearEntity(); // we clear entity field of cell which entity is right now at
    this.position = newCell; // we move entity to new position
    /**
     * in new cell model where monster is after movement, we store information about new entity occupying new cell.
     */
    this.position.setEntity(this);
    this.notify(EntityEvents.EntityMove, newCell);
  }

  /**
   * Attempts to pick up item from ground (ie. removing it from Cell inventory and moving to entity inventory).
   *
   * @param item      Item to pick up
   */
  public pickUp(item: ItemModel): void {
    const currentCellInventory: ItemsCollection =
      this.getCurrentCellInventory();

    if (currentCellInventory.has(item)) {
      currentCellInventory.remove(item);
      this.inventory.add(item);

      this.notify(EntityEvents.EntityPickedItem, item);
    }
  }

  public equipWeapon(weapon: IWeapon): void {
    const previousWeapon = this.weapon;

    if (weapon !== previousWeapon && !(weapon instanceof NaturalWeaponModel)) {
      this.equippedWeapon = weapon;
      this.notify(EntityEvents.EntityEquippedWeaponChange, {
        reason: 'equip',
        currentWeapon: weapon,
        previousWeapon,
      });
    }
  }

  public removeWeapon(weapon: IWeapon): void {
    if (
      !(weapon instanceof NaturalWeaponModel) &&
      this.isWeaponEquipped(weapon)
    ) {
      this.equippedWeapon = null;
      this.notify(EntityEvents.EntityEquippedWeaponChange, {
        reason: 'remove',
        currentWeapon: null,
        previousWeapon: weapon,
      });
    }
  }

  /**
   * Attempts to drop on ground group of items (remove them from entity inventory and push to cell where entity is
   * inventory).
   *
   * @param items     Array of items to drop
   */
  public dropItems(items: ItemModel[]): void {
    const currentCellInventory: ItemsCollection =
      this.getCurrentCellInventory();

    items.forEach((item: ItemModel) => {
      if (this.inventory.has(item)) {
        this.inventory.remove(item);
        currentCellInventory.add(item);

        this.notify(EntityEvents.EntityDroppedItem, item);
      }
    });
  }

  /**
   * Returns speed of entity.
   */
  public getSpeed(): number {
    return this.speed;
  }

  /**
   * Returns inventory of Cell which entity currently occupies.
   * @returns ItemsCollection
   */
  public getCurrentCellInventory(): ItemsCollection {
    return this.position.inventory;
  }

  /**
   * Return description of entity.
   *
   * @returns String description of entity
   */
  public getDescription(): string {
    return this.description;
  }

  public isWeaponEquipped(weapon: IWeapon): boolean {
    return this.equippedWeapon === weapon;
  }

  public setCurrentHpToMax(): void {
    this.setProperty('hitPoints', this.maxHitPoints);
  }
}
