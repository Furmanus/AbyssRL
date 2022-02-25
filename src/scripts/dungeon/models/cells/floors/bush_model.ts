import { Cell, SerializedCell } from '../cell_model';
import { CellTypes } from '../../../constants/cellTypes.constants';
import { cellsDescriptions } from '../../../constants/cellsDescriptions.constants';
import { terrain } from '../../../constants/sprites.constants';
import { ICellModel } from '../../../interfaces/cell';

export class BushModel extends Cell implements ICellModel {
  constructor(config: SerializedCell) {
    super(config);

    this.type = CellTypes.Bush;
    this.description = cellsDescriptions[CellTypes.Bush];
  }

  get display(): string {
    return terrain.THICK_BUSH;
  }

  get walkMessage(): string {
    return 'A thick bush is growing here';
  }
}
