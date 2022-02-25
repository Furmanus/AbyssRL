import { Cell, SerializedCell } from './cell_model';
import { CellTypes } from '../../constants/cellTypes.constants';
import { cellsDescriptions } from '../../constants/cellsDescriptions.constants';
import { terrain } from '../../constants/sprites.constants';
import { ICellModel } from '../../interfaces/cell';

export class TreeModel extends Cell implements ICellModel {
  constructor(config: SerializedCell) {
    super(config);

    this.confirmMovement = false;
    this.type = CellTypes.Tree;
    this.description = cellsDescriptions[CellTypes.Tree];
  }

  get blockMovement(): boolean {
    return true;
  }

  get display(): string {
    return terrain.TREE;
  }
}
