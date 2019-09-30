import {Cell} from '../cell_model';
import {CellTypes} from '../../../../constants/cell_types';
import {cellsDescriptions} from '../../../../helper/cells_description';
import {TerrainSprites} from '../../../../constants/sprites';
import {ICellConstructorConfig} from '../../../../interfaces/cell';

export class BushModel extends Cell {
    constructor(x: number, y: number, config: ICellConstructorConfig) {
        super(x, y, config);

        this.type = CellTypes.BUSH;
        this.description = cellsDescriptions[CellTypes.BUSH];
    }
    get display(): string {
        return TerrainSprites.THICK_BUSH;
    }
    get walkMessage(): string {
        return 'A thick bush is growing here';
    }
}
