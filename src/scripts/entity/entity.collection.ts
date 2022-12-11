import { Collection } from '../core/collection';
import { Entity } from './entities/entity';
import { EntityModel } from './models/entity.model';

export class EntityCollection extends Collection<Entity> {
  public getControllerByEntityModel(
    entityModel: EntityModel,
  ): Entity {
    return this.get().find(
      (entity: Entity) => entity.getModel() === entityModel,
    );
  }
}
