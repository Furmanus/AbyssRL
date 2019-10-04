import {Cell} from './cell_model';
import {cellsDescriptions} from '../../../helper/cells_description';
import {TerrainSprites} from '../../../constants/sprites';
import {CellTypes} from '../../../constants/cell_types';
import {ICellConstructorConfig} from '../../../interfaces/cell';

export class DeepWater extends Cell {
    constructor(x: number, y: number, config: ICellConstructorConfig) {
        super(x, y, config);

        this.confirmMovement = true;
        this.type = CellTypes.DEEP_WATER;
        this.description = cellsDescriptions[CellTypes.DEEP_WATER];
    }
    get display(): string {
        return TerrainSprites.DEEP_WATER_1;
    }
    get walkMessage(): string {
        return 'You swim through deep water.';
    }
}
