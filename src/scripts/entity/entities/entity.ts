import { calculateFov } from '../../utils/fov_helper';
import { LevelModel } from '../../dungeon/models/level_model';
import { doCombatAction, ICombatResult } from '../../combat/combatHelper';
import { globalMessagesController } from '../../messages/messages.service';
import { ItemModel } from '../../items/models/item.model';
import { ItemsCollection } from '../../items/items_collection';
import { WeaponModel } from '../../items/models/weapons/weapon.model';
import { EntityStatusFactory } from '../factory/entityStatus.factory';
import { EntityBleedingStatus } from '../entity_statuses/entityBleedingStatus';
import {
  EntityStatuses,
  entityStatusToDamageText,
} from '../constants/statuses';
import { AllEntityStatusControllers, EntityStatusCommon } from '../entity_statuses/entityStatusCommon';
import { statusModifierToMessage } from '../constants/stats';
import { EntityStunnedStatus } from '../entity_statuses/entityStunnedStatus';
import { dungeonState } from '../../state/application.state';
import { DungeonBranches } from '../../dungeon/constants/dungeonTypes.constants';
import { IWeapon } from '../../combat/combat.interfaces';
import { Cell } from '../../dungeon/models/cells/cell_model';
import {
  AddTemporaryStatModifierData,
  EntityModel,
  IEntityStatsObject,
} from '../models/entity.model';
import { entityEventBus } from '../../eventBus/entityEventBus/entityEventBus';
import { EntityEventBusEventNames } from '../../eventBus/entityEventBus/entityEventBus.constants';
import { MonstersTypes } from '../constants/monsters';
import { ArmourModel } from '../../items/models/armours/armour_model';
import { loggerService } from '../../utils/logger.service';
import { exhaustiveCheck } from '../../utils/utility';
import { NaturalWeaponModel } from '../../items/models/weapons/naturalWeapon.model';

export abstract class Entity<
  M extends EntityModel = EntityModel,
