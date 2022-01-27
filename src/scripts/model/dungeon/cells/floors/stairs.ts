import { Cell, SerializedCell } from '../cell_model';
import {
  CellSpecialConditions,
  CellTypes,
} from '../../../../constants/cells/cell_types';
import { cellsDescriptions } from '../../../../helper/cells_description';
import { terrain } from '../../../../constants/cells/sprites';
import { DOWN, UP } from '../../../../constants/cells/stairs_directions';
import * as Utility from '../../../../helper/utility';
import { IAnyObject } from '../../../../interfaces/common';
import { ICellModel } from '../../../../interfaces/cell';

export interface SerializedStairs extends SerializedCell {
  direction: typeof UP | typeof DOWN;
}

export class StairsModel extends Cell implements ICellModel {
  private areStairsUp: string;

  constructor(config: SerializedStairs) {
    super(config);

    this.type =
      config.direction === UP ? CellTypes.StairsUp : CellTypes.StairsDown;
    this.description = cellsDescriptions[this.type];

    this.areStairsUp = config.direction;
  }

  get display(): string {
    return this.areStairsUp === UP ? terrain.STAIRS_UP : terrain.STAIRS_DOWN;
  }

  get walkMessage(): string {
    let message = Utility.capitalizeString(`${this.description} is here.`);
    const superMessage = super.walkMessage;

    if (superMessage) {
      message += ` ${superMessage}`;
    }

    return message;
  }

  public getDataToSerialization(): SerializedStairs {
    return {
      ...super.getDataToSerialization(),
      direction: this.areStairsUp ? UP : DOWN,
    };
  }
}
