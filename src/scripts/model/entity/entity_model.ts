import {BaseModel} from '../../core/base_model';
import {IAnyObject} from '../../interfaces/common';
import {Cell} from '../dungeon/cells/cell_model';
import {LevelModel} from '../dungeon/level_model';
import {EntityEvents} from '../../constants/entity_events';
import {EntityActualStats, EntityBodySlots, EntityStats, MonsterSizes, MonstersTypes} from '../../constants/monsters';
import {ItemsCollection} from '../../collections/items_collection';
import {ItemModel} from '../items/item_model';
import {weaponModelFactory} from '../../factory/item/weapon_model_factory';
import {NaturalWeaponModel} from '../items/natural_weapon_model';
import {WearableModel} from '../items/wearable_model';
import {RingModelFactory} from '../../factory/item/ring_model_factory';
import {AmuletModelFactory} from '../../factory/item/amulet_model_factory';
import {WeaponModel} from '../items/weapon_model';
import {isWearableItem} from '../../interfaces/type_guards';
import {EntityGroupModel} from './entity_group_model';
import {EntityStrategy} from '../../strategy/entity';
import {getMonsterNaturalWeapon} from '../../factory/natural_weapon_factory';

export interface IEntityStatsObject {
    [EntityStats.STRENGTH]: number;
    [EntityStats.DEXTERITY]: number;
    [EntityStats.INTELLIGENCE]: number;
    [EntityStats.TOUGHNESS]: number;
    [EntityStats.PERCEPTION]: number;
    [EntityStats.SPEED]: number;
    [EntityStats.HIT_POINTS]: number;
    [EntityStats.MAX_HIT_POINTS]: number;
    [EntityStats.PROTECTION]: number;
}
export type IBodySlots = {
    [P in EntityBodySlots]?: ItemModel;
};

export const animalTypes: MonstersTypes[] = [MonstersTypes.GIANT_RAT];

export class EntityModel extends BaseModel {
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
    public baseStrength: number = null;
    public baseDexterity: number = null;
    public baseToughness: number = null;
    public baseIntelligence: number = null;
    /**
     * Speed statistic of entity. Important stat, used by time engine to calculate how often entity should act.
     */
    public baseSpeed: number = null;
    public basePerception: number = null;
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
    public type: MonstersTypes = MonstersTypes.UNKNOWN;
    /**
     * Is entity hostile to player.
     */
    public isHostile: boolean = false;
    public hitPoints: number = null;
    public maxHitPoints: number = null;
    public size: MonsterSizes = null;
    // TODO remove content of collection
    public inventory: ItemsCollection;
    public bodySlots: IBodySlots = {
        [EntityBodySlots.HEAD]: null,
        [EntityBodySlots.NECK]: null,
        [EntityBodySlots.TORSO]: null,
        [EntityBodySlots.LEFT_HAND]: null,
        [EntityBodySlots.RIGHT_HAND]: null,
        [EntityBodySlots.FINGER]: null,
    };
    /**
     * Natural weapon (for example fist, bite) used when entity is attacking without any weapon.
     */
    public naturalWeapon: NaturalWeaponModel = null;
    /**
     * Group to which entity can belong
     */
    public entityGroup: EntityGroupModel = null;
    /**
     * Value of entity armour protection. Used to calculate how much of damage dealt will be absorbed by armor.
     */
    get protection(): number {
        return (Object.values(this.bodySlots).reduce((previous: ItemModel, current: ItemModel) => {
            return previous + ((current as WearableModel || {protection: 0}).protection || 0);
        }, 0) + this.getStatsModifiers(EntityActualStats.PROTECTION));
    }
    get strength(): number {
        return this.baseStrength + this.getStatsModifiers(EntityActualStats.STRENGTH);
    }
    get dexterity(): number {
        return this.baseDexterity + this.getStatsModifiers(EntityActualStats.DEXTERITY);
    }
    get intelligence(): number {
        return this.baseIntelligence + this.getStatsModifiers(EntityActualStats.INTELLIGENCE);
    }
    get toughness(): number {
        return this.baseToughness + this.getStatsModifiers(EntityActualStats.TOUGHNESS);
    }
    get perception(): number {
        return this.basePerception + this.getStatsModifiers(EntityActualStats.PERCEPTION);
    }
    get speed(): number {
        return this.baseSpeed + this.getStatsModifiers(EntityActualStats.SPEED);
    }
    get weapon(): WeaponModel {
        return this.bodySlots['right hand'] as WeaponModel || this.naturalWeapon;
    }

