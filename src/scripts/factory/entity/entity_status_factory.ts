import { EntityController } from '../../controller/entity/entity_controller';
import { EntityBleedingStatusController } from '../../controller/entity/entity_statuses/entity_bleeding_status_controller';
import { EntityStatusCommonController } from '../../controller/entity/entity_statuses/entity_status_common_controller';
import { EntityStatusesCollection } from '../../collections/entity_statuses_collection';
import { EntityStunnedStatusController } from '../../controller/entity/entity_statuses/entity_stunned_status_controller';

export class EntityStatusFactory {
  public static getEntityBleedingStatus(
    entityController: EntityController,
  ): EntityBleedingStatusController {
    return new EntityBleedingStatusController(entityController);
  }

  public static getEntityStunnedStatus(
    entityController: EntityController,
  ): EntityStunnedStatusController {
    return new EntityStunnedStatusController(entityController);
  }

  public static getCollection(
    entityStatuses?: EntityStatusCommonController[],
  ): EntityStatusesCollection {
    return new EntityStatusesCollection(entityStatuses);
  }
}
