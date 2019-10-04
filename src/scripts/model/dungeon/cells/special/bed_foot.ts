import {Cell} from '../cell_model';
import {ICellConstructorConfig} from '../../../../interfaces/cell';
import {CellTypes} from '../../../../constants/cell_types';
import {cellsDescriptions} from '../../../../helper/cells_description';
import {DungeonFeaturesSprites} from '../../../../constants/sprites';

export class BedFoot extends Cell {
    constructor(x: number, y: number, config: ICellConstructorConfig) {
        super(x, y, config);

        this.type = CellTypes.BED_FOOT;
        this.description = cellsDescriptions[CellTypes.BED_FOOT];
    }
    get display(): string {
        return DungeonFeaturesSprites.BED_FOOT;
    }
}
