import {Cell} from '../cell_model';
import {ICellModel} from '../../../../interfaces/cell';
import {cellTypes} from '../../../../constants/cell_types';
import {cellsDescriptions} from '../../../../helper/cells_description';
import {dungeonFeaturesEnum} from '../../../../constants/sprites';

export class BedHead extends Cell implements ICellModel {
    constructor(x: number, y: number) {
        super(x, y);

        this.type = cellTypes.BED_HEAD;
        this.description = cellsDescriptions[cellTypes.BED_HEAD];
    }
    get display(): string {
        return dungeonFeaturesEnum.BED_HEAD;
    }
    get walkMessage(): string {
        return 'There is a bed here.';
    }
}
