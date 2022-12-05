import { BaseController } from '../../core/base.controller';
import { Entity } from '../controllers/entity';
import { EntityStatuses } from '../constants/statuses';
import {
  EntityStunnedStatusController,
  EntityStunnedStatusSerializedData,
} from './entityStunnedStatus.controller';
import {
  EntityBleedingStatusController,
  EntityBleedingStatusSerializedData,
} from './entityBleedingStatus.controller';
import { dungeonState } from '../../state/application.state';

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

export abstract class EntityStatusCommonController extends BaseController {
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
  protected entityController: Entity;

  public constructor(entity: string, entityController?: Entity);

  public constructor(
    entity: AllEntityStatusesSerialized,
    entityController?: Entity,
  );

  public constructor(
    entity: string | AllEntityStatusesSerialized,
    entityControllerInstance?: Entity,
  ) {
    super();
    let entityController: Entity;

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
