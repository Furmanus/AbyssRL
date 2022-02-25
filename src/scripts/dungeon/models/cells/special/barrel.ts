import { Cell, SerializedCell } from '../cell_model';
import { CellTypes } from '../../../constants/cellTypes.constants';
import { cellsDescriptions } from '../../../constants/cellsDescriptions.constants';
import { dungeonFeaturesEnum } from '../../../constants/sprites.constants';
import { ICellModel } from '../../../interfaces/cell';
import { ItemModel } from '../../../../items/models/item.model';
import { EntityController } from '../../../../entity/controllers/entity.controller';
import { UseEffectResult } from '../effects/use_effect_result';
import { MonstersTypes } from '../../../../entity/constants/monsters';
import { isPlayerController } from '../../../../interfaces/type_guards';
import { ItemsCollection } from '../../../../items/items_collection';

export class BarrelModel extends Cell implements ICellModel {
  constructor(config: SerializedCell) {
    super(config);

    this.type = CellTypes.Barrel;
    this.description = cellsDescriptions[CellTypes.Barrel];
  }

  get display(): string {
    return dungeonFeaturesEnum.BARREL;
  }

  get blockMovement(): boolean {
    return true;
  }

  public useEffect(entity: EntityController): UseEffectResult {
    if (isPlayerController(entity)) {
      entity.openContainer(this.containerInventory);
    }

    return new UseEffectResult(false, '');
  }
}
