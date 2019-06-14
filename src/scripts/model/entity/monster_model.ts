import {EntityModel} from './entity_model';
import {IEntity} from '../../interfaces/entity_interfaces';
import {IAnyObject} from '../../interfaces/common';
import {monstersData} from './monsters/data/monsters';

export class MonsterModel extends EntityModel implements IEntity {
    public isHostile: boolean = true;

    public constructor(config: IAnyObject) {
        super(config);

        const entityConfig: Partial<IEntity> = monstersData[config.type];

        for (const attr in entityConfig) {
            if (this.hasOwnProperty(attr)) {
                // @ts-ignore
                this[attr] = entityConfig[attr];
            }
        }
    }
}
