import { Cell, SerializedCell } from '../cell_model';
import {
  CellTypes,
} from '../../../constants/cellTypes.constants';
import { cellsDescriptions } from '../../../constants/cellsDescriptions.constants';
import { terrain } from '../../../constants/sprites.constants';
import { DOWN, UP } from '../../../constants/stairsDirections.constants';
import * as Utility from '../../../../utils/utility';
import { ICellModel } from '../../../interfaces/cell';

export interface SerializedStairs extends SerializedCell {
  direction: typeof UP | typeof DOWN;
}
// TODO fix weird logic determining when stairs lead downwards
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
      direction: this.areStairsUp === UP ? UP : DOWN,
    };
  }
}
