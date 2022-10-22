import { BaseModel } from '../../core/base.model';
import { IAnyObject } from '../../interfaces/common';
import { Cell } from '../../dungeon/models/cells/cell_model';
import { LevelModel } from '../../dungeon/models/level_model';
import { EntityEvents } from '../../constants/entity_events';
import { IEntity, isEntityPosition } from '../entity_interfaces';
import {
  EntityStats,
  MonsterSizes,
  MonstersTypes,
} from '../constants/monsters';
import { ItemsCollection } from '../../items/items_collection';
import { IWeapon } from '../../combat/combat.interfaces';
import { ItemModel, SerializedItem } from '../../items/models/item.model';
import { WeaponModelFactory } from '../../items/factory/item/weaponModel.factory';
import { WeaponModel } from '../../items/models/weapons/weapon.model';
import {
  NaturalWeaponModel,
  SerializedNaturalWeapon,
} from '../../items/models/weapons/naturalWeapon.model';
import { ArmourModel } from '../../items/models/armours/armour_model';
import { ArmourModelFactory } from '../../items/factory/item/armour_model_factory';
import { EntityStatusFactory } from '../factory/entityStatus.factory';
import {
  AllEntityStatusesSerialized,
  EntityStatusCommonController,
} from '../entity_statuses/entityStatusCommon.controller';
import { CollectionEvents } from '../../constants/collection_events';
import { DungeonBranches } from '../../dungeon/constants/dungeonTypes.constants';
import { dungeonState } from '../../state/application.state';
import { Position, SerializedPosition } from '../../position/position';
import { NaturalWeaponFactory } from '../../items/factory/naturalWeapon.factory';
import { EntityStatusesCollection } from '../entity_statuses/entityStatuses.collection';
import { entityRegistry } from '../../global/entityRegistry';
import { EntityController } from '../controllers/entity.controller';

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

type EntityStatsModifiers = Omit<
  IEntityStatsObject,
  'hitpoints' | 'maxHitpoints'
>;

type UpdatedStatsChangeModifiers = Partial<
  Record<EntityStats, 'positive' | 'negative'>
>;

export interface IStatsSingleModifier {
  modifier: number;
  count: number;
  currentCount: number;
}

type EntityTemporaryStatsModifiersType = {
  [K in keyof EntityStatsModifiers]: Set<IStatsSingleModifier>;
};

type EntityStatModifierSource = EntityStatusCommonController;

export type AddTemporaryStatModifierData = Array<{
  stat: Omit<EntityStats, 'HitPoints' | 'MaxHitPoints'>;
  source: EntityStatModifierSource;
  modifier: IStatsSingleModifier;
}>;

export type EntityDungeonPosition = {
  branch: DungeonBranches;
  level: number;
  position: Position;
};

export type SerializedEntityModel = {
  id: string;
  strength?: number;
  dexterity?: number;
  intelligence?: number;
  toughness?: number;
  speed?: number;
  perception?: number;
  description?: string;
  type: MonstersTypes;
  display?: string;
  protection?: number;
  hitPoints?: number;
  maxHitPoints?: number;
  position: EntityDungeonPosition;
  lastVisitedCell?: SerializedPosition;
  size?: MonsterSizes;
  inventory?: SerializedItem[];
  naturalWeapon?: SerializedNaturalWeapon;
  equippedWeapon: string;
  equippedArmour: string;
  entityStatuses: AllEntityStatusesSerialized[];
};

export class EntityModel extends BaseModel implements IEntity {
  /**
   * Visible sprite of entity. Member of file constants/sprites.js.
   */
  public display: string;
  public entityPosition: EntityDungeonPosition = null;
  /**
   * Level model where entity is.
   */
  public get level(): LevelModel {
    return dungeonState.getLevelModel(
      this.entityPosition.branch,
      this.entityPosition.level,
    );
  }

  /**
   * Cell model where entity is.
   */
  public get position(): Cell {
    return this.level.getCellFromPosition(this.entityPosition.position);
  }

