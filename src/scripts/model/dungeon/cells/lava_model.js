import {FloorModel} from './floor_model';
import {cellTypes} from '../../../constants/cell_types';
import {cellsDescriptions} from '../../../helper/cells_description';
import {terrain} from '../../../constants/sprites';

export class LavaCellModel extends FloorModel {
    /**
     * @constructor
     * @typedef LavaCellModel
     * @param x
     * @param y
     */
    constructor (x, y) {
        super(x, y, {
            type: cellTypes.LAVA,
            description: cellsDescriptions[cellTypes.LAVA]
        });

        this.confirmMovement = true;
    }
    get display() {
        return [terrain.LAVA];
    }
}