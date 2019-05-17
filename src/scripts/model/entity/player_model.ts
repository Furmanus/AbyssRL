import {EntityModel} from './entity_model';
import {IAnyObject} from '../../interfaces/common';
import {MonstersTypes} from '../../constants/monsters';

export class PlayerModel extends EntityModel {
    constructor(config: IAnyObject = {}) {
        super(config);

        this.description = config.name || 'Anonymous brave hero';
        this.type = MonstersTypes.PLAYER;
        this.strength = config.strength;
        this.dexterity = config.dexterity;
        this.intelligence = config.intelligence;
        this.toughness = config.toughness;
        this.hitPoints = config.hitPoints;
        this.maxHitPoints = config.maxHitPoints;
    }
}
