import {Cell} from '../cell_model';
import {CellTypes} from '../../../../constants/cell_types';
import {cellsDescriptions} from '../../../../helper/cells_description';
import {DungeonFeaturesSprites} from '../../../../constants/sprites';
import {ICellConstructorConfig} from '../../../../interfaces/cell';

export class BarrelModel extends Cell {
    constructor(x: number, y: number, config: ICellConstructorConfig) {
        super(x, y, config);

        this.type = CellTypes.BARREL;
        this.description = cellsDescriptions[CellTypes.BARREL];
    }
    get display(): string {
        return DungeonFeaturesSprites.BARREL;
    }
    get blockMovement(): boolean {
        return true;
    }
}
