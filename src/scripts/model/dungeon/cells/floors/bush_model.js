import {Cell} from './../cell_model';
import {cellTypes} from '../../../../constants/cell_types';
import {cellsDescriptions} from '../../../../helper/cells_description';
import {terrain} from '../../../../constants/sprites';

export class BushModel extends Cell{
    /**
     * @typedef BushModel
     * @constructor
     * @param {number}          x                   Horizontal position on level grid.
     * @param {number}          y                   Vertical position on level grid.
     */
    constructor(x, y){
        super(x, y);

        this.blockMovement = false;
        this.confirmMovement = false;
        this.blockLos = false;
        this.type = cellTypes.BUSH;
        this.description = cellsDescriptions[cellTypes.BUSH];
        this.display = [terrain.THICK_BUSH];
        this.walkMessage = 'a thick bush is growing here';
        this.modifiers = null;
    }
}