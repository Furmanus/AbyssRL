import { calculateFov } from '../../utils/fov_helper';
import { BaseController } from '../../core/base.controller';
import { LevelModel } from '../../dungeon/models/level_model';
import { EntityEvents } from '../../constants/entity_events';
import { boundMethod } from 'autobind-decorator';
import { doCombatAction, ICombatResult } from '../../combat/combatHelper';
import { globalMessagesController } from '../../messages/messages.controller';
import { ItemModel } from '../../items/models/item.model';
import { ItemsCollection } from '../../items/items_collection';
import {
  EntityArmourChangeData,
  EntityWeaponChangeData,
} from '../entity.interfaces';
import { NaturalWeaponModel } from '../../items/models/weapons/naturalWeapon.model';
import { WeaponModel } from '../../items/models/weapons/weapon.model';
import { EntityStatusFactory } from '../factory/entityStatus.factory';
import { EntityBleedingStatusController } from '../entity_statuses/entityBleedingStatus.controller';
import {
  EntityStatuses,
  entityStatusToDamageText,
} from '../constants/statuses';
import { EntityStatusCommonController } from '../entity_statuses/entityStatusCommon.controller';
import { statusModifierToMessage } from '../constants/stats';
import { capitalizeString } from '../../utils/utility';
import { EntityStunnedStatusController } from '../entity_statuses/entityStunnedStatus.controller';
import { MonstersTypes } from '../constants/monsters';
import { dungeonState } from '../../state/application.state';
import { DungeonBranches } from '../../dungeon/constants/dungeonTypes.constants';
import { IWeapon } from '../../combat/combat.interfaces';
import { Cell } from '../../dungeon/models/cells/cell_model';
import {
  AddTemporaryStatModifierData,
  EntityModel,
  IEntityStatsObject,
} from '../models/entity.model';

export abstract class EntityController<
  M extends EntityModel = EntityModel,
> extends BaseController {
  protected model: M;
  protected get isDead(): boolean {
    return this.model.hitPoints <= 0;
  }

  public isStunned(): boolean {
    return !!this.model.entityStatuses
      .get()
      .find(
        (status: EntityStatusCommonController) =>
          status.type === EntityStatuses.Stunned,
      );
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

  public move(
    newCell: Cell,
    levelNumber: number = dungeonState.currentLevelNumber,
    dungeonBranch: DungeonBranches = dungeonState.currentBranch,
  ): void {
    if (newCell.entity && newCell.entity !== this.getModel()) {
      const attackResult: ICombatResult = this.attack(newCell.entity);

      globalMessagesController.showMessageInView(attackResult.message);
    } else {
      this.model.move(newCell, levelNumber, dungeonBranch);
    }
  }

  @boundMethod
  public attack(defender: EntityModel): ICombatResult {
    const defenderController =
      dungeonState.entityManager.findEntityControllerByModel(defender);

    if (defenderController) {
      return doCombatAction(this, defenderController);
    } else {
      console.error('Defender controller not found');
    }
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

    this.notify(EntityEvents.EntityMove, this);
  }

  /**
   * Method triggered after entity hp in model goes to zero or below.
   */
  @boundMethod
  private onEntityDeath(): void {
    this.notify(EntityEvents.EntityDeath, { entityController: this });

    globalMessagesController.showMessageInView(
      capitalizeString(`${this.model.getDescription()} drops dead.`),
    );
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
        item instanceof WeaponModel &&
        this.model.isWeaponEquipped(item as IWeapon),
    );

    if (equippedWeapon && equippedWeapon instanceof WeaponModel) {
      this.model.removeWeapon(equippedWeapon as IWeapon);
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
    this.updateEntityStatsModifiers();
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

  public inflictStunnedStatus(message?: string): void {
    const stunnedStatus = EntityStatusFactory.getEntityStunnedStatus({
      entityModelId: this.getModel().id,
    });

    this.model.addStatus(stunnedStatus);

    if (message) {
      globalMessagesController.showMessageInView(message);
    }
  }

  public removeStunnedStatus(
    stunnedStatus: EntityStunnedStatusController,
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
  }

  public dropBlood(): void {
    this.notify(EntityEvents.EntityBloodLoss, this.model);
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

  public destroy(): void {
    // TODO add implementation
  }

  public abstract makeRandomMovement(resolveFunction?: () => void): void;
}
