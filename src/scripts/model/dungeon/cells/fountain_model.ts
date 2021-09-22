import { Cell } from './cell_model';
import { cellTypes } from '../../../constants/cells/cell_types';
import { cellsDescriptions } from '../../../helper/cells_description';
import { terrain } from '../../../constants/cells/sprites';
import { ICellModel } from '../../../interfaces/cell';

export class FountainModel extends Cell implements ICellModel {
  constructor(x: number, y: number) {
    super(x, y);

    this.type = cellTypes.FOUNTAIN;
    this.description = cellsDescriptions[cellTypes.FOUNTAIN];
  }

  get blockMovement(): boolean {
    return true;
  }

  get display(): string {
    return terrain.FOUNTAIN;
  }
}
