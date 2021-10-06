import { EntityController } from '../../controller/entity/entity_controller';
import { EntityControllerCollection } from '../../collections/entity_collection';

export class EntityFactory {
  public static getEntityControllerollection(
    entities?: EntityController[],
  ): EntityControllerCollection {
    return new EntityControllerCollection(entities || []);
  }
}
