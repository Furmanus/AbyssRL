import {
  EntityStatusCommon,
  EntityStatusCommonSerializedData,
} from './entityStatusCommon';
import { EntityStatuses } from '../constants/statuses';
import { EntityStats } from '../constants/monsters';
import { rngService } from '../../utils/rng.service';
import { Entity } from '../entities/entity';

export interface EntityStunnedStatusSerializedData
  extends EntityStatusCommonSerializedData {
  type?: EntityStatuses.Stunned;
  effectLength?: number;
}

export class EntityStunnedStatus extends EntityStatusCommon {
  public type = EntityStatuses.Stunned;
  protected effectLength = rngService.getRandomNumber(3, 4);

  public constructor(
    data: EntityStunnedStatusSerializedData,
    entityInstance?: Entity,
  ) {
    super(data, entityInstance);

    const { effectLength } = data;

    if (effectLength) {
      this.effectLength = effectLength;
    }

    this.init();
  }

  public act(): void {
    super.act();

    if (this.turnCount > this.effectLength) {
      this.entityInstance.removeStunnedStatus(this);
    }
  }

  protected init(): void {
    this.entityInstance.addTemporaryStatsModifiers(
      [
        {
          stat: EntityStats.Strength,
          source: this,
          modifier: {
            modifier: -Math.round(
              this.entityInstance.getStatsObject()[EntityStats.Strength] / 4,
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
              this.entityInstance.getStatsObject()[EntityStats.Dexterity] / 2,
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
              this.entityInstance.getStatsObject()[EntityStats.Speed] / 5,
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

  public add(status: EntityStatusCommon): void {
    if (status instanceof EntityStunnedStatus) {
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
