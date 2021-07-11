import { Cell } from '../cell_model';
import { ICellModel } from '../../../../interfaces/cell';
import { cellTypes } from '../../../../constants/cell_types';
import { cellsDescriptions } from '../../../../helper/cells_description';
import { dungeonFeaturesEnum } from '../../../../constants/sprites';

export class ChestOfDrawersModel extends Cell implements ICellModel {
  constructor(x: number, y: number) {
    super(x, y);

    this.type = cellTypes.CHEST_OF_DRAWERS;
    this.description = cellsDescriptions[cellTypes.CHEST_OF_DRAWERS];
  }

  get display(): string {
    return dungeonFeaturesEnum.CHEST_OF_DRAWERS;
  }

  get blockMovement(): boolean {
    return true;
  }
}