  public lastVisitedCellEntityPosition: Position = null;
  public get lastVisitedCell(): Cell {
    if (this.lastVisitedCellEntityPosition) {
      return this.level.getCellFromPosition(this.lastVisitedCellEntityPosition);
    }

    return null;
  }

  public set lastVisitedCell(cell: Cell | SerializedPosition) {
    if (cell) {
      this.lastVisitedCellEntityPosition = new Position(cell.x, cell.y);
    }
  }

  protected _strength: number = null;
  public get strength(): number {
    return this._strength + this.accumulateTemporaryStat(EntityStats.Strength);
  }

  public set strength(value: number) {
    this._strength = value;
  }

  protected _dexterity: number = null;
  public get dexterity(): number {
    return (
      this._dexterity + this.accumulateTemporaryStat(EntityStats.Dexterity)
    );
  }

  public set dexterity(value: number) {
    this._dexterity = value;
  }

  protected _toughness: number = null;
  public get toughness(): number {
    return (
      this._toughness + this.accumulateTemporaryStat(EntityStats.Toughness)
    );
  }

  public set toughness(value: number) {
    this._toughness = value;
  }

  protected _intelligence: number = null;
  public get intelligence(): number {
    return (
      this._intelligence +
      this.accumulateTemporaryStat(EntityStats.Intelligence)
    );
  }

  public set intelligence(value: number) {
    this._intelligence = value;
  }

  protected _speed: number = null;
  public get speed(): number {
    return this._speed + this.accumulateTemporaryStat(EntityStats.Speed);
  }

  public set speed(value: number) {
    this._speed = value;
  }

  protected _perception: number = null;
  public get perception(): number {
    return (
      this._perception + this.accumulateTemporaryStat(EntityStats.Perception)
    );
  }

  public set perception(value: number) {
    this._perception = value;
  }

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
  public get hpToMaxHpRatio(): number {
    return this.hitPoints / this.maxHitPoints;
  }

  public size: MonsterSizes = null;
  /**
   * Temporary entity stats modifiers, for example bleeding might cause temporary lose of strength. Not used anywhere
   * yet!
   */
  public temporaryStatsModifiers: EntityTemporaryStatsModifiersType = {
    [EntityStats.Strength]: new Set<IStatsSingleModifier>(),
    [EntityStats.Dexterity]: new Set<IStatsSingleModifier>(),
    [EntityStats.Intelligence]: new Set<IStatsSingleModifier>(),
    [EntityStats.Toughness]: new Set<IStatsSingleModifier>(),
    [EntityStats.Perception]: new Set<IStatsSingleModifier>(),
    [EntityStats.Speed]: new Set<IStatsSingleModifier>(),
  };

  public inventory: ItemsCollection;

  public entityStatuses = EntityStatusFactory.getCollection();

  /**
   * Natural weapon (for example fist, bite) used when entity is attacking without any weapon.
   */
  public naturalWeapon: NaturalWeaponModel = null;
  public equippedWeapon: WeaponModel = null;
  public equippedArmour: ArmourModel = null;
  /**
   * Value of entity armour protection. Used to calculate how much of damage dealt will be absorbed by armor.
   */
  private naturalProtection: number = 0;
  public get protection(): number {
    return (
      this.naturalProtection + this.equippedArmour?.protectionModifier || 0
    );
  }

  public set protection(val: number) {
    this.naturalProtection = val;
  }

  public get evasion(): number {
    return this.equippedArmour?.dodgeModifier || 0;
  }

  get weapon(): WeaponModel | NaturalWeaponModel {
    return this.equippedWeapon || this.naturalWeapon;
  }

  public get equipSlots() {
    return {};
  }

