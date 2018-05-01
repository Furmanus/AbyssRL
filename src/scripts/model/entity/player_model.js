import {EntityModel} from './entity_model';
import {Utility} from './../../helper/utility';
import {config} from '../../global/config';
import {PLAYER_WALK_CONFIRM_NEEDED} from '../../constants/player_actions';

export class PlayerModel extends EntityModel{

    constructor(config){
        super(config);
    }
}