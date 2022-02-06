import { Collection } from './collection';
import {
  AllEntityStatusControllers,
  AllEntityStatusesSerialized,
  EntityStatusCommonController,
} from '../controller/entity/entity_statuses/entity_status_common_controller';
import { EntityStatuses } from '../constants/entity/statuses';
import { EntityStunnedStatusController } from '../controller/entity/entity_statuses/entity_stunned_status_controller';
import { EntityBleedingStatusController } from '../controller/entity/entity_statuses/entity_bleeding_status_controller';

export class EntityStatusesCollection extends Collection<EntityStatusCommonController> {
  public addStatus(status: EntityStatusCommonController): this {
    const currentStatusOfSameType = this.getStatus(status);

    if (currentStatusOfSameType) {
      currentStatusOfSameType.add(status);

      return this;
    } else {
      return this.add(status);
    }
  }

  public removeStatus(
    status: EntityStatusCommonController,
  ): EntityStatusCommonController;

  public removeStatus(status: EntityStatuses): EntityStatusCommonController;
  public removeStatus(
    status: EntityStatuses | EntityStatusCommonController,
  ): EntityStatusCommonController {
    const entityStatus: EntityStatuses =
      status instanceof EntityStatusCommonController ? status.type : status;
    const statusToRemove = this.getStatus(entityStatus);

    if (statusToRemove) {
      return this.remove(statusToRemove);
    }
  }

  public getStatus(
    status: EntityStatusCommonController,
  ): EntityStatusCommonController;

  public getStatus(status: EntityStatuses): EntityStatusCommonController;
  public getStatus(
    status: EntityStatuses | EntityStatusCommonController,
  ): EntityStatusCommonController {
    const entityStatus: EntityStatuses =
      status instanceof EntityStatusCommonController ? status.type : status;

    return this.get().find(
      (statusController) => statusController.type === entityStatus,
    );
  }

  public getDataToSerialization(): AllEntityStatusesSerialized[] {
    return this.get().map((status: AllEntityStatusControllers) =>
      status.getDataToSerialization(),
    );
  }
}
