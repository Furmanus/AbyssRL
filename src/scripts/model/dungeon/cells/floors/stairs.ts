import { Cell } from '../cell_model';
import { cellTypes } from '../../../../constants/cell_types';
import { cellsDescriptions } from '../../../../helper/cells_description';
import { terrain } from '../../../../constants/sprites';
import { UP } from '../../../../constants/stairs_directions';
import * as Utility from '../../../../helper/utility';
import { IAnyObject } from '../../../../interfaces/common';
import { ICellModel } from '../../../../interfaces/cell';

export class StairsModel extends Cell implements ICellModel {
    private areStairsUp: string;
    /**
     * @param   x                   Horizontal position on level grid.
     * @param   y                   Vertical position on level grid.
     * @param   config              Configuration object.
     * @param   config.direction    Direction of stairs - either up or down.
     */
    constructor(x: number, y: number, config: IAnyObject) {
      super(x, y);

      this.type = config.direction === UP ? cellTypes.STAIRS_UP : cellTypes.STAIRS_DOWN;
      this.description = cellsDescriptions[this.type];

      this.areStairsUp = config.direction;
    }

    get display(): string {
      return this.areStairsUp === UP ? terrain.STAIRS_UP : terrain.STAIRS_DOWN;
    }

    get walkMessage(): string {
      return Utility.capitalizeString(`${this.description} is here.`);
    }
}
