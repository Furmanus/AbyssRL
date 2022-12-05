import { EntityModel } from '../entity/models/entity.model';
import { Entity } from '../entity/controllers/entity';

class EntityRegistry {
  private registry: WeakMap<EntityModel, Entity> = new WeakMap<
    EntityModel,
    Entity
  >();

  public addEntry(model: EntityModel, controller: Entity): void {
    this.registry.set(model, controller);
  }

  public getControllerByModel(model: EntityModel): Entity {
    return this.registry.get(model);
  }
}

export const entityRegistry = new EntityRegistry();
