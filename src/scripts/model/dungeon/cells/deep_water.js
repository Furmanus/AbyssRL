import {Cell} from './cell_model';
import {cellsDescriptions} from "../../../helper/cells_description";
import {terrain} from "../../../constants/sprites";
import {cellTypes} from "../../../constants/cell_types";

export class DeepWater extends Cell {
    /**
     * @typedef DeepWater
     * @constructor
     * @param {number}  x
     * @param {number}  y
     */
    constructor (x, y) {
        super(x, y);

        this.confirmMovement = true;
        this.type = cellTypes.DEEP_WATER;
        this.description = cellsDescriptions[cellTypes.DEEP_WATER];
        this.walkMessage = 'You walk through knee deep water.';
    }
    get display() {
        return [terrain.DEEP_WATER_1];
    }
}