import { EntityController } from '../controllers/entity.controller';
import {
  EntityBleedingStatusController,
  EntityBleedingStatusSerializedData,
} from '../entity_statuses/entityBleedingStatus.controller';
import {
  AllEntityStatusControllers,
  AllEntityStatusesSerialized,
  EntityStatusCommonController,
} from '../entity_statuses/entityStatusCommon.controller';
import { EntityStatusesCollection } from '../entity_statuses/entityStatuses.collection';
import {
  EntityStunnedStatusController,
  EntityStunnedStatusSerializedData,
} from '../entity_statuses/entityStunnedStatus.controller';
import { EntityStatuses } from '../constants/statuses';

export class EntityStatusFactory {
  public static getEntityBleedingStatus(
    data: EntityBleedingStatusSerializedData,
    entityController?: EntityController,
  ): EntityBleedingStatusController {
    return new EntityBleedingStatusController(data, entityController);
  }

  public static getEntityStunnedStatus(
    data: EntityStunnedStatusSerializedData,
    entityController?: EntityController,
  ): EntityStunnedStatusController {
    return new EntityStunnedStatusController(data, entityController);
  }

  public static getCollection(
    entityStatuses: AllEntityStatusControllers[] = [],
  ): EntityStatusesCollection {
    return new EntityStatusesCollection(entityStatuses);
  }

  public static getCollectionFromSerializedData(
    entityStatuses: AllEntityStatusesSerialized[],
    entityController?: EntityController,
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
