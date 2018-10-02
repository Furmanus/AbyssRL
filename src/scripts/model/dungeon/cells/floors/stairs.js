import {Cell} from './../cell_model';
import {cellTypes} from '../../../../constants/cell_types';
import {cellsDescriptions} from '../../../../helper/cells_description';
import {terrain} from '../../../../constants/sprites';
import {UP} from '../../../../constants/stairs_directions';
import {Utility} from '../../../../helper/utility';

let areStairsUp = Symbol('areStairsUp');

export class StairsModel extends Cell {
    /**
     * @typedef StairsModel
     * @constructor
     * @param {number}          x                   Horizontal position on level grid.
     * @param {number}          y                   Vertical position on level grid.
     * @param {Object}          config              Configuration object.
     * @param {string}          config.direction    Direction of stairs - either up or down.
     */
    constructor (x, y, config) {
        super(x, y);

        this.type = config.direction === UP ? cellTypes.STAIRS_UP : cellTypes.STAIRS_DOWN;
        this.description = cellsDescriptions[this.type];

        this[areStairsUp] = config.direction;
    }
    get display() {
        return this[areStairsUp] ? [terrain.STAIRS_UP] : [terrain.STAIRS_DOWN];
    }
    get walkMessage() {
        return Utility.capitalizeString(`${this.description} is here.`);
    }
}