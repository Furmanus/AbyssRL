import {Cell} from './cell_model';

export class FloorModel extends Cell {
    /**
     * @typedef FloorModel
     * @constructor
     * @param {number}          x                   Horizontal position on level grid.
     * @param {number}          y                   Vertical position on level grid.
     * @param {Object}          config              Configuration object with additional data.
     * @param {string}          config.type         Type of cell.
     * @param {string}          config.description  Description of cell (visible for example while looking at it).
     * @param {Array.<string>}  config.display      Array with cell types name. They must be equal to keys global tiledata.
     */
    constructor (x, y, config) {
        super(x, y);

        this.blockMovement = false;
        this.confirmMovement = false;
        this.blockLos = false;
        this.type = config.type;
        this.description = config.description;
        this.display = config.display.random();
        this.walkMessage = '';
        this.modifiers = null;
    }
}