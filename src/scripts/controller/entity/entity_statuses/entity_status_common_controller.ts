import { Controller } from '../../controller';
import { EntityController } from '../entity_controller';
import { EntityStatuses } from '../../../constants/entity/statuses';
import {
  EntityStunnedStatusController,
  EntityStunnedStatusSerializedData,
} from './entity_stunned_status_controller';
import {
  EntityBleedingStatusController,
  EntityBleedingStatusSerializedData,
} from './entity_bleeding_status_controller';
import { dungeonState } from '../../../state/application.state';

export type EntityStatusCommonSerializedData = {
  turnCount?: number;
  entityModelId: string;
};

export type AllEntityStatusesSerialized =
  | EntityStunnedStatusSerializedData
  | EntityBleedingStatusSerializedData;

export type AllEntityStatusControllers =
  | EntityBleedingStatusController
  | EntityStunnedStatusController;

export abstract class EntityStatusCommonController extends Controller {
  public abstract type: EntityStatuses;
  /**
   * Inner turn count, used to calculations by status when to trigger some special effects
   * @protected
   */
  protected turnCount = 0;
  /**
   * Entity controller which status own and can affect
   * @protected
   */
  protected entityController: EntityController;

  public constructor(entity: string, entityController?: EntityController);

  public constructor(
    entity: AllEntityStatusesSerialized,
    entityController?: EntityController,
  );

  public constructor(
    entity: string | AllEntityStatusesSerialized,
    entityControllerInstance?: EntityController,
  ) {
    super();
    let entityController: EntityController;

    if (typeof entity === 'string') {
      entityController =
        entityControllerInstance ||
        dungeonState.entityManager.getEntityControllerById(entity);
    } else {
      const { entityModelId, turnCount } = entity;

      if (turnCount) {
        this.turnCount = turnCount;
      }
      entityController =
        entityControllerInstance ||
        dungeonState.entityManager.getEntityControllerById(entityModelId);
    }

    if (entityController) {
      this.entityController = entityController;
    } else {
      throw new Error(`Entity controller ${String(entity)} not found`);
    }
  }

  public act(): void {
    this.turnCount++;
  }

  public abstract add(status: EntityStatusCommonController): void;

  public getDataToSerialization(): EntityStatusCommonSerializedData {
    return {
      turnCount: this.turnCount,
      entityModelId: this.entityController.getModel().id,
    };
  }
}
