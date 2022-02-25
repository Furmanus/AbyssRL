import { Collection } from '../../core/collection';
import {
  AllEntityStatusControllers,
  AllEntityStatusesSerialized,
  EntityStatusCommonController,
} from './entityStatusCommon.controller';
import { EntityStatuses } from '../constants/statuses';
import { EntityStunnedStatusController } from './entityStunnedStatus.controller';
import { EntityBleedingStatusController } from './entityBleedingStatus.controller';

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
