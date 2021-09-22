import { Controller } from '../../controller';
import { EntityController } from '../entity_controller';
import { EntityStatuses } from '../../../constants/entity/statuses';

export abstract class EntityStatusCommonController extends Controller {
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
  protected entityController: EntityController;

  public constructor(entity: EntityController) {
    super();

    this.entityController = entity;
  }

  public act(): void {
    this.turnCount++;
  }
}
