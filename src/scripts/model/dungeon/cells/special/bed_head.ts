import { Cell, SerializedCell } from '../cell_model';
import { ICellModel } from '../../../../interfaces/cell';
import { CellTypes } from '../../../../constants/cells/cell_types';
import { cellsDescriptions } from '../../../../helper/cells_description';
import { dungeonFeaturesEnum } from '../../../../constants/cells/sprites';

export class BedHead extends Cell implements ICellModel {
  constructor(config: SerializedCell) {
    super(config);

    this.type = CellTypes.BedHead;
    this.description = cellsDescriptions[CellTypes.BedHead];
  }

  get display(): string {
    return dungeonFeaturesEnum.BED_HEAD;
  }

  get walkMessage(): string {
    return 'There is a bed here.';
  }
}