> {
  protected model: M;
  protected get isDead(): boolean {
    return this.model.hitPoints <= 0;
  }

  public get isHostile(): boolean {
    return this.model.isHostile;
  }

  public get type(): MonstersTypes {
    return this.model.type;
  }

  public isStunned(): boolean {
    return !!this.model.entityStatuses
      .get()
      .find(
        (status: EntityStatusCommon) =>
          status.type === EntityStatuses.Stunned,
      );
  }

  public move(
    newCell: Cell,
    levelNumber: number = dungeonState.currentLevelNumber,
    dungeonBranch: DungeonBranches = dungeonState.currentBranch,
  ): void {
    if (newCell.entity && newCell.entity !== this) {
      const attackResult: ICombatResult = this.attack(newCell.entity);

      globalMessagesController.showMessageInView(attackResult.message);
    } else {
      const oldPosition = { ...this.model.entityPosition };
      this.model.move(newCell, levelNumber, dungeonBranch);

      newCell.walkEffect(this);
      this.calculateFov();

      entityEventBus.publish(EntityEventBusEventNames.EntityMove, this, this.model.entityPosition, oldPosition);
    }
  }

  public attack(defender: Entity): ICombatResult {
    return doCombatAction(this, defender);
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

    entityEventBus.publish(EntityEventBusEventNames.EntityPickItem, this, item);
  }

  /**
   * Attempts to drop items on ground (remove from entity inventory and push to cell inventory).
   *
   * @param items     Array of items to drop
   */
  public dropItems(items: ItemModel[]): void {
    const equippedWeapon = items.find(
      (item) =>
        item instanceof WeaponModel &&
        this.model.equippedWeapon === item as IWeapon,
    );

    if (equippedWeapon && equippedWeapon instanceof WeaponModel) {
      this.removeWeapon(equippedWeapon);
    }

    this.model.dropItems(items);

    entityEventBus.publish(EntityEventBusEventNames.EntityDropItem, this, items);
  }

  public equipItem(item: ItemModel): void {
    if (item instanceof WeaponModel) {
      this.equipWeapon(item);
    } else if (item instanceof ArmourModel) {
      this.equipArmour(item);
    }
  }

  public equipArmour(armour: ArmourModel): void {
    if (this.model.equippedArmour) {
      this.unequipArmour();
    }

    this.model.equippedArmour = armour;

    entityEventBus.publish(EntityEventBusEventNames.EntityWearArmour, this, armour);
  }

  public unequipArmour(): void {
    if (this.model.equippedArmour) {
      const removedArmour = this.model.equippedArmour;

      this.model.equippedArmour = null;

      entityEventBus.publish(EntityEventBusEventNames.EntityTakeOffArmour, this, removedArmour);
    }
  }

  public equipWeapon(weapon: WeaponModel): void {
    const previousWeapon = this.model.weapon;

    if (weapon !== previousWeapon && !(weapon instanceof NaturalWeaponModel)) {
      this.model.equippedWeapon = weapon;

      entityEventBus.publish(EntityEventBusEventNames.EntityWieldsWeapon, this, weapon);
    }
  }

  public removeWeapon(weapon: WeaponModel): void {
    if (!(weapon instanceof NaturalWeaponModel) && this.model.equippedWeapon) {
      const removedWeapon = this.model.equippedWeapon;

      this.model.equippedWeapon = null;

      entityEventBus.publish(EntityEventBusEventNames.EntityRemoveWeapon, this, removedWeapon);
    }
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
    this.updateEntityStatsModifiers();
  }

  public activateStatuses(): void {
    this.model.entityStatuses.forEach(
      (status: EntityStatusCommon) => {
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
  public changeLevel(
    oldLevelNumber: number,
    newLevelNumber: number,
    position: Cell,
  ): void {
    dungeonState.entityManager.moveEntityFromLevelToLevel(
      this,
      oldLevelNumber,
      newLevelNumber,
    );
    this.move(position);

    entityEventBus.publish(EntityEventBusEventNames.EntityChangeLevel, this);
  }

  /**
   * Returns object with entity statistics (key is stats name).
   */
  public getStatsObject(): IEntityStatsObject {
    return this.model.getBaseStats();
  }

  public getStatsModifiers(): Partial<IEntityStatsObject> {
    return this.model.getAccumulatedAllTemporaryStats();
  }

  public inflictStatus(statusType: EntityStatuses): void {
    switch (statusType) {
      case EntityStatuses.Bleeding:
        return this.inflictBleeding();
      case EntityStatuses.Stunned:
        return this.inflictStunnedStatus();
      case EntityStatuses.Paralyzed:
      case EntityStatuses.Poisoned:
      case EntityStatuses.Fallen:
        loggerService.log(`Entity status: ${statusType} not implemented yet`);
        break;
      default:
        exhaustiveCheck(statusType);
    }
  }

  public removeStatus(status: AllEntityStatusControllers): void {
    switch (status.type) {
      case EntityStatuses.Bleeding:
        return this.stopBleeding(status as EntityBleedingStatus); // TODO sprawdzic i poprawic czemu tu nie dziala unia dyskryminacyjna
      case EntityStatuses.Stunned:
        return this.removeStunnedStatus(status as EntityStunnedStatus);
      case EntityStatuses.Paralyzed:
      case EntityStatuses.Poisoned:
      case EntityStatuses.Fallen:
        loggerService.log(`Entity status: ${status.type} not implemented yet`);
        break;
      default:
        exhaustiveCheck(status.type);
    }
  }

  public inflictStunnedStatus(): void {
    const stunnedStatus = EntityStatusFactory.getEntityStunnedStatus({
      entityModelId: this.getModel().id,
    });

    this.model.addStatus(stunnedStatus);

    globalMessagesController.showMessageInView(
      `${this.model.description} is stunned!`,
    );
  }

  public removeStunnedStatus(
    stunnedStatus: EntityStunnedStatus,
  ): void {
    this.model.removeStatus(stunnedStatus);

    globalMessagesController.showMessageInView(
      `${this.model.description} is no longer stunned.`,
    );
  }

  public inflictBleeding(): void {
    this.model.addStatus(
      EntityStatusFactory.getEntityBleedingStatus({
        entityModelId: this.getModel().id,
      }),
    );

    entityEventBus.publish(EntityEventBusEventNames.EntityBloodLoss, this);
  }

  public stopBleeding(bleedingStatus: EntityBleedingStatus): void {
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

    if (this.isDead) {
      globalMessagesController.showMessageInView(
        this.model.type === MonstersTypes.Player
          ? 'You died from blood loss...'
          : `${this.model.description} died from blood loss.`,
      );
      entityEventBus.publish(EntityEventBusEventNames.EntityDeath, this);
    } else {
      globalMessagesController.showMessageInView(
        this.model.type === MonstersTypes.Player
          ? 'You lose blood!'
          : `${this.model.description} loses blood.`,
      );
    }
  }

  public takeHit(damage: number, source?: keyof typeof entityStatusToDamageText): void {
    this.model.takeHit(damage);

    entityEventBus.publish(EntityEventBusEventNames.EntityHit, this, damage);

    if (this.model.hitPoints < 1) {
      entityEventBus.publish(EntityEventBusEventNames.EntityDeath, this);
    }
  }

  public dropBlood(): void {
    entityEventBus.publish(EntityEventBusEventNames.EntityBloodLoss, this);
  }

  public increaseBloodLoss(): void {
    globalMessagesController.showMessageInView(
      `${this.model.getDescription()} blood loss increases!`,
    );
  }

  public addTemporaryStatsModifiers(
    modifiers: AddTemporaryStatModifierData,
    silent?: boolean,
  ): void {
    const message = modifiers.reduce((text: string, modifierData: any) => {
      const { stat, modifier: modifierObject } = modifierData;
      const type = modifierObject.modifier < 0 ? 'negative' : 'positive';
      // @ts-ignore
      const addedText = statusModifierToMessage[type]?.[stat] || '';

      if (addedText) {
        return `${text} ${addedText}`;
      }

      return text;
    }, '');

    this.model.addTemporaryStatModifier(modifiers);

    if (message && !silent) {
      globalMessagesController.showMessageInView(
        message.replace('{{entity}}', this.model.getDescription()),
      );
    }
  }

  public getId(): string {
    return this.getModel().id;
  }

  private updateEntityStatsModifiers(): void {
    const modifiedStats = this.model.updateTemporaryStatsModifiers();
    let message = '';

    for (const [stat, textKey] of Object.entries(modifiedStats)) {
      // @ts-ignore
      message += `${statusModifierToMessage[textKey][stat]} `;
    }

    if (message) {
      globalMessagesController.showMessageInView(
        message.replaceAll('{{entity}}', this.model.getDescription()),
      );
    }
  }

  public addToInventory(items: ItemModel[]): void {
    this.model.addItemToInventory(items);
  }

  public removeFromInventory(items: ItemModel[]): void {
    this.model.removeItemsFromInventory(items);
  }

  public destroy(): void {
    // TODO add implementation
  }

  public abstract makeRandomMovement(resolveFunction?: () => void): void;
}
