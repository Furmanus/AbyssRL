import {Cell} from './cell_model';
import {cellTypes} from '../../../constants/cell_types';
import {cellsDescriptions} from '../../../helper/cells_description';
import {terrain} from '../../../constants/sprites';

export class TreeModel extends Cell{
    /**
     * @typedef TreeModel
     * @constructor
     * @param {number}          x                   Horizontal position on level grid.
     * @param {number}          y                   Vertical position on level grid.
     */
    constructor (x, y) {
        super(x, y);

        this.blockMovement = true;
        this.confirmMovement = false;
        this.blockLos = false;
        this.type = cellTypes.TREE;
        this.description = cellsDescriptions[cellTypes.TREE];
        this.display = [terrain.TREE];
        this.walkMessage = '';
        this.modifiers = null;
    }
}