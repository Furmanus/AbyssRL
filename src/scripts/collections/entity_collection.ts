import { Collection } from './collection';
import { EntityController } from '../controller/entity/entity_controller';
import { EntityModel } from '../model/entity/entity_model';
import { EntityEvents } from '../constants/entity_events';

export class EntityControllerCollection extends Collection<EntityController> {
  public add(entityController: EntityController[]): this;
  public add(entityController: EntityController): this;
  public add(entityController: EntityController | EntityController[]): this {
    const entity = Array.isArray(entityController)
      ? entityController[0]
      : entityController;

    if (entity) {
      super.add(entity);

      entity.on(this, EntityEvents.EntityMove, this.onEntityMove);
    }

    return this;
  }

  public remove(entityController: EntityController): EntityController {
    const removedEntity = super.remove(entityController);

    if (removedEntity) {
      removedEntity.off(this, EntityEvents.EntityMove);

      return removedEntity;
    }
  }

  public getControllerByEntityModel(
    entityModel: EntityModel,
  ): EntityController {
    return this.get().find(
      (entity: EntityController) => entity.getModel() === entityModel,
    );
  }

  private onEntityMove(entityController: EntityController): void {
    this.notify(EntityEvents.EntityMove, entityController);
  }
}
