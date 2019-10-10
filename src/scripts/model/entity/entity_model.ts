import {BaseModel} from '../../core/base_model';
import {IAnyObject} from '../../interfaces/common';
import {Cell} from '../dungeon/cells/cell_model';
import {LevelModel} from '../dungeon/level_model';
import {EntityEvents} from '../../constants/entity_events';
import {IEntity} from '../../interfaces/entity_interfaces';
import {EntityBodySlots, EntityStats, MonsterSizes, MonstersTypes} from '../../constants/monsters';
import {ItemsCollection} from '../../collections/items_collection';
import {IWeapon} from '../../interfaces/combat';
import {ItemModel} from '../items/item_model';
import {weaponModelFactory} from '../../factory/item/weapon_model_factory';
import {NaturalWeaponModel} from '../items/natural_weapon_model';
import {WearableModel} from '../items/wearable_model';

export interface IEntityStatsObject {
    [EntityStats.STRENGTH]: number;
    [EntityStats.DEXTERITY]: number;
    [EntityStats.INTELLIGENCE]: number;
    [EntityStats.TOUGHNESS]: number;
    [EntityStats.PERCEPTION]: number;
    [EntityStats.SPEED]: number;
    [EntityStats.HIT_POINTS]: number;
    [EntityStats.MAX_HIT_POINTS]: number;
}
export type IBodySlots = {
    [P in EntityBodySlots]?: ItemModel;
};

export const animalTypes: MonstersTypes[] = [MonstersTypes.GIANT_RAT];

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
    public type: MonstersTypes = MonstersTypes.UNKNOWN;
    /**
     * Is entity hostile to player.
     */
    public isHostile: boolean = false;
    public hitPoints: number = null;
    public maxHitPoints: number = null;
    public size: MonsterSizes = null;
    // TODO remove content of collection
    public inventory: ItemsCollection = new ItemsCollection(
        [weaponModelFactory.getRandomWeaponModel(),
            weaponModelFactory.getRandomWeaponModel()],
    );
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
     * Value of entity armour protection. Used to calculate how much of damage dealt will be absorbed by armor.
     */
    public protection: number = 0;

    get weapon(): IWeapon {
        return this.naturalWeapon;
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
        if (animalTypes.includes(this.type)) {
            this.bodySlots = {};
        }
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
                this.inventory.remove(item);
                currentCellInventory.add(item);

                this.notify(EntityEvents.ENTITY_DROPPED_ITEM, item);
            }
        });
    }
    public equipItem(item: WearableModel): void {
        if (this.inventory.has(item)) {
            this.bodySlots[item.bodyPart[0]] = item;
            this.inventory.remove(item);
            this.notify(EntityEvents.ENTITY_EQUIPPED_ITEM, item);
        }
    }
    public removeItem(item: WearableModel): void {
        const itemBodySlot = item.bodyPart;

        if (this.bodySlots[itemBodySlot[0]]) {
            this.bodySlots[itemBodySlot[0]] = null;
            this.inventory.add(item);
        }
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
}
