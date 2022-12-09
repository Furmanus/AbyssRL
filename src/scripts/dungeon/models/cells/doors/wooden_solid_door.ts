import { DoorModel, SerializedDoor } from '../door_model';
import { CellTypes } from '../../../constants/cellTypes.constants';
import { terrain } from '../../../constants/sprites.constants';
import { cellsDescriptions } from '../../../constants/cellsDescriptions.constants';
import { ICellModel } from '../../../interfaces/cell';

export class WoodenSolidDoorModel extends DoorModel implements ICellModel {
  public get display(): string {
    return terrain.WOODEN_DOORS;
  }

  constructor(config: SerializedDoor) {
    super(config);
    /**
     * Type of cell.
     */
    this.type = CellTypes.WoodenSolidDoors;
    this.description = cellsDescriptions[CellTypes.WoodenSolidDoors];
  }
}
