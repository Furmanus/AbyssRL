import {Cell} from '../cell_model';
import {ICellConstructorConfig} from '../../../../interfaces/cell';
import {CellTypes} from '../../../../constants/cell_types';
import {cellsDescriptions} from '../../../../helper/cells_description';
import {DungeonFeaturesSprites} from '../../../../constants/sprites';

export class ChestOfDrawersModel extends Cell {
    constructor(x: number, y: number, config: ICellConstructorConfig) {
        super(x, y, config);

        this.type = CellTypes.CHEST_OF_DRAWERS;
        this.description = cellsDescriptions[CellTypes.CHEST_OF_DRAWERS];
    }
    get display(): string {
        return DungeonFeaturesSprites.CHEST_OF_DRAWERS;
    }
    get blockMovement(): boolean {
        return true;
    }
}
