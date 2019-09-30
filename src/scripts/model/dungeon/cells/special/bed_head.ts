import {Cell} from '../cell_model';
import {ICellConstructorConfig} from '../../../../interfaces/cell';
import {CellTypes} from '../../../../constants/cell_types';
import {cellsDescriptions} from '../../../../helper/cells_description';
import {DungeonFeaturesSprites} from '../../../../constants/sprites';

export class BedHead extends Cell {
    constructor(x: number, y: number, config: ICellConstructorConfig) {
        super(x, y, config);

        this.type = CellTypes.BED_HEAD;
        this.description = cellsDescriptions[CellTypes.BED_HEAD];
    }
    get display(): string {
        return DungeonFeaturesSprites.BED_HEAD;
    }
    get walkMessage(): string {
        return 'There is a bed here.';
    }
}
