import {Cell} from './cell_model';
import {CellTypes} from '../../../constants/cell_types';
import {cellsDescriptions} from '../../../helper/cells_description';
import {TerrainSprites} from '../../../constants/sprites';
import {ICellConstructorConfig} from '../../../interfaces/cell';

export class TreeModel extends Cell {
    constructor(x: number, y: number, config: ICellConstructorConfig) {
        super(x, y, config);

        this.confirmMovement = false;
        this.type = CellTypes.TREE;
        this.description = cellsDescriptions[CellTypes.TREE];
    }
    get blockMovement(): boolean {
        return true;
    }
    get display(): string {
        return TerrainSprites.TREE;
    }
}
