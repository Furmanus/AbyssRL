import {TerrainSprites} from '../../../constants/sprites';
import {CellTypes} from '../../../constants/cell_types';
import {cellsDescriptions} from '../../../helper/cells_description';
import {Cell} from './cell_model';
import {ICellConstructorConfig} from '../../../interfaces/cell';

export class ShallowWater extends Cell {
    constructor(x: number, y: number, config: ICellConstructorConfig) {
        super(x, y, config);

        this.type = CellTypes.SHALLOW_WATER;
        this.description = cellsDescriptions[CellTypes.SHALLOW_WATER];
    }
    get display(): string {
        return TerrainSprites.SHALLOW_WATER;
    }
    get walkMessage(): string {
        return 'You walk through knee deep water.';
    }
}
