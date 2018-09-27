import {Cell} from './cell_model';
import {cellTypes} from '../../../constants/cell_types';
import {cellsDescriptions} from '../../../helper/cells_description';
import {terrain} from '../../../constants/sprites';

export class FountainModel extends Cell {
    /**
     * @constructor
     * @typedef FountainModel
     * @param {number}  x
     * @param {number}  y
     */
    constructor (x, y) {
        super(x, y);

        this.type = cellTypes.FOUNTAIN;
        this.description = cellsDescriptions[cellTypes.FOUNTAIN];
    }
    get blockMovement() {
        return true;
    }
    get display() {
        return [terrain.FOUNTAIN];
    }
}