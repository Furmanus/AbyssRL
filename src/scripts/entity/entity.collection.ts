import { Collection } from '../core/collection';
import { Entity } from './controllers/entity';
import { EntityModel } from './models/entity.model';

export class EntityControllerCollection extends Collection<Entity> {
  public getControllerByEntityModel(
    entityModel: EntityModel,
  ): Entity {
    return this.get().find(
      (entity: Entity) => entity.getModel() === entityModel,
    );
  }
}
