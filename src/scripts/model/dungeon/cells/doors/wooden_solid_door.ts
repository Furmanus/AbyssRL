import { DoorModel } from '../door_model';
import { cellTypes } from '../../../../constants/cell_types';
import { terrain } from '../../../../constants/sprites';
import { cellsDescriptions } from '../../../../helper/cells_description';
import { IAnyObject } from '../../../../interfaces/common';
import { ICellModel } from '../../../../interfaces/cell';

export class WoodenSolidDoorModel extends DoorModel implements ICellModel {
  constructor(x: number, y: number, config: IAnyObject = {}) {
    super(x, y, config);
    /**
     * Type of cell.
     */
    this.type = cellTypes.WOODEN_SOLID_DOORS;
    this.description = cellsDescriptions[cellTypes.WOODEN_SOLID_DOORS];
    /**
     * Sprite to display when doors are closed.
     */
    this.closedDisplay = terrain.WOODEN_DOORS;
    /**
     * Sprite to display when doors are open.
     */
    this.openDisplay = config.openDoorsDisplay || terrain.RED_FLOOR;
    /**
     * Boolean flag indicating if doors are open or not.
     */
    this.areOpen = false;
  }
}
