import { Cell, SerializedCell } from '../cell_model';
import { ICellModel } from '../../../../interfaces/cell';
import { CellTypes } from '../../../../constants/cells/cell_types';
import { cellsDescriptions } from '../../../../helper/cells_description';
import { dungeonFeaturesEnum } from '../../../../constants/cells/sprites';

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
