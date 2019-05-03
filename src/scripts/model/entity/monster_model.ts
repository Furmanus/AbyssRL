import {EntityModel} from './entity_model';
import {IEntity} from '../../interfaces/entity_interfaces';
import {IAnyObject} from '../../interfaces/common';
import {monstersData} from './monsters/data/monsters';

export class MonsterModel extends EntityModel implements IEntity {
    public isHostile: boolean = true;

    public constructor(config: IAnyObject) {
        super(config);

        this.initialize(config.type);
    }
    protected initialize(type: string): void {
        const entityConfig: Partial<IEntity> = monstersData[type];

        if (entityConfig) {
            for (const attr in entityConfig) {
                if (this.hasOwnProperty(attr)) {
                    // @ts-ignore
                    this[attr] = entityConfig[attr];
                }
            }
        }
    }
}
