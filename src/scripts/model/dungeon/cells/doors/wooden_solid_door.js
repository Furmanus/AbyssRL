import {DoorModel} from '../door_model';
import {cellTypes} from "../../../../constants/cell_types";
import {terrain} from "../../../../constants/sprites";
import {cellsDescriptions} from '../../../../helper/cells_description';

export class WoodenSolidDoorModel extends DoorModel {
    /**
     * @constructor
     * @typedef WoodenSolidDoorModel
     * @param {number}  x
     * @param {number}  y
     * @param {Object}  config  Object with additional cell configuration data
     */
    constructor(x, y, config = {}) {
        super(x, y);
        /**
         * Type of cell.
         * @type {string}
         */
        this.type = cellTypes.WOODEN_SOLID_DOORS;
        this.description = cellsDescriptions[cellTypes.WOODEN_SOLID_DOORS];
        /**
         * Sprite to display when doors are closed.
         * @type {*[]}
         */
        this.closedDisplay = [terrain.WOODEN_DOORS];
        /**
         * Sprite to display when doors are open.
         * @type {string}
         */
        this.openDisplay = config.openDoorsDisplay || [terrain.RED_FLOOR];
        /**
         * Boolean flag indicating if doors are open or not.
         * @type {boolean}
         */
        this.areOpen = false;
    }
}