import {EntityController} from '../../controller/entity/entity_controller';
import {MonsterController} from '../../controller/entity/monster_controller';
import {LevelModel} from '../../model/dungeon/level_model';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {MonstersTypes} from '../../constants/monsters';
import {EntityModel} from '../../model/entity/entity_model';
import {calculatePathToCell} from '../../helper/pathfinding_helper';
import {ICoordinates} from '../../interfaces/common';
import {ItemModel} from '../../model/items/item_model';
import {ItemTypes} from '../../constants/item';
import {isAmuletModel, isArmourModel, isRingModel, isWeaponModel} from '../../interfaces/type_guards';
import {ItemsCollection} from '../../collections/items_collection';

export interface IInitialConfigAi<C extends EntityController = MonsterController> {
    controller: C;
}
export interface IFilteredFov {
    entities: Cell[];
    items: Cell[];
}
export interface IArtificialIntelligence {
    performNextMove: () => void;
}
export interface IHostilesWithDistance {
    entity: EntityModel;
    path: ICoordinates[];
    priority?: number;
}
/**
 * Abstract class containing AI algorithms and methods for game entities. Class contains common methods for all types
 * of AI present in game.
 */
export abstract class Ai<C extends EntityController = MonsterController> implements IArtificialIntelligence {
    /**
     * Controller of entity, which behaviour needs to be calculated by this strategy.
     */
    protected controller: C;

    constructor(config: IInitialConfigAi<C>) {
        this.controller = config.controller;
    }
    /**
     * Method responsible for calculating and performing next movement by entity. Implemented properly in deritive
     * classes, this fallback option makes simplest random movement.
     */
    public performNextMove(): void {
        this.makeMoveInRandomDirection();
    }
    protected examineFov(fov: Cell[]): IFilteredFov {
        const filteredFov: IFilteredFov = {
            entities: [],
            items: [],
        };

        fov.forEach((cell: Cell) => {
            const cellHasEntity: boolean = cell.entity && cell.entity !== this.controller.getModel();
            const cellHasItems: boolean = cell.inventory.size > 0;

            if (cellHasEntity) {
                filteredFov.entities.push(cell);
            }
            if (cellHasItems) {
                filteredFov.items.push(cell);
            }
        });

        return filteredFov;
    }
    protected makeMoveInRandomDirection(): void {
        const levelModel: LevelModel = this.controller.getLevelModel();
        const currentPosition: Cell = this.controller.getEntityPosition();
        const nextCell: Cell = levelModel.getRandomNeighbourCallback(currentPosition, (candidate: Cell) => {
            return (!candidate.blockMovement && ! candidate.entity);
        });

        if (nextCell) {
            this.controller.move(nextCell);
        }
    }
    protected getMonsterEnemiesList(): MonstersTypes[] {
        const model: EntityModel = this.controller.getModel();

        switch (model.type) {
            case MonstersTypes.GIANT_RAT:
                return [MonstersTypes.PLAYER, MonstersTypes.ORC];
            case MonstersTypes.ORC:
                return [MonstersTypes.PLAYER, MonstersTypes.GIANT_RAT];
            default:
                return [];
        }
    }
    public getHostilesWithDistance(entities: EntityModel[]): IHostilesWithDistance[] {
        const hostileList: MonstersTypes[] = this.getMonsterEnemiesList();
        const model: EntityModel = this.controller.getModel();
        const levelModel: LevelModel = this.controller.getLevelModel();

        return entities.filter((entity: EntityModel) => hostileList.includes(entity.type)).map((entity: EntityModel) => {
            return {
                path: calculatePathToCell(model.position, entity.position, levelModel),
                entity,
            };
        }).sort((first, second) => first.path.length - second.path.length);
    }
    /**
     * Compares two item models of same type and return item which will be considered more valuable and worth equipping
     * by monster. When comparing worn item with other item, worn item should be passed as first argument, because first
     * argument is returned by default, if items values are equal.
     *
     * @param itemFirst     First item to compare. When comparing worn item with something, worn item should be first argument
     * @param itemSecond    Second item to compare
     */
    protected compareTwoItems(itemFirst: ItemModel, itemSecond: ItemModel): ItemModel {
        if (itemFirst.itemType !== itemSecond.itemType) {
            return null;
        }

        if (isWeaponModel(itemFirst) && isWeaponModel(itemSecond)) {
            return (itemFirst.damage.getMaximumValue() >= itemSecond.damage.getMaximumValue()) ? itemFirst : itemSecond;
        } else if (isArmourModel(itemFirst) && isArmourModel(itemSecond)) {
            const {
                protection: protectionFirst,
            } = itemFirst;
            const {
                protection: protectionSecond,
            } = itemSecond;

            return (protectionFirst >= protectionSecond) ? itemFirst : itemSecond;
        } else if (isAmuletModel(itemFirst) && isAmuletModel(itemSecond)) {
            // TODO add proper logic to compare item modifiers when they will be fully implemented
            return itemFirst;
        } else if (isRingModel(itemFirst) && isRingModel(itemSecond)) {
            // TODO add proper logic to compare item modifiers when they will be fully implemented
            return itemFirst;
        }

        return itemFirst;
    }
    /**
     * Method responsible for looking for items of the same types in collection and removing item which shouldn't be
     * which are worse items to equip than those already present in inventory.
     *
     * @param collection    Collection to examine and filter
     */
    protected filterItemsOfSameTypeFromCollection(collection: ItemsCollection): ItemsCollection {
        const collectionCopy: ItemModel[] = [...collection.get()];

        collectionCopy.forEach((item: ItemModel, index: number) => {
            if (item === undefined) {
                return;
            }

            collectionCopy.forEach((examinedItem: ItemModel, examinedIndex: number) => {
                if (item === examinedItem) {
                    return;
                }

                if (this.areItemsComparable(item, examinedItem)) {
                    const betterItem: ItemModel = this.compareTwoItems(item, examinedItem);

                    betterItem === item ? delete collectionCopy[examinedIndex] : delete collectionCopy[index];
                }
            });
        });

        return new ItemsCollection(collectionCopy.filter((item: ItemModel) => !(item === undefined)));
    }
    /**
     * Method determining whether two items can be compared with each other and better item to equip can be choosen.
     *
     * @param item1     First item to compare
     * @param item2     Second item to compare
     */
    protected areItemsComparable(item1: ItemModel, item2: ItemModel): boolean {
        const allowedTypes = [ItemTypes.WEAPON, ItemTypes.ARMOUR, ItemTypes.RING, ItemTypes.AMULET];

        if (item1.itemType !== item2.itemType) {
            return false;
        }

        return allowedTypes.includes(item1.itemType);
    }
}
