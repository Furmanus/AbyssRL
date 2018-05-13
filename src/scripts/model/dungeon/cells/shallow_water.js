import {terrain} from '../../../constants/sprites';
import {cellTypes} from '../../../constants/cell_types';
import {cellsDescriptions} from '../../../helper/cells_description';
import {Cell} from './cell_model';

export class ShallowWater extends Cell{
    /**
     * @typedef ShallowWater
     * @constructor
     * @param {number} x
     * @param {number} y
     */
    constructor(x, y){
        super(x, y);

        this.blockMovement = false;
        this.confirmMovement = false;
        this.blockLos = false;
        this.type = cellTypes.SHALLOW_WATER;
        this.description = cellsDescriptions[cellTypes.SHALLOW_WATER];
        this.display = [terrain.SHALLOW_WATER];
        this.walkMessage = 'You walk through knee deep water.';
        this.modifiers = null;
    }
}