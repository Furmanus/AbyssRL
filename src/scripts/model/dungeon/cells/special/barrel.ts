import {Cell} from '../cell_model';
import {cellTypes} from '../../../../constants/cell_types';
import {cellsDescriptions} from '../../../../helper/cells_description';
import {dungeonFeaturesEnum} from '../../../../constants/sprites';
import {ICellModel} from '../../../../interfaces/cell';

export class BarrelModel extends Cell implements ICellModel {
    constructor(x: number, y: number) {
        super(x, y);

        this.type = cellTypes.BARREL;
        this.description = cellsDescriptions[cellTypes.BARREL];
    }
    get display(): string {
        return dungeonFeaturesEnum.BARREL;
    }
    get blockMovement(): boolean {
        return true;
    }
}
