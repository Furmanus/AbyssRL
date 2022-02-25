import { FloorModel, SerializedFloor } from './floor_model';
import { CellTypes } from '../../constants/cellTypes.constants';
import { cellsDescriptions } from '../../constants/cellsDescriptions.constants';
import { terrain } from '../../constants/sprites.constants';
import { ICellModel } from '../../interfaces/cell';

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
