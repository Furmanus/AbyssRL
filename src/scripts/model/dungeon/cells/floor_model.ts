import { Cell, SerializedCell } from './cell_model';
import { IAnyObject } from '../../../interfaces/common';
import { ICellModel } from '../../../interfaces/cell';
import { CellSpecialConditions } from '../../../constants/cells/cell_types';

export type SerializedFloor = SerializedCell & {
  description: string;
  display: string[];
};

export class FloorModel extends Cell implements ICellModel {
  /**
   * @param   x                   Horizontal position on level grid.
   * @param   y                   Vertical position on level grid.
   * @param   config              Configuration object with additional data.
   * @param   config.type         Type of cell.
   * @param   config.description  Description of cell (visible for example while looking at it).
   * @param   config.display      Array with cell types name. They must be equal to keys global tiledata.
   */
  constructor(config: SerializedFloor) {
    super(config);

    this.type = config.type;
    this.description = config.description;
    this.displaySet = config.display.random();
  }

  get display(): string {
    return this.displaySet;
  }

  set display(tiles: string) {
    this.displaySet = tiles;
  }

  public getDataToSerialization(): SerializedFloor {
    return {
      ...super.getDataToSerialization(),
      description: this.description,
      display: [this.display],
    };
  }
}
