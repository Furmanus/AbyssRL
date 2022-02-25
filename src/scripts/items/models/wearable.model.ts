import { ItemModel } from './item.model';
import { EntityModel } from '../../entity/models/entity.model';

export abstract class WearableModel extends ItemModel {
  public wear(entity: EntityModel): void {
    // placeholder
  }

  public takeoff(entity: EntityModel): void {
    // placeholder
  }
}
