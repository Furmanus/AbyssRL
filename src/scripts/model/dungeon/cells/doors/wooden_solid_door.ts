import { DoorModel, SerializedDoor } from '../door_model';
import { CellTypes } from '../../../../constants/cells/cell_types';
import { terrain } from '../../../../constants/cells/sprites';
import { cellsDescriptions } from '../../../../helper/cells_description';
import { IAnyObject } from '../../../../interfaces/common';
import { ICellModel } from '../../../../interfaces/cell';

export class WoodenSolidDoorModel extends DoorModel implements ICellModel {
  constructor(config: SerializedDoor) {
    super(config);
    /**
     * Type of cell.
     */
    this.type = CellTypes.WoodenSolidDoors;
    this.description = cellsDescriptions[CellTypes.WoodenSolidDoors];
    /**
     * Sprite to display when doors are closed.
     */
    this.closedDisplay = terrain.WOODEN_DOORS;
    /**
     * Sprite to display when doors are open.
     */
    this.openDisplay = config.openDisplay || terrain.RED_FLOOR;
  }
}