  constructor(config: SerializedEntityModel) {
    super(config);

    this.entityPosition = config.position;
    this.display = config.display;
    this.lastVisitedCell = config.lastVisitedCell || null;
    this.speed = config.speed;
    this.perception = config.perception;
    this.type = config.type;
    this.strength = config.strength;
    this.dexterity = config.dexterity;
    this.intelligence = config.intelligence;
    this.toughness = config.toughness;
    this.hitPoints = config.hitPoints;
    this.maxHitPoints = config.maxHitPoints;
    this.protection = config.protection;
    this.inventory = ItemsCollection.getInstanceFromSerializedData(
      config.inventory || [],
    );

    if (config.naturalWeapon) {
      this.naturalWeapon = NaturalWeaponFactory.getMonsterNaturalWeaponFromData(
        config.naturalWeapon,
      );
    } else {
      this.naturalWeapon = NaturalWeaponFactory.getMonsterNaturalWeapon(
        this.type,
      );
    }

    this.equippedWeapon = this.inventory.getById(
      config.equippedWeapon,
    ) as WeaponModel;
    this.equippedArmour = this.inventory.getById(
      config.equippedArmour,
    ) as ArmourModel;

    window.setTimeout(() => {
      const recreatedStatusesCollection =
        EntityStatusFactory.getCollectionFromSerializedData(
          config.entityStatuses,
          entityRegistry.getControllerByModel(this),
        );

      recreatedStatusesCollection.forEach((status) => {
        this.entityStatuses.addStatus(status);
      });
    }, 0);

    this.attachEventsToCollections();
  }

  private attachEventsToCollections(): void {
    this.entityStatuses.on(
      this,
      CollectionEvents.Add,
      this.onStatusesCollectionChange,
    );
    this.entityStatuses.on(
      this,
      CollectionEvents.Remove,
      this.onStatusesCollectionChange,
    );
  }

  /**
   * Changes position property of entity.
   *
   * @param   newCell     New cell which entity will occupy.
   */
  public changePosition(newCell: Cell): void {
    this.entityPosition.position = Position.fromCell(newCell);
  }

  /**
   * Sets new fov array of entity.
   */
  public setFov(fovArray: Cell[]): void {
    this.fov = fovArray;
  }

  public addStatus(entityStatus: EntityStatusCommonController): void {
    this.entityStatuses.addStatus(entityStatus);
  }

  public removeStatus(entityStatus: EntityStatusCommonController): void {
    this.entityStatuses.removeStatus(entityStatus);
  }

  private onStatusesCollectionChange(): void {
    this.notify(EntityEvents.EntityModelStatusChange, this.entityStatuses);
  }

  private accumulateTemporaryStat(stat: EntityStats): number {
    return Array.from(
      this.temporaryStatsModifiers[stat as keyof EntityStatsModifiers],
    ).reduce(
      (sum: number, current: { count: number; modifier: number }) =>
        sum + current.modifier,
      0,
    );
  }

