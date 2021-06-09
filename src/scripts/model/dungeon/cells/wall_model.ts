import { Cell } from './cell_model';
import { IAnyObject } from '../../../interfaces/common';
import { ICellModel } from '../../../interfaces/cell';

export class WallModel extends Cell implements ICellModel {
  /**
     * @param   x                   Horizontal position on level grid.
     * @param   y                   Vertical position on level grid.
     * @param   config              Configuration object with additional data.
     * @param   config.type         Type of cell.
     * @param   config.description  Description of cell (visible for example while looking at it).
     * @param   config.display      Array with cell types name. They must be equal to keys global tiledata.
     */
  constructor(x: number, y: number, config: IAnyObject) {
    super(x, y);

    this.type = config.type;
    this.description = config.description;
    this.displaySet = config.display.random();
  }

  get blockMovement(): boolean {
    return true;
  }

  get blocksLos(): boolean {
    return true;
  }

  get display(): string {
    return this.displaySet;
  }

  set display(tiles: string) {
    this.displaySet = tiles;
  }
}
