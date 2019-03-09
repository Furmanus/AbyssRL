import {EntityModel} from './entity_model';
import {IAnyObject} from '../../interfaces/common';

export class PlayerModel extends EntityModel {
    constructor(config: IAnyObject = {}) {
        super(config);

        this.description = config.name || 'Player';
    }
}
