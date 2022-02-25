import { Cell, SerializedCell } from './cell_model';
import { cellsDescriptions } from '../../constants/cellsDescriptions.constants';
import { terrain } from '../../constants/sprites.constants';
import { CellTypes } from '../../constants/cellTypes.constants';
import { ICellModel } from '../../interfaces/cell';

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
