import { ItemModel } from './item_model';
import { EntityModel } from '../entity/entity_model';

export abstract class WearableModel extends ItemModel {
  public wear(entity: EntityModel): void {
    // placeholder
  }

  public takeoff(entity: EntityModel): void {
    // placeholder
  }
}
