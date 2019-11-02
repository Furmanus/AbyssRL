import {MonsterAi} from './monster_ai';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {IFilteredFov, IHostilesWithDistance} from './ai';
import {LevelModel} from '../../model/dungeon/level_model';
import {ICoordinates} from '../../interfaces/common';
import {ItemsCollection} from '../../collections/items_collection';
import {EntityModel} from '../../model/entity/entity_model';
import {calculatePathToCell} from '../../helper/pathfinding_helper';
import {ItemModel} from '../../model/items/item_model';
import {isItemModel, isWearableItem} from '../../interfaces/type_guards';
import {ItemTypes} from '../../constants/item';
import {EntityState} from '../../constants/ai_enums';
import {WearableModel} from '../../model/items/wearable_model';

enum EntityNeeds {
    LOW_HEALTH = 'low_health',
    NEED_WEAPON = 'need_weapon',
}
type EntityNeedsType = {
    [P in EntityNeeds]: boolean;
};
interface IEntityGoal {
    type: EntityState;
    priority: number;
    cell: Cell;
    path: ICoordinates[];
    goal: EntityModel | WearableModel;
    inInventory?: boolean;
}

export class HumanoidAi extends MonsterAi {
    public performNextMove(): void {
        const model: EntityModel = this.controller.getModel();
        const fov: Cell[] = this.controller.getFov();
        const filteredFov: IFilteredFov = this.examineFov(fov);
        const entityInventory: ItemsCollection = model.inventory;
        const entityPosition: Cell = this.controller.getEntityPosition();
        const levelModel: LevelModel = this.controller.getLevelModel();
        const entityNeeds: EntityNeedsType = this.calculateNeeds();
        const hostiles: IHostilesWithDistance[] = this.getHostilesWithDistance(filteredFov.entities.map((cell: Cell) => cell.entity));
        const itemsNeeds: IEntityGoal[] = this.examineItemsInFov(entityInventory, filteredFov.items, entityNeeds);
        let currentTarget: IEntityGoal = {priority: 0} as IEntityGoal;

        if (hostiles.length) {
            const nearestHostile = hostiles[0];
            const pathToTarget = calculatePathToCell(model.position, nearestHostile.entity.position, levelModel);
            const currentGoal: IEntityGoal = {
                cell: nearestHostile.entity.position,
                goal: nearestHostile.entity,
                type: EntityState.AGGRESIVE,
                path: pathToTarget,
                priority: this.calculatePriorityForEntity(nearestHostile.entity, pathToTarget.length),
            };

            if (currentGoal.priority > currentTarget.priority) {
                currentTarget = currentGoal;
            }
        } else if (itemsNeeds.length) {
            const itemPriority: IEntityGoal = itemsNeeds[0];
            let currentGoal: IEntityGoal;
            let pathToTarget: ICoordinates[];

            if (itemPriority.inInventory) {
                if (isWearableItem(itemPriority.goal)) {
                    currentGoal = {
                        goal: itemPriority.goal,
                        type: EntityState.DESIRE,
                        path: null,
                        cell: null,
                        inInventory: true,
                        priority: itemPriority.priority,
                    };

                    if (currentGoal.priority > currentTarget.priority) {
                        currentTarget = currentGoal;
                    }
                }
            } else {
                pathToTarget = calculatePathToCell(entityPosition, itemPriority.cell, levelModel);

                currentGoal = {
                    goal: itemPriority.goal,
                    type: EntityState.DESIRE,
                    path: pathToTarget,
                    cell: itemPriority.cell,
                    inInventory: false,
                    priority: itemPriority.priority,
                };

                if (currentGoal.priority > currentTarget.priority) {
                    currentTarget = currentGoal;
                }
            }
        }

        if (currentTarget.goal && currentTarget.priority > 0) {
            if (currentTarget.type === EntityState.DESIRE) {
                if (currentTarget.inInventory && isWearableItem(currentTarget.goal)) {
                    if (model.bodySlots[currentTarget.goal.bodyPart[0]]) {
                        this.controller.removeItem(model.bodySlots[currentTarget.goal.bodyPart[0]] as WearableModel);
                    } else {
                        this.controller.equipItem(currentTarget.goal);
                    }
                } else {
                    if (currentTarget.path.length === 1 && isItemModel(currentTarget.goal)) {
                        this.controller.pickUp(currentTarget.goal);
                    } else if (currentTarget.path.length > 1) {
                        this.controller.move(levelModel.getCell(currentTarget.path[1].x, currentTarget.path[1].y));
                    }
                }
            } else if (currentTarget.type === EntityState.AGGRESIVE) {
                this.controller.move(levelModel.getCell(currentTarget.path[1].x, currentTarget.path[1].y));
            }
        } else {
            this.performIdleTargetMove();
        }
    }
    /**
     * Calculates and returns current "critical" needs of entity (for example, low health, lack of weapon). It doesn't
     * involve any FOV examination.
     */
    public calculateNeeds(): EntityNeedsType {
        const entityModel = this.controller.getModel();

        return {
            [EntityNeeds.LOW_HEALTH]: entityModel.hitPoints / entityModel.maxHitPoints < 0.20,
            [EntityNeeds.NEED_WEAPON]: entityModel.bodySlots['right hand'] === null,
        };
    }
    /**
     * Examines items in entity FOV. This is divided into two steps. In first step items in entity inventory are
     * examined, in second step items in entity FOV. Before examining each collection, collections are filtered to
     * to remove worse items of the same type (for example if entity has two weapons in inventory, it shouldn't consider
     * equipping worse one).
     */
    public examineItemsInFov(inventory: ItemsCollection, fov: Cell[], entityNeeds: EntityNeedsType): IEntityGoal[] {
        const model: EntityModel = this.controller.getModel();
        const levelModel: LevelModel = this.controller.getLevelModel();
        const result: IEntityGoal[] = [];

        inventory = this.filterItemsOfSameTypeFromCollection(inventory);

        inventory.forEach((item: ItemModel) => {
            if (isWearableItem(item)) {
                /**
                 * Slot is empty, entity could use wear this item
                 */
                if (model.bodySlots[item.bodyPart[0]] === null) {
                    result.push({
                        priority: item.itemType === ItemTypes.WEAPON ? 6 : 3,
                        inInventory: true,
                        goal: item,
                        type: EntityState.DESIRE,
                        cell: null,
                        path: null,
                    });
                } else {
                    const wornItem: ItemModel = model.bodySlots[item.bodyPart[0]];

                    if (wornItem === item) {
                        return;
                    }

                    const prefferedItem: ItemModel = this.compareTwoItems(wornItem, item);

                    if (prefferedItem === item) {
                        result.push({
                            priority: 3,
                            inInventory: true,
                            goal: item,
                            path: null,
                            type: EntityState.DESIRE,
                            cell: null,
                        });
                    }
                }
            }
        });
        fov.forEach((cell: Cell) => {
            cell.inventory.forEach((item: ItemModel) => {
                if (isWearableItem(item)) {
                    /**
                     * Slot is empty, entity could use wear this item
                     */
                    if (model.bodySlots[item.bodyPart[0]] === null) {
                        result.push({
                            priority: item.itemType === ItemTypes.WEAPON ? 5 : 3,
                            inInventory: false,
                            goal: item,
                            path: calculatePathToCell(model.position, cell, levelModel),
                            type: EntityState.DESIRE,
                            cell,
                        });
                    } else {
                        const wornItem: ItemModel = model.bodySlots[item.bodyPart[0]];
                        const prefferedItem: ItemModel = this.compareTwoItems(wornItem, item);

                        if (prefferedItem === item) {
                            result.push({
                                priority: 3,
                                inInventory: false,
                                goal: item,
                                path: calculatePathToCell(model.position, cell, levelModel),
                                type: EntityState.DESIRE,
                                cell,
                            });
                        }
                    }
                }
            });
        });

        return result.sort((a: IEntityGoal, b: IEntityGoal) => b.priority - a.priority);
    }
    private calculatePriorityForEntity(entity: EntityModel, distance: number): number {
        if (distance > 1 && distance < 5) {
            return 5;
        } else if (distance >= 5 && distance < 8) {
            return 3;
        } else if (distance >= 8) {
            return 2;
        }
    }
}
