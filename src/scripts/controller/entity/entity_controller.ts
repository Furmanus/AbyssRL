import { calculateFov } from '../../helper/fov_helper';
import { IAnyObject } from '../../interfaces/common';
import { Cell } from '../../model/dungeon/cells/cell_model';
import { EntityModel, IEntityStatsObject } from '../../model/entity/entity_model';
import { Controller } from '../controller';
import { LevelModel } from '../../model/dungeon/level_model';
import { EntityEvents } from '../../constants/entity_events';
import { boundMethod } from 'autobind-decorator';
import { EntityStats } from '../../constants/monsters';
import { doCombatAction, ICombatResult } from '../../helper/combat_helper';
import { globalMessagesController } from '../../global/messages';
import { ItemModel } from '../../model/items/item_model';
import { ItemsCollection } from '../../collections/items_collection';

export class EntityController<M extends EntityModel = EntityModel> extends Controller {
    protected model: M;
    /**
     * Constructor for entity controller.
     * @param   config              Object with data for creating model and controller.
     * @param   config.display      Name of sprite visible on game screen.
     * @param   config.position     Starting player position.
     */
    constructor(config: IAnyObject) {
      super();
    }

    protected attachEvents(): void {
      this.model.on(this, EntityEvents.ENTITY_MOVE, this.onEntityPositionChange);
      this.model.on(this, EntityEvents.ENTITY_DEATH, this.onEntityDeath);
      this.model.on(this, EntityEvents.ENTITY_HIT, this.onEntityHit);
      this.model.on(this, EntityEvents.ENTITY_PICKED_ITEM, this.onEntityPickUp);
      this.model.on(this, EntityEvents.ENTITY_DROPPED_ITEM, this.onEntityDropItem);
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
      this.notify(EntityEvents.ENTITY_DEATH, { entityController: this });
    }

    /**
     * Method triggered after entity takes hit.
     *
     * @param entity    Entity model
     */
    @boundMethod
    private onEntityHit(entity: EntityModel): void {
      this.notify(EntityEvents.ENTITY_HIT, entity);
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
      this.model.dropItems(items);
    }

    protected onEntityPickUp(item: ItemModel): void {
      globalMessagesController.showMessageInView(`${this.model.getDescription()} picks up ${item.description}.`);
    }

    protected onEntityDropItem(item: ItemModel): void {
      globalMessagesController.showMessageInView(`${this.model.getDescription()} drops ${item.description}.`);
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
    public getModel(): EntityModel {
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
        [EntityStats.STRENGTH]: this.model.strength,
        [EntityStats.DEXTERITY]: this.model.dexterity,
        [EntityStats.INTELLIGENCE]: this.model.intelligence,
        [EntityStats.TOUGHNESS]: this.model.toughness,
        [EntityStats.PERCEPTION]: this.model.perception,
        [EntityStats.SPEED]: this.model.speed,
        [EntityStats.HIT_POINTS]: this.model.hitPoints,
        [EntityStats.MAX_HIT_POINTS]: this.model.maxHitPoints,
      };
    }

    /**
     * Return property value from model.
     */
    /* tslint:disable-next-line:no-any */
    public getProperty(propertyName: string): any {
      if (!this.model[propertyName]) {
        throw new TypeError(`Uknown property ${propertyName}`);
      }
      return this.model[propertyName];
    }
}
