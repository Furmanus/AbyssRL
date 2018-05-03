import {Cell} from './cell_model';
import {cellTypes} from '../../../constants/cell_types';
import {cellsDescriptions} from '../../../helper/cells_description';
import {terrain} from '../../../constants/sprites';

export class FountainModel extends Cell{
    /**
     * @constructor
     * @typedef FountainModel
     * @param {number}  x
     * @param {number}  y
     */
    constructor(x, y){
        super(x, y);

        this.blockMovement = true;
        this.type = cellTypes.FOUNTAIN;
        this.description = cellsDescriptions[cellTypes.FOUNTAIN];
        this.display = [terrain.FOUNTAIN];
    }
}