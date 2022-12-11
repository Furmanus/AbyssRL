import { Collection } from '../../core/collection';
import {
  AllEntityStatusControllers,
  AllEntityStatusesSerialized,
  EntityStatusCommon,
} from './entityStatusCommon';
import { EntityStatuses } from '../constants/statuses';

export class EntityStatusesCollection extends Collection<EntityStatusCommon> {
  public addStatus(status: EntityStatusCommon): this {
    const currentStatusOfSameType = this.getStatus(status);

    if (currentStatusOfSameType) {
      currentStatusOfSameType.add(status);

      return this;
    } else {
      return this.add(status);
    }
  }

  public removeStatus(
    status: EntityStatusCommon,
  ): EntityStatusCommon;

  public removeStatus(status: EntityStatuses): EntityStatusCommon;
  public removeStatus(
    status: EntityStatuses | EntityStatusCommon,
  ): EntityStatusCommon {
    const entityStatus: EntityStatuses =
      status instanceof EntityStatusCommon ? status.type : status;
    const statusToRemove = this.getStatus(entityStatus);

    if (statusToRemove) {
      return this.remove(statusToRemove);
    }
  }

  public getStatus(
    status: EntityStatusCommon,
  ): EntityStatusCommon;

  public getStatus(status: EntityStatuses): EntityStatusCommon;
  public getStatus(
    status: EntityStatuses | EntityStatusCommon,
  ): EntityStatusCommon {
    const entityStatus: EntityStatuses =
      status instanceof EntityStatusCommon ? status.type : status;

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
