import { Cell, SerializedCell } from '../cell_model';
import { ICellModel } from '../../../../interfaces/cell';
import { CellTypes } from '../../../../constants/cells/cell_types';
import { cellsDescriptions } from '../../../../helper/cells_description';
import { dungeonFeaturesEnum } from '../../../../constants/cells/sprites';
import { ItemsCollection } from '../../../../collections/items_collection';
import { EntityController } from '../../../../controller/entity/entity_controller';
import { UseEffectResult } from '../effects/use_effect_result';
import { isPlayerController } from '../../../../interfaces/type_guards';

export class ChestOfDrawersModel extends Cell implements ICellModel {
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

  public useEffect(entity: EntityController): UseEffectResult {
    if (isPlayerController(entity)) {
      entity.openContainer(this.containerInventory);
    }

    return new UseEffectResult(false, '');
  }
}
