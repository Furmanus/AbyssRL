import { calculateFov } from '../../helper/fov_helper';
import { IAnyObject } from '../../interfaces/common';
import { Cell } from '../../model/dungeon/cells/cell_model';
import {
  EntityModel,
  IEntityStatsObject,
} from '../../model/entity/entity_model';
import { Controller } from '../controller';
import { LevelModel } from '../../model/dungeon/level_model';
import { EntityEvents } from '../../constants/entity_events';
import { boundMethod } from 'autobind-decorator';
import { EntityStats } from '../../constants/entity/monsters';
import { doCombatAction, ICombatResult } from '../../helper/combat_helper';
import { globalMessagesController } from '../../global/messages';
import { ItemModel } from '../../model/items/item_model';
import { ItemsCollection } from '../../collections/items_collection';
import {
  EntityArmourChangeData,
  EntityWeaponChangeData,
} from './entiry_controller.interfaces';
import { NaturalWeaponModel } from '../../model/items/weapons/natural_weapon_model';
import { WeaponModel } from '../../model/items/weapons/weapon_model';
import { EntityStatusFactory } from '../../factory/entity/entity_status_factory';
import { EntityBleedingStatusController } from './entity_statuses/entity_bleeding_status_controller';
import {
  EntityStatuses,
  entityStatusToDamageText,
} from '../../constants/entity/statuses';
import { EntityStatusCommonController } from './entity_statuses/entity_status_common_controller';
import { LevelController } from '../dungeon/level_controller';

export class EntityController<
  M extends EntityModel = EntityModel,
