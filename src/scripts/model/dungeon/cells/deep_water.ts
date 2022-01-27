import { Cell, SerializedCell } from './cell_model';
import { cellsDescriptions } from '../../../helper/cells_description';
import { terrain } from '../../../constants/cells/sprites';
import { CellTypes } from '../../../constants/cells/cell_types';
import { ICellModel } from '../../../interfaces/cell';

export class DeepWater extends Cell implements ICellModel {
  constructor(config: SerializedCell) {
    super(config);

    this.confirmMovement = true;
    this.type = CellTypes.DeepWater;
    this.description = cellsDescriptions[CellTypes.DeepWater];
  }

  get display(): string {
    return terrain.DEEP_WATER_1;
  }

  get walkMessage(): string {
    return 'You swim through deep water.';
  }
}
