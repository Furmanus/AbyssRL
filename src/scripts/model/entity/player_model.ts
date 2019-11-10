import {EntityModel} from './entity_model';
import {IAnyObject} from '../../interfaces/common';
import {MonsterSizes} from '../../constants/monsters';

export class PlayerModel extends EntityModel {
    constructor(config: IAnyObject = {}) {
        super(config);

        this.description = config.name || 'Anonymous brave hero';
        this.baseStrength = config.strength;
        this.baseDexterity = config.dexterity;
        this.baseIntelligence = config.intelligence;
        this.baseToughness = config.toughness;
        this.hitPoints = config.hitPoints;
        this.maxHitPoints = config.maxHitPoints;
        this.size = MonsterSizes.MEDIUM;
    }
}
