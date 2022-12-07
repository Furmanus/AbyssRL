import { Entity } from '../entities/entity';
import { EntityStatuses } from '../constants/statuses';
import {
  EntityStunnedStatus,
  EntityStunnedStatusSerializedData,
} from './entityStunnedStatus';
import {
  EntityBleedingStatus,
  EntityBleedingStatusSerializedData,
} from './entityBleedingStatus';
import { dungeonState } from '../../state/application.state';

export type EntityStatusCommonSerializedData = {
  turnCount?: number;
  entityModelId: string;
};

export type AllEntityStatusesSerialized =
  | EntityStunnedStatusSerializedData
  | EntityBleedingStatusSerializedData;

export type AllEntityStatusControllers =
  | EntityBleedingStatus
  | EntityStunnedStatus;

export abstract class EntityStatusCommon {
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
  protected entityInstance: Entity;

  public constructor(entity: string, entityInstance?: Entity);

  public constructor(
    entity: AllEntityStatusesSerialized,
    entityInstance?: Entity,
  );

  public constructor(
    entity: string | AllEntityStatusesSerialized,
    entityInstance?: Entity,
  ) {
    let instance: Entity;

    if (typeof entity === 'string') {
      instance =
      entityInstance ||
        dungeonState.entityManager.getEntityControllerById(entity);
    } else {
      const { entityModelId, turnCount } = entity;

      if (turnCount) {
        this.turnCount = turnCount;
      }
      instance =
      entityInstance ||
        dungeonState.entityManager.getEntityControllerById(entityModelId);
    }

    if (instance) {
      this.entityInstance = instance;
    } else {
      throw new Error(`Entity controller ${String(entity)} not found`);
    }
  }

  public act(): void {
    this.turnCount++;
  }

  public abstract add(status: EntityStatusCommon): void;

  public getDataToSerialization(): EntityStatusCommonSerializedData {
    return {
      turnCount: this.turnCount,
      entityModelId: this.entityInstance.getModel().id,
    };
  }
}
