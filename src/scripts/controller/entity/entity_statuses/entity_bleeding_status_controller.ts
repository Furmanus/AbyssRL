import { EntityStatusCommonController } from './entity_status_common_controller';
import { getRandomNumber } from '../../../helper/rng';
import { EntityStatuses } from '../../../constants/entity/statuses';
import { EntityStats } from '../../../constants/entity/monsters';

export class EntityBleedingStatusController extends EntityStatusCommonController {
  public type = EntityStatuses.Bleeding;
  private maxBleedingCount = getRandomNumber(3, 12);
  private bleedingCount = 0;
  private weaknessCount = 0;
  private weaknessTurnStart = getRandomNumber(10, 15);

  public act() {
    super.act();

    if (++this.bleedingCount > this.maxBleedingCount) {
      this.entityController.stopBleeding(this);
    } else {
      this.entityController.inflictNonCombatHit(1, EntityStatuses.Bleeding);
      this.entityController.dropBlood();

      if (this.bleedingCount > this.weaknessTurnStart) {
        this.entityController.addTemporaryStatsModifiers([
          {
            stat: EntityStats.Strength,
            source: this,
            modifier: {
              modifier: -1,
              count: getRandomNumber(50, 80),
              currentCount: 0,
            },
          },
        ]);

        this.weaknessTurnStart = Infinity;
      }
    }
  }
}
