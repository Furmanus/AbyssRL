import { Cell } from '../cell_model';
import { cellTypes } from '../../../../constants/cells/cell_types';
import { cellsDescriptions } from '../../../../helper/cells_description';
import { dungeonFeaturesEnum } from '../../../../constants/cells/sprites';
import { ICellModel } from '../../../../interfaces/cell';
import { ItemModel } from '../../../items/item_model';
import { EntityController } from '../../../../controller/entity/entity_controller';
import { UseEffectResult } from '../effects/use_effect_result';
import { MonstersTypes } from '../../../../constants/entity/monsters';
import { isPlayerController } from '../../../../interfaces/type_guards';
import { ItemsCollection } from '../../../../collections/items_collection';

export class BarrelModel extends Cell implements ICellModel {
  public containerInventory = new ItemsCollection();

  constructor(x: number, y: number) {
    super(x, y);

    this.type = cellTypes.BARREL;
    this.description = cellsDescriptions[cellTypes.BARREL];
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
