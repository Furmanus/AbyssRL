import {Cell} from './cell_model';
import {cellTypes} from '../../../constants/cell_types';
import {cellsDescriptions} from '../../../helper/cells_description';
import {terrain} from '../../../constants/sprites';
import {ICellModel} from '../../../interfaces/cell';

export class TreeModel extends Cell implements ICellModel {
    constructor(x: number, y: number) {
        super(x, y);

        this.confirmMovement = false;
        this.type = cellTypes.TREE;
        this.description = cellsDescriptions[cellTypes.TREE];
    }
    get blockMovement(): boolean {
        return true;
    }
    get display(): string {
        return terrain.TREE;
    }
}