    constructor(config: IAnyObject) {
        super();

        this.display = config.display;
        this.level = config.level;
        this.position = config.position;
        this.lastVisitedCell = config.lastVisitedCell || null;
        this.baseSpeed = config.speed;
        this.basePerception = config.perception;
        this.type = config.type;
        this.inventory = EntityStrategy.getMonsterEquipment(this.type);
        this.naturalWeapon = getMonsterNaturalWeapon(this.type);

        if (animalTypes.includes(this.type)) {
            this.bodySlots = {};
        }
    }
    /**
     * Returns sum of all worn item modifiers for given stat.
     *
     * @param type  Modifiers for which stat should be calculated
     */
    private getStatsModifiers(type: EntityActualStats): number {
        return Object.values(this.bodySlots).reduce((previous: number, current: ItemModel) => {
            if (current) {
                return previous + ((current.modifiers || {stats: {}}).stats[type] || 0);
            }
            return previous;
        }, 0);
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

        this.notify(EntityEvents.ENTITY_HIT, this);

        if (this.hitPoints < 1) {
            this.notify(EntityEvents.ENTITY_DEATH, {
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
        this.position.clearEntity(); // we clear entity field of cell which entity is right now at
        this.position = newCell; // we move entity to new position
        /**
         * in new cell model where monster is after movement, we store information about new entity occupying new cell.
         */
        this.position.setEntity(this);
        this.notify(EntityEvents.ENTITY_MOVE, newCell);
    }
    /**
     * Attempts to pick up item from ground (ie. removing it from Cell inventory and moving to entity inventory).
     *
     * @param item      Item to pick up
     */
    public pickUp(item: ItemModel): void {
        const currentCellInventory: ItemsCollection = this.getCurrentCellInventory();

        if (currentCellInventory.has(item)) {
            currentCellInventory.remove(item);
            this.inventory.add(item);

            this.notify(EntityEvents.ENTITY_PICKED_ITEM, item);
        }
    }
    /**
     * Attempts to drop on ground group of items (remove them from entity inventory and push to cell where entity is
     * inventory).
     *
     * @param items     Array of items to drop
     */
    public dropItems(items: ItemModel[]): void {
        const currentCellInventory: ItemsCollection = this.getCurrentCellInventory();

        items.forEach((item: ItemModel) => {
            if (this.inventory.has(item)) {

                if (isWearableItem(item)) {
                    item.isEquipped = false;
                }

                this.inventory.remove(item);
                currentCellInventory.add(item);

                this.notify(EntityEvents.ENTITY_DROPPED_ITEM, item);
            }
        });
    }
    public equipItem(item: WearableModel): void {
        if (this.inventory.has(item)) {
            if (this.bodySlots[item.bodyPart[0]]) {
                this.bodySlots[item.bodyPart[0]].isEquipped = false;
                this.notify(EntityEvents.ENTITY_REMOVED_ITEM, this.bodySlots[item.bodyPart[0]]);
            }
            this.bodySlots[item.bodyPart[0]] = item;
            item.isEquipped = true;
            this.notify(EntityEvents.ENTITY_EQUIPPED_ITEM, item);
        }
    }
    public removeItem(item: WearableModel): void {
        const itemBodySlot = item.bodyPart;

        if (this.isItemWorn(item)) {
            this.bodySlots[itemBodySlot[0]] = null;
            item.isEquipped = false;
            this.notify(EntityEvents.ENTITY_REMOVED_ITEM, item);
        }
    }
    public isItemWorn(item: WearableModel): boolean {
        return this.bodySlots[item.bodyPart[0]] === item;
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
    public getSerializedData(): object {
        const serializedEntityModel: IAnyObject = {...this};

        serializedEntityModel.positionId = this.position.id;
        serializedEntityModel.levelId = this.level.id;
        serializedEntityModel.naturalWeaponId = this.naturalWeapon.id;
        serializedEntityModel.inventory = this.inventory.getAllIds();

        delete serializedEntityModel.fov;
        delete serializedEntityModel.position;
        delete serializedEntityModel.level;
        delete serializedEntityModel.naturalWeapon;

        return serializedEntityModel;
    }
    public setEntityGroup(group: EntityGroupModel): void {
        this.entityGroup = group;
    }
}
