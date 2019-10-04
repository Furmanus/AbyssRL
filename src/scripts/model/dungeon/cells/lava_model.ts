import {FloorModel} from './floor_model';
import {CellTypes} from '../../../constants/cell_types';
import {cellsDescriptions} from '../../../helper/cells_description';
import {TerrainSprites} from '../../../constants/sprites';
import {ICellConstructorConfig} from '../../../interfaces/cell';

export class LavaCellModel extends FloorModel {
    constructor(x: number, y: number, config: ICellConstructorConfig) {
        super(x, y, {
            ...config,
            type: CellTypes.LAVA,
            description: cellsDescriptions[CellTypes.LAVA],
        });

        this.confirmMovement = true;
    }
    get display(): string {
        return TerrainSprites.LAVA;
    }
}
