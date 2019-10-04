import {DoorModel} from '../door_model';
import {CellTypes} from "../../../../constants/cell_types";
import {TerrainSprites} from "../../../../constants/sprites";
import {cellsDescriptions} from '../../../../helper/cells_description';
import {IAnyObject} from '../../../../interfaces/common';
import {ICellConstructorConfig, IDoorsCellConstructorConfig} from '../../../../interfaces/cell';

export class WoodenSolidDoorModel extends DoorModel {
    constructor(x: number, y: number, config: IDoorsCellConstructorConfig) {
        super(x, y, config);
        /**
         * Type of cell.
         */
        this.type = CellTypes.WOODEN_SOLID_DOORS;
        this.description = cellsDescriptions[CellTypes.WOODEN_SOLID_DOORS];
        /**
         * Sprite to display when doors are closed.
         */
        this.closedDisplay = TerrainSprites.WOODEN_DOORS;
        /**
         * Sprite to display when doors are open.
         */
        this.openDisplay = config.openDoorsDisplay || TerrainSprites.RED_FLOOR;
        /**
         * Boolean flag indicating if doors are open or not.
         */
        this.areOpen = false;
    }
}
