import {
  EntityStatusCommon,
  EntityStatusCommonSerializedData,
} from './entityStatusCommon';
import { rngService } from '../../utils/rng.service';
import { EntityStatuses } from '../constants/statuses';
import { EntityStats } from '../constants/monsters';
import { Entity } from '../entities/entity';

export interface EntityBleedingStatusSerializedData
  extends EntityStatusCommonSerializedData {
  type?: EntityStatuses.Bleeding;
  maxBleedingCount?: number;
  bleedingCount?: number;
  weaknessCount?: number;
  weaknessTurnStart?: number;
}

export class EntityBleedingStatus extends EntityStatusCommon {
  public type = EntityStatuses.Bleeding;
  private maxBleedingCount = rngService.getRandomNumber(3, 12);
  private bleedingCount = 0;
  private weaknessCount = 0;
  private weaknessTurnStart = rngService.getRandomNumber(10, 15);

  public constructor(
    data: EntityBleedingStatusSerializedData,
    entityController?: Entity,
  ) {
    super(data, entityController);

    const {
      weaknessCount,
      weaknessTurnStart,
      maxBleedingCount,
      bleedingCount,
    } = data;

    if (
      weaknessCount ||
      weaknessTurnStart ||
      maxBleedingCount ||
      bleedingCount
    ) {
      this.bleedingCount = bleedingCount;
      this.maxBleedingCount = maxBleedingCount;
      this.weaknessCount = weaknessCount;
      this.weaknessTurnStart = weaknessTurnStart;
    }
  }

  public act() {
    super.act();

    if (++this.bleedingCount > this.maxBleedingCount) {
      this.entityInstance.stopBleeding(this);
    } else {
      this.entityInstance.inflictNonCombatHit(1, EntityStatuses.Bleeding);
      this.entityInstance.dropBlood();

      if (this.bleedingCount > this.weaknessTurnStart) {
        this.entityInstance.addTemporaryStatsModifiers([
          {
            stat: EntityStats.Strength,
            source: this,
            modifier: {
              modifier: -1,
              count: rngService.getRandomNumber(50, 80),
              currentCount: 0,
            },
          },
        ]);

        this.weaknessTurnStart = Infinity;
      }
    }
  }

  public getMaxBleedingCount(): number {
    return this.maxBleedingCount;
  }

  public increaseMaxBleedingCount(val: number): void {
    this.maxBleedingCount += val;
  }

  public add(status: EntityStatusCommon): void {
    if (status instanceof EntityBleedingStatus) {
      this.increaseMaxBleedingCount(status.getMaxBleedingCount());
      this.entityInstance.increaseBloodLoss();
    }
  }

  public getDataToSerialization(): EntityBleedingStatusSerializedData {
    return {
      ...super.getDataToSerialization(),
      type: EntityStatuses.Bleeding,
      bleedingCount: this.bleedingCount,
      maxBleedingCount: this.maxBleedingCount,
      weaknessCount: this.weaknessCount,
      weaknessTurnStart: this.weaknessTurnStart,
    };
  }
}
