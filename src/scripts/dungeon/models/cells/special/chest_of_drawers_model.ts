import { Cell, SerializedCell } from '../cell_model';
import { ICellModel } from '../../../interfaces/cell';
import { CellTypes } from '../../../constants/cellTypes.constants';
import { cellsDescriptions } from '../../../constants/cellsDescriptions.constants';
import { dungeonFeaturesEnum } from '../../../constants/sprites.constants';
import { Entity } from '../../../../entity/controllers/entity';
import { UseEffectResult } from '../effects/use_effect_result';
import { isPlayerController } from '../../../../interfaces/type_guards';

export class ChestOfDrawersModel extends Cell implements ICellModel {
  public get isContainer(): boolean {
    return true;
  }

  constructor(config: SerializedCell) {
    super(config);

    this.type = CellTypes.ChestOfDrawers;
    this.description = cellsDescriptions[CellTypes.ChestOfDrawers];
  }

  get display(): string {
    return dungeonFeaturesEnum.CHEST_OF_DRAWERS;
  }

  get blockMovement(): boolean {
    return true;
  }

  public useEffect(entity: Entity): UseEffectResult {
    if (isPlayerController(entity)) {
      entity.openContainer(this);
    }

    return new UseEffectResult(false, '');
  }
}
