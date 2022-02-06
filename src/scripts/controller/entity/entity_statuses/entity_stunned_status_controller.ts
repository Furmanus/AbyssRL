import {
  EntityStatusCommonController,
  EntityStatusCommonSerializedData,
} from './entity_status_common_controller';
import { EntityStatuses } from '../../../constants/entity/statuses';
import { EntityStats } from '../../../constants/entity/monsters';
import { getRandomNumber } from '../../../helper/rng';
import { EntityController } from '../entity_controller';

export interface EntityStunnedStatusSerializedData
  extends EntityStatusCommonSerializedData {
  type?: EntityStatuses.Stunned;
  effectLength?: number;
}

export class EntityStunnedStatusController extends EntityStatusCommonController {
  public type = EntityStatuses.Stunned;
  protected effectLength = getRandomNumber(3, 4);

  public constructor(data: EntityStunnedStatusSerializedData) {
    super(data);

    const { effectLength } = data;

    if (effectLength) {
      this.effectLength = effectLength;
    }

    this.init();
  }

  public act(): void {
    super.act();

    if (this.turnCount > this.effectLength) {
      this.entityController.removeStunnedStatus(this);
    }
  }

  protected init(): void {
    this.entityController.addTemporaryStatsModifiers(
      [
        {
          stat: EntityStats.Strength,
          source: this,
          modifier: {
            modifier: -Math.round(
              this.entityController.getStatsObject()[EntityStats.Strength] / 4,
            ),
            currentCount: 0,
            count: this.effectLength,
          },
        },
        {
          stat: EntityStats.Dexterity,
          source: this,
          modifier: {
            modifier: -Math.round(
              this.entityController.getStatsObject()[EntityStats.Dexterity] / 2,
            ),
            currentCount: 0,
            count: this.effectLength,
          },
        },
        {
          stat: EntityStats.Speed,
          source: this,
          modifier: {
            modifier: -Math.round(
              this.entityController.getStatsObject()[EntityStats.Speed] / 5,
            ),
            currentCount: 0,
            count: this.effectLength,
          },
        },
      ],
      true,
    );
  }

  private increaseStunTurnCount(val: number): void {
    if (val) {
      this.effectLength += val;
    }
  }

  public add(status: EntityStatusCommonController): void {
    if (status instanceof EntityStunnedStatusController) {
      this.increaseStunTurnCount(status.effectLength);
    }
  }

  public getDataToSerialization(): EntityStunnedStatusSerializedData {
    return {
      ...super.getDataToSerialization(),
      type: EntityStatuses.Stunned,
      effectLength: this.effectLength,
    };
  }
}