  public getAccumulatedAllTemporaryStats(): IEntityStatsObject {
    return Object.entries(this.temporaryStatsModifiers).reduce(
      (
        accumulator: IEntityStatsObject,
        current: [string, Set<IStatsSingleModifier>],
      ) => {
        const stat = current[0] as EntityStats;

        accumulator[stat] = this.accumulateTemporaryStat(stat);

        return accumulator;
      },
      {} as IEntityStatsObject,
    );
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
  public move(
    newCell: Cell,
    levelNumber: number = dungeonState.currentLevelNumber,
    dungeonBranch: DungeonBranches = dungeonState.currentBranch,
  ): void {
    this.lastVisitedCell = this.position; // remember on what cell entity was in previous turn
    this.entityPosition.position = new Position(newCell.x, newCell.y);

    this.entityPosition.level = levelNumber;
    this.entityPosition.branch = dungeonBranch;

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

  public addItemToInventory(items: ItemModel[]): void {
    this.inventory.add(items);
  }

  public equipWeapon(weapon: WeaponModel): void {
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

  public equipArmour(armour: ArmourModel): void {
    if (this.equippedArmour) {
      this.unequipArmour();

      this.equippedArmour = armour;
      this.notify(EntityEvents.EntityEquippedArmourChange, {
        reason: 'equip',
        currentArmour: armour,
      });
    } else {
      this.equippedArmour = armour;
      this.notify(EntityEvents.EntityEquippedArmourChange, {
        reason: 'equip',
        currentArmour: armour,
      });
    }
  }

  public unequipArmour(): void {
    const removedArmour = this.equippedArmour;

    this.equippedArmour = null;
    this.notify(EntityEvents.EntityEquippedArmourChange, {
      reason: 'remove',
      previousArmour: removedArmour,
    });
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

  public getBaseStats(): IEntityStatsObject {
    return {
      [EntityStats.Strength]: this._strength,
      [EntityStats.Dexterity]: this._dexterity,
      [EntityStats.Intelligence]: this._intelligence,
      [EntityStats.Toughness]: this._toughness,
      [EntityStats.Perception]: this._perception,
      [EntityStats.Speed]: this._speed,
      [EntityStats.HitPoints]: this.hitPoints,
      [EntityStats.MaxHitPoints]: this.maxHitPoints,
    };
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
    this.hitPoints = this.maxHitPoints;
  }

  public addTemporaryStatModifier(stats: AddTemporaryStatModifierData): void {
    for (const statModifier of stats) {
      const { modifier, stat, source } = statModifier;

      this.temporaryStatsModifiers[stat as keyof EntityStatsModifiers].add(
        modifier,
      );
    }
  }

  /**
   * Upgrade counters of each stat modifier and check which modifier has to be removed in current turn.
   */
  public updateTemporaryStatsModifiers(): UpdatedStatsChangeModifiers {
    const changedStats: Partial<Record<EntityStats, 'positive' | 'negative'>> =
      {};

    for (const [statName, statModifiers] of Object.entries(
      this.temporaryStatsModifiers,
    )) {
      let removedModifiersValue = 0;

      for (const singleStatModifier of statModifiers) {
        if (++singleStatModifier.currentCount > singleStatModifier.count) {
          removedModifiersValue += singleStatModifier.modifier;

          statModifiers.delete(singleStatModifier);
        }
      }

      if (removedModifiersValue !== 0) {
        changedStats[statName as EntityStats] =
          removedModifiersValue < 0 ? 'positive' : 'negative';
      }
    }

    return changedStats;
  }

  public getEntityGeneralStatusDescription(): string {
    if (this.entityStatuses.size === 0 && this.hpToMaxHpRatio > 0.75) {
      return 'good condition';
    } else {
      let status: string = '';

      if (this.hpToMaxHpRatio <= 0.75 && this.hpToMaxHpRatio > 0.33) {
        status += 'moderately wounded';
      } else if (this.hpToMaxHpRatio <= 0.33) {
        status += 'badly wounded';
      }

      this.entityStatuses.forEach(
        (entityStatus: EntityStatusCommonController) => {
          status += `${status !== '' ? ', ' : ''}${entityStatus.type}`;
        },
      );

      return status;
    }
  }

  public serialize(): SerializedEntityModel {
    return {
      ...super.serialize(),
      type: this.type,
      display: this.display,
      description: this.description,
      protection: this.naturalProtection,
      strength: this._strength,
      dexterity: this._dexterity,
      toughness: this._toughness,
      speed: this._speed,
      intelligence: this._intelligence,
      perception: this._perception,
      hitPoints: this.hitPoints,
      maxHitPoints: this.maxHitPoints,
      size: this.size,
      position: this.entityPosition,
      inventory: this.inventory.getDataForSerialization(),
      naturalWeapon: this.naturalWeapon.getDataToSerialization(),
      lastVisitedCell: this.lastVisitedCellEntityPosition?.serialize(),
      equippedArmour: this.equippedArmour?.id || null,
      equippedWeapon: this.equippedWeapon?.id || null,
      entityStatuses: this.entityStatuses.getDataToSerialization(),
    };
  }
}