> extends Controller {
  protected model: M;
  protected currentLevelController: LevelController;
  /**
   * Constructor for entity controller.
   * @param   config              Object with data for creating model and controller.
   * @param   config.display      Name of sprite visible on game screen.
   * @param   config.position     Starting player position.
   */
  constructor(config: IAnyObject) {
    super();

    this.currentLevelController = config.levelController;
  }

  protected attachEvents(): void {
    this.model.on(this, EntityEvents.EntityMove, this.onEntityPositionChange);
    this.model.on(this, EntityEvents.EntityDeath, this.onEntityDeath);
    this.model.on(this, EntityEvents.EntityHit, this.onEntityHit);
    this.model.on(this, EntityEvents.EntityPickedItem, this.onEntityPickUp);
    this.model.on(this, EntityEvents.EntityDroppedItem, this.onEntityDropItem);
    this.model.on(
      this,
      EntityEvents.EntityEquippedWeaponChange,
      this.onEntityEquippedWeaponChange,
    );
    this.model.on(
      this,
      EntityEvents.EntityEquippedArmourChange,
      this.onEntityEquippedArmourChange,
    );
  }

  /**
   * Moves entity into new cell.
   */
  public move(newCell: Cell): void {
    if (newCell.entity && newCell.entity !== this.getModel()) {
      const attackResult: ICombatResult = this.attack(newCell.entity);

      globalMessagesController.showMessageInView(attackResult.message);
    } else {
      this.model.move(newCell);
    }
  }

  @boundMethod
  public attack(defender: EntityModel): ICombatResult {
    return doCombatAction(this.model, defender);
  }

  /**
   * Method triggered after position property has been changed in model.
   *
   * @param newCell   New entity position (cell)
   */
  @boundMethod
  private onEntityPositionChange(newCell: Cell): void {
    newCell.walkEffect(this);
    this.calculateFov();
  }

  /**
   * Method triggered after entity hp in model goes to zero or below.
   */
  @boundMethod
  private onEntityDeath(): void {
    this.notify(EntityEvents.EntityDeath, { entityController: this });
  }

  /**
   * Method triggered after entity takes hit.
   *
   * @param entity    Entity model
   */
  @boundMethod
  private onEntityHit(entity: EntityModel): void {
    this.notify(EntityEvents.EntityHit, entity);
  }

  public activate(cell: Cell): void {
    const useAttemptResult = cell.useAttempt(this);
    let useEffect;

    if (useAttemptResult.canUse) {
      useEffect = cell.useEffect(this);
    }
  }

  public calculateFov(): void {
    const newFov = calculateFov(this.model);

    this.model.setFov(newFov);
  }

  /**
   * Attempts to pick up item from ground (ie. removing it from Cell inventory and moving to entity inventory).
   */
  public pickUp(item: ItemModel): void {
    this.model.pickUp(item);
  }

  /**
   * Attempts to drop items on ground (remove from entity inventory and push to cell inventory).
   *
   * @param items     Array of items to drop
   */
  public dropItems(items: ItemModel[]): void {
    const equippedWeapon = items.find(
      (item) =>
        item instanceof WeaponModel && this.model.isWeaponEquipped(item),
    );

    if (equippedWeapon && equippedWeapon instanceof WeaponModel) {
      this.model.removeWeapon(equippedWeapon);
    }

    this.model.dropItems(items);
  }

  protected onEntityPickUp(item: ItemModel): void {
    globalMessagesController.showMessageInView(
      `${this.model.getDescription()} picks up ${item.description}.`,
    );
  }

  protected onEntityDropItem(item: ItemModel): void {
    globalMessagesController.showMessageInView(
      `${this.model.getDescription()} drops ${item.description}.`,
    );
  }

  protected onEntityEquippedWeaponChange(data: EntityWeaponChangeData): void {
    const { currentWeapon, previousWeapon, reason } = data;

    const removePart =
      previousWeapon && !(previousWeapon instanceof NaturalWeaponModel)
        ? `${this.model.getDescription()} removes ${
            previousWeapon.description
          }. `
        : '';
    const equipPart = currentWeapon
      ? `${this.model.getDescription()} equips ${currentWeapon.description}.`
      : '';

    globalMessagesController.showMessageInView(`${removePart}${equipPart}`);
  }

  protected onEntityEquippedArmourChange(data: EntityArmourChangeData): void {
    let message: string;

    switch (data.reason) {
      case 'equip':
        message = `${this.model.getDescription()} puts on ${
          data.currentArmour.description
        }.`;
        break;
      case 'remove':
        message = `${this.model.getDescription()} takes off ${
          data.previousArmour.description
        }.`;
        break;
    }

    globalMessagesController.showMessageInView(message);
  }

  /**
   * Returns speed of entity (how fast it can take action in time engine).
   */
  public getSpeed(): number {
    return this.getModel().getSpeed();
  }

  /**
   * Returns entity model.
   */
  public getModel(): M {
    return this.model;
  }

  /**
   * Returns level model in which entity currently is present.
   */
  public getLevelModel(): LevelModel {
    return this.model.level;
  }

  /**
   * Returns entity field of vision.
   */
  public getFov(): Cell[] {
    return this.model.fov;
  }

  public act(): void {
    this.activateStatuses();
  }

  public activateStatuses(): void {
    this.model.entityStatuses.forEach(
      (status: EntityStatusCommonController) => {
        status.act();
      },
    );
  }

  /**
   * Returns entity current position (Cell model).
   */
  public getEntityPosition(): Cell {
    return this.model.position;
  }

  /**
   * Returns inventory of cell where entity actually is.
   *
   * @returns     Returns ItemsCollection
   */
  public getEntityPositionInventory(): ItemsCollection {
    return this.getEntityPosition().inventory;
  }

  /**
   * Changes model information about level and position (cell) where player currently is.
   *
   * @param level         New level where player currently is
   * @param position      New player position (cell)
   */
  public changeLevel(level: LevelModel, position: Cell): void {
    this.model.changeLevel(level);
    this.move(position);
  }

  /**
   * Returns object with entity statistics (key is stats name).
   */
  public getStatsObject(): IEntityStatsObject {
    return {
      [EntityStats.Strength]: this.model.strength,
      [EntityStats.Dexterity]: this.model.dexterity,
      [EntityStats.Intelligence]: this.model.intelligence,
      [EntityStats.Toughness]: this.model.toughness,
      [EntityStats.Perception]: this.model.perception,
      [EntityStats.Speed]: this.model.speed,
      [EntityStats.HitPoints]: this.model.hitPoints,
      [EntityStats.MaxHitPoints]: this.model.maxHitPoints,
    };
  }

  public inflictBleeding(): void {
    this.model.addStatus(EntityStatusFactory.getEntityBleedingStatus(this));
  }

  public stopBleeding(bleedingStatus: EntityBleedingStatusController): void {
    this.model.removeStatus(bleedingStatus);

    globalMessagesController.showMessageInView(
      `${this.model.description} blood loss stops.`,
    );
  }

  public inflictNonCombatHit(
    damage: number,
    source?: keyof typeof entityStatusToDamageText,
  ): void {
    this.model.takeHit(damage);

    if (source in entityStatusToDamageText) {
      globalMessagesController.showMessageInView(
        entityStatusToDamageText[source].replace(
          '{{description}}',
          this.model.description,
        ),
      );
    }
  }

  /**
   * Return property value from model.
   */
  public getProperty(propertyName: string): any {
    if (!this.model[propertyName]) {
      throw new TypeError(`Uknown property ${propertyName}`);
    }
    return this.model[propertyName];
  }

  public dropBlood(): void {
    this.notify(EntityEvents.EntityBloodLoss, this.model);
  }
}
