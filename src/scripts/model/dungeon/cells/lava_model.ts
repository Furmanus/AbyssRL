import { FloorModel } from './floor_model';
import { cellTypes } from '../../../constants/cells/cell_types';
import { cellsDescriptions } from '../../../helper/cells_description';
import { terrain } from '../../../constants/cells/sprites';
import { ICellModel } from '../../../interfaces/cell';

export class LavaCellModel extends FloorModel implements ICellModel {
  constructor(x: number, y: number) {
    super(x, y, {
      type: cellTypes.LAVA,
      description: cellsDescriptions[cellTypes.LAVA],
    });

    this.confirmMovement = true;
  }

  get display(): string {
    return terrain.LAVA;
  }
}
