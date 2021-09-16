import { Cell } from '../cell_model';
import { ICellModel } from '../../../../interfaces/cell';
import { cellTypes } from '../../../../constants/cell_types';
import { cellsDescriptions } from '../../../../helper/cells_description';
import { dungeonFeaturesEnum } from '../../../../constants/sprites';
import { ItemsCollection } from '../../../../collections/items_collection';
import { EntityController } from '../../../../controller/entity/entity_controller';
import { UseEffectResult } from '../effects/use_effect_result';
import { isPlayerController } from '../../../../interfaces/type_guards';

export class ChestOfDrawersModel extends Cell implements ICellModel {
  public containerInventory = new ItemsCollection();

  constructor(x: number, y: number) {
    super(x, y);

    this.type = cellTypes.CHEST_OF_DRAWERS;
    this.description = cellsDescriptions[cellTypes.CHEST_OF_DRAWERS];
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
