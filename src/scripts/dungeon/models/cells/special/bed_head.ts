import { Cell, SerializedCell } from '../cell_model';
import { ICellModel } from '../../../interfaces/cell';
import { CellTypes } from '../../../constants/cellTypes.constants';
import { cellsDescriptions } from '../../../constants/cellsDescriptions.constants';
import { dungeonFeaturesEnum } from '../../../constants/sprites.constants';

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
