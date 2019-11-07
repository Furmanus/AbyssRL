import {calculateFov} from '../../helper/fov_helper';
import {IAnyObject} from '../../interfaces/common';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {EntityModel, IEntityStatsObject} from '../../model/entity/entity_model';
import {Controller} from '../controller';
import {LevelModel} from '../../model/dungeon/level_model';
import {EntityEvents} from '../../constants/entity_events';
import {boundMethod} from 'autobind-decorator';
import {EntityStats, MonstersTypes} from '../../constants/monsters';
import {doCombatAction, ICombatResult} from '../../helper/combat_helper';
import {globalMessagesController} from '../../global/messages';
import {ItemModel} from '../../model/items/item_model';
import {ItemsCollection} from '../../collections/items_collection';
import {WearableModel} from '../../model/items/wearable_model';
import {EntityGroupModel} from '../../model/entity/entity_group_model';

export interface IItemAction {
    item: ItemModel;
    position: Cell;
}

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
        this.model.on(this, EntityEvents.ENTITY_EQUIPPED_ITEM, this.onEntityEquipItem);
        this.model.on(this, EntityEvents.ENTITY_REMOVED_ITEM, this.onEntityUnequipItem);
    }
    /**
     * Moves entity into new cell.
     */
    public move(newCell: Cell): void {
        if (newCell.entity && newCell.entity !== this.getModel()) {
            const attackResult: ICombatResult = this.attack(newCell.entity);

            globalMessagesController.showMessageInView(attackResult.message, newCell);
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
        this.notify(EntityEvents.ENTITY_DEATH, {entityController: this});

        if (this.model.type !== MonstersTypes.PLAYER) {
            this.dropInventory();
        }
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

        if (useAttemptResult.canUse) {
            cell.useEffect(this);
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
     * @param silent    If dropping items should be notified as event
     */
    public dropItems(items: ItemModel[], silent?: boolean): void {
        this.model.dropItems(items);
    }
    /**
     * Removes whole entity inventory and pushes it into cell inventory.
     */
    public dropInventory(): void {
        this.dropItems([...this.model.inventory.get()], true);
    }
    protected onEntityPickUp(data: IItemAction): void {
        const {
            item,
            position,
        } = data;

        globalMessagesController.showMessageInView(`${this.model.getDescription()} picks up ${item.fullDescription}.`, position);
    }
    protected onEntityDropItem(data: IItemAction): void {
        const {
            item,
            position,
        } = data;

        globalMessagesController.showMessageInView(`${this.model.getDescription()} drops ${item.description}.`, position);
    }
    protected onEntityEquipItem(data: IItemAction): void {
        const {
            item,
            position,
        } = data;

        globalMessagesController.showMessageInView(`${this.model.getDescription()} equips ${item.fullDescription}`, position);
    }
    protected onEntityUnequipItem(data: IItemAction): void {
        const {
            item,
            position,
        } = data;

        globalMessagesController.showMessageInView(`${this.model.getDescription()} removes ${item.fullDescription}`, position);
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
    public equipItem(item: WearableModel): void {
        this.model.equipItem(item);
    }
    public removeItem(item: WearableModel): void {
        this.model.removeItem(item);
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
            [EntityStats.PROTECTION]: this.model.protection,
        };
    }
    /**
     * Return property value from model.
     */
    /* tslint:disable-next-line:no-any*/
    public getProperty(propertyName: string): any {
        if (!this.model[propertyName]) {
            throw new TypeError(`Uknown property ${propertyName}`);
        }
        return this.model[propertyName];
    }
    public setEntityGroupInModel(group: EntityGroupModel): void {
        this.model.setEntityGroup(group);
    }
    public getEntityGroupInModel(): EntityGroupModel {
        return this.model.getEntityGroup();
    }
}
