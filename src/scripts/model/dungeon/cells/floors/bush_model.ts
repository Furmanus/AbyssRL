import { Cell } from '../cell_model';
import { cellTypes } from '../../../../constants/cells/cell_types';
import { cellsDescriptions } from '../../../../helper/cells_description';
import { terrain } from '../../../../constants/cells/sprites';
import { ICellModel } from '../../../../interfaces/cell';

export class BushModel extends Cell implements ICellModel {
  constructor(x: number, y: number) {
    super(x, y);

    this.type = cellTypes.BUSH;
    this.description = cellsDescriptions[cellTypes.BUSH];
  }

  get display(): string {
    return terrain.THICK_BUSH;
  }

  get walkMessage(): string {
    return 'A thick bush is growing here';
  }
}
