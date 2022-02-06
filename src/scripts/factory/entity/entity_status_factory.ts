import { EntityController } from '../../controller/entity/entity_controller';
import {
  EntityBleedingStatusController,
  EntityBleedingStatusSerializedData,
} from '../../controller/entity/entity_statuses/entity_bleeding_status_controller';
import {
  AllEntityStatusControllers,
  AllEntityStatusesSerialized,
  EntityStatusCommonController,
} from '../../controller/entity/entity_statuses/entity_status_common_controller';
import { EntityStatusesCollection } from '../../collections/entity_statuses_collection';
import {
  EntityStunnedStatusController,
  EntityStunnedStatusSerializedData,
} from '../../controller/entity/entity_statuses/entity_stunned_status_controller';
import { EntityStatuses } from '../../constants/entity/statuses';

export class EntityStatusFactory {
  public static getEntityBleedingStatus(
    data: EntityBleedingStatusSerializedData,
  ): EntityBleedingStatusController {
    return new EntityBleedingStatusController(data);
  }

  public static getEntityStunnedStatus(
    data: EntityStunnedStatusSerializedData,
  ): EntityStunnedStatusController {
    return new EntityStunnedStatusController(data);
  }

  public static getCollection(
    entityStatuses: AllEntityStatusControllers[] = [],
  ): EntityStatusesCollection {
    return new EntityStatusesCollection(entityStatuses);
  }

  public static getCollectionFromSerializedData(
    entityStatuses: AllEntityStatusesSerialized[],
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
