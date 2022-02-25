import { Cell, SerializedCell } from './cell_model';
import { CellTypes } from '../../constants/cellTypes.constants';
import { cellsDescriptions } from '../../constants/cellsDescriptions.constants';
import { terrain } from '../../constants/sprites.constants';
import { ICellModel } from '../../interfaces/cell';

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
