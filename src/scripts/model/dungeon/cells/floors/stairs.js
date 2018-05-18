import {Cell} from './../cell_model';
import {cellTypes} from '../../../../constants/cell_types';
import {cellsDescriptions} from '../../../../helper/cells_description';
import {terrain} from '../../../../constants/sprites';
import {UP} from '../../../../constants/stairs_directions';

export class StairsModel extends Cell{
    /**
     * @typedef StairsModel
     * @constructor
     * @param {number}          x                   Horizontal position on level grid.
     * @param {number}          y                   Vertical position on level grid.
     * @param {Object}          config              Configuration object.
     * @param {string}          config.direction    Direction of stairs - either up or down.
     */
    constructor(x, y, config){
        super(x, y);

        this.blockMovement = false;
        this.confirmMovement = false;
        this.blockLos = false;
        this.type = config.direction === UP ? cellTypes.STAIRS_UP : cellTypes.STAIRS_DOWN;
        this.description = cellsDescriptions[this.type];
        this.display = config.direction === UP ? [terrain.STAIRS_UP] : [terrain.STAIRS_DOWN];
        this.walkMessage = `${this.description} is here`;
        this.modifiers = null;
    }
}