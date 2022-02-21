import { terrain } from '../../../constants/cells/sprites';
import { CellTypes } from '../../../constants/cells/cell_types';
import { cellsDescriptions } from '../../../helper/cells_description';
import { Cell, SerializedCell } from './cell_model';
import { ICellModel } from '../../../interfaces/cell';

export class ShallowWater extends Cell implements ICellModel {
  constructor(config: SerializedCell) {
    super(config);

    this.type = CellTypes.ShallowWater;
    this.description = cellsDescriptions[CellTypes.ShallowWater];
  }

  get display(): string {
    return terrain.SHALLOW_WATER;
  }

  get walkMessage(): string {
    return 'You walk through knee deep water.';
  }
}
