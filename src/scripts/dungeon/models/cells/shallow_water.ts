import { terrain } from '../../constants/sprites.constants';
import { CellTypes } from '../../constants/cellTypes.constants';
import { cellsDescriptions } from '../../constants/cellsDescriptions.constants';
import { Cell, SerializedCell } from './cell_model';
import { ICellModel } from '../../interfaces/cell';

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
