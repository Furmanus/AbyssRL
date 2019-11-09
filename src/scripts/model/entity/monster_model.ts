import {EntityModel} from './entity_model';
import {IEntity} from '../../interfaces/entity_interfaces';
import {monstersData, MonsterTypesData} from './monsters/data/monsters';
import {Cell} from '../dungeon/cells/cell_model';
import {ItemsCollection} from '../../collections/items_collection';
import {LevelModel} from '../dungeon/level_model';

interface IMonsterModelConfig {
    type: MonsterTypesData;
    position: Cell;
    level: LevelModel;
}

export class MonsterModel extends EntityModel {
    /**
     * Place where entity will want to go, if there is nothing interesting in his FOV
     */
    public currentIdleTarget: Cell = null;
    public isHostile: boolean = true;

    public constructor(config: IMonsterModelConfig) {
        super(config);

        const entityConfig: Partial<IEntity> = monstersData[config.type];

        for (const attr in entityConfig) {
            if (this.hasOwnProperty(attr)) {
                // @ts-ignore
                this[attr] = entityConfig[attr];

                if (attr === 'inventory') {
                    this.inventory = new ItemsCollection([...entityConfig[attr]]);
                }
            }
        }
    }
    public getSerializedData(): object {
        return {
            ...super.getSerializedData(),
            currentIdleTarget: this.currentIdleTarget.id,
        };
    }
}
