import { Cell, SerializedCell } from './cell_model';
import { CellTypes } from '../../../constants/cells/cell_types';
import { cellsDescriptions } from '../../../helper/cells_description';
import { terrain } from '../../../constants/cells/sprites';
import { ICellModel } from '../../../interfaces/cell';

export class FountainModel extends Cell implements ICellModel {
  constructor(config: SerializedCell) {
    super(config);

    this.type = CellTypes.Fountain;
    this.description = cellsDescriptions[CellTypes.Fountain];
  }

  get blockMovement(): boolean {
    return true;
  }

  get display(): string {
    return terrain.FOUNTAIN;
  }
}
