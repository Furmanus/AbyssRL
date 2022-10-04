import {
  EntityStatusCommonController,
  EntityStatusCommonSerializedData,
} from './entityStatusCommon.controller';
import { rngService } from '../../utils/rng.service';
import { EntityStatuses } from '../constants/statuses';
import { EntityStats } from '../constants/monsters';
import { EntityController } from '../controllers/entity.controller';

export interface EntityBleedingStatusSerializedData
  extends EntityStatusCommonSerializedData {
  type?: EntityStatuses.Bleeding;
  maxBleedingCount?: number;
  bleedingCount?: number;
  weaknessCount?: number;
  weaknessTurnStart?: number;
}

export class EntityBleedingStatusController extends EntityStatusCommonController {
  public type = EntityStatuses.Bleeding;
  private maxBleedingCount = rngService.getRandomNumber(3, 12);
  private bleedingCount = 0;
  private weaknessCount = 0;
  private weaknessTurnStart = rngService.getRandomNumber(10, 15);

  public constructor(
    data: EntityBleedingStatusSerializedData,
    entityController?: EntityController,
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

  public add(status: EntityStatusCommonController): void {
    if (status instanceof EntityBleedingStatusController) {
      this.increaseMaxBleedingCount(status.getMaxBleedingCount());
      this.entityController.increaseBloodLoss();
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
