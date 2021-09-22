import { terrain } from '../../../constants/cells/sprites';
import { cellTypes } from '../../../constants/cells/cell_types';
import { cellsDescriptions } from '../../../helper/cells_description';
import { Cell } from './cell_model';
import { ICellModel } from '../../../interfaces/cell';

export class ShallowWater extends Cell implements ICellModel {
  constructor(x: number, y: number) {
    super(x, y);

    this.type = cellTypes.SHALLOW_WATER;
    this.description = cellsDescriptions[cellTypes.SHALLOW_WATER];
  }

  get display(): string {
    return terrain.SHALLOW_WATER;
  }

  get walkMessage(): string {
    return 'You walk through knee deep water.';
  }
}
