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
     */
    constructor (x, y) {
        super(x, y);

        this.type = cellTypes.WOODEN_SOLID_DOORS;
        this.description = cellsDescriptions[cellTypes.WOODEN_SOLID_DOORS];
        this.display = [terrain.WOODEN_DOORS];
    }
}