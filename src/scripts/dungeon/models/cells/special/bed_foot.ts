import { Cell, SerializedCell } from '../cell_model';
import { ICellModel } from '../../../interfaces/cell';
import { CellTypes } from '../../../constants/cellTypes.constants';
import { cellsDescriptions } from '../../../constants/cellsDescriptions.constants';
import { dungeonFeaturesEnum } from '../../../constants/sprites.constants';

export class BedFoot extends Cell implements ICellModel {
  constructor(config: SerializedCell) {
    super(config);

    this.type = CellTypes.BedFoot;
    this.description = cellsDescriptions[CellTypes.BedFoot];
  }

  get display(): string {
    return dungeonFeaturesEnum.BED_FOOT;
  }
}
