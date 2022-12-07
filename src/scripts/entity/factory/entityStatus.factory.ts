import { Entity } from '../entities/entity';
import {
  EntityBleedingStatus,
  EntityBleedingStatusSerializedData,
} from '../entity_statuses/entityBleedingStatus';
import {
  AllEntityStatusControllers,
  AllEntityStatusesSerialized,
} from '../entity_statuses/entityStatusCommon';
import { EntityStatusesCollection } from '../entity_statuses/entityStatuses.collection';
import {
  EntityStunnedStatus,
  EntityStunnedStatusSerializedData,
} from '../entity_statuses/entityStunnedStatus';
import { EntityStatuses } from '../constants/statuses';

export class EntityStatusFactory {
  public static getEntityBleedingStatus(
    data: EntityBleedingStatusSerializedData,
    entityController?: Entity,
  ): EntityBleedingStatus {
    return new EntityBleedingStatus(data, entityController);
  }

  public static getEntityStunnedStatus(
    data: EntityStunnedStatusSerializedData,
    entityController?: Entity,
  ): EntityStunnedStatus {
    return new EntityStunnedStatus(data, entityController);
  }

  public static getCollection(
    entityStatuses: AllEntityStatusControllers[] = [],
  ): EntityStatusesCollection {
    return new EntityStatusesCollection(entityStatuses);
  }

  public static getCollectionFromSerializedData(
    entityStatuses: AllEntityStatusesSerialized[],
    entityController?: Entity,
  ): EntityStatusesCollection {
    const entityStatusControllers = entityStatuses.map((serializedStatus) => {
      switch (serializedStatus.type) {
        case EntityStatuses.Bleeding:
          return EntityStatusFactory.getEntityBleedingStatus(serializedStatus);
        case EntityStatuses.Stunned:
          return EntityStatusFactory.getEntityStunnedStatus(serializedStatus);
        default:
          throw new Error('Entity status not implemented');
      }
    });

    return EntityStatusFactory.getCollection(entityStatusControllers);
  }
}
