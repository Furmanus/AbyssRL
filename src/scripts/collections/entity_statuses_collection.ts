import { Collection } from './collection';
import { EntityStatusCommonController } from '../controller/entity/entity_statuses/entity_status_common_controller';
import { EntityStatuses } from '../constants/entity/statuses';

export class EntityStatusesCollection extends Collection<EntityStatusCommonController> {
  public addStatus(status: EntityStatusCommonController): this {
    if (!this.getStatus(status)) {
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
}
