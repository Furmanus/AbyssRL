import { Cell } from './cell_model';
import { cellsDescriptions } from '../../../helper/cells_description';
import { terrain } from '../../../constants/sprites';
import { cellTypes } from '../../../constants/cell_types';
import { ICellModel } from '../../../interfaces/cell';

export class DeepWater extends Cell implements ICellModel {
  constructor(x: number, y: number) {
    super(x, y);

    this.confirmMovement = true;
    this.type = cellTypes.DEEP_WATER;
    this.description = cellsDescriptions[cellTypes.DEEP_WATER];
  }

  get display(): string {
    return terrain.DEEP_WATER_1;
  }

  get walkMessage(): string {
    return 'You swim through deep water.';
  }
}
