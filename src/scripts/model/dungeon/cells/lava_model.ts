import { FloorModel, SerializedFloor } from './floor_model';
import { CellTypes } from '../../../constants/cells/cell_types';
import { cellsDescriptions } from '../../../helper/cells_description';
import { terrain } from '../../../constants/cells/sprites';
import { ICellModel } from '../../../interfaces/cell';

export class LavaCellModel extends FloorModel implements ICellModel {
  constructor(config: SerializedFloor) {
    super(config);

    this.type = CellTypes.Lava;
    this.description = cellsDescriptions[CellTypes.Lava];
    this.confirmMovement = true;
  }

  get display(): string {
    return terrain.LAVA;
  }
}
