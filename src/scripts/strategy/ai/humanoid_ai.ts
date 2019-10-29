import {MonsterAi} from './monster_ai';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {IFilteredFov, IHostilesWithDistance} from './ai';
import {LevelModel} from '../../model/dungeon/level_model';
import {ICoordinates} from '../../interfaces/common';
import {ItemsCollection} from '../../collections/items_collection';
import {EntityModel} from '../../model/entity/entity_model';
import {calculatePathToCell} from '../../helper/pathfinding_helper';
import {ItemModel} from '../../model/items/item_model';
import {isWearableItem} from '../../interfaces/type_guards';
import {ItemTypes} from '../../constants/item';

enum EntityNeeds {
    LOW_HEALTH = 'low_health',
    NEED_WEAPON = 'need_weapon',
}
type EntityNeedsType = {
    [P in EntityNeeds]: boolean;
};
interface IEntityItemNeeds {
    item: ItemModel;
    priority: 1 | 2 | 3 | 4 | 5;
    cell?: Cell;
    inInventory: boolean;
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
        const priorityCandidates: Cell[] = [];
        const itemsNeeds = this.examineItemsInFov(entityInventory, filteredFov.items, entityNeeds);
        let entityPriority: Cell;
        let pathToTarget: ICoordinates[];

        if (hostiles.length) {
            entityPriority = hostiles[0].entity.position;

            pathToTarget = calculatePathToCell(model.position, entityPriority, levelModel);

            this.controller.move(levelModel.getCell(pathToTarget[1].x, pathToTarget[1].y));
        } else {
            this.makeMoveInRandomDirection();
        }
    }
    public calculateNeeds(): EntityNeedsType {
        const entityModel = this.controller.getModel();

        return {
            [EntityNeeds.LOW_HEALTH]: entityModel.hitPoints / entityModel.maxHitPoints < 0.25,
            [EntityNeeds.NEED_WEAPON]: entityModel.bodySlots['right hand'] === null,
        };
    }
    public examineItemsInFov(inventory: ItemsCollection, fov: Cell[], entityNeeds: EntityNeedsType): IEntityItemNeeds[] {
        const model: EntityModel = this.controller.getModel();
        const result: IEntityItemNeeds[] = [];

        inventory.forEach((item: ItemModel) => {
            if (isWearableItem(item)) {
                /**
                 * Slot is empty, entity could use wear this item
                 */
                if (model.bodySlots[item.bodyPart[0]] === null) {
                    result.push({
                        priority: item.itemType === ItemTypes.WEAPON ? 5 : 3,
                        inInventory: true,
                        item,
                    });
                } else {
                    // Entity already have similiar item equipped, should check if item in fov isn't better
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
                            priority: item.itemType === ItemTypes.WEAPON ? 4 : 3,
                            inInventory: false,
                            cell,
                            item,
                        });
                    } else {
                        // Entity already have similiar item equipped, should check if item in fov isn't better
                    }
                }
            });
        });

        return result;
    }
}
