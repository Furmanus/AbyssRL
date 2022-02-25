import { EntityModel } from '../entity/models/entity.model';
import { EntityController } from '../entity/controllers/entity.controller';

class EntityRegistry {
  private registry: WeakMap<EntityModel, EntityController> = new WeakMap<
    EntityModel,
    EntityController
  >();

  public addEntry(model: EntityModel, controller: EntityController): void {
    this.registry.set(model, controller);
  }

  public getControllerByModel(model: EntityModel): EntityController {
    return this.registry.get(model);
  }
}

export const entityRegistry = new EntityRegistry();
