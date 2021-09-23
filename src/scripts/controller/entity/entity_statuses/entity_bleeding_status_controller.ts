import { EntityStatusCommonController } from './entity_status_common_controller';
import { getRandomNumber } from '../../../helper/rng';
import { EntityStatuses } from '../../../constants/entity/statuses';

export class EntityBleedingStatusController extends EntityStatusCommonController {
  public type = EntityStatuses.Bleeding;
  private maxBleedingCount = getRandomNumber(3, 12);
  private bleedingCount = 0;

  public act() {
    super.act();

    if (++this.bleedingCount > this.maxBleedingCount) {
      this.entityController.stopBleeding(this);
    } else {
      this.entityController.inflictNonCombatHit(1, EntityStatuses.Bleeding);
      this.entityController.dropBlood();
    }
  }
}
