import { INaturalWeapon } from '../../../interfaces/combat';
import { Dice } from '../../dice';
import { DamageTypes } from '../../../constants/combat_enums';
import { MonsterAttackTypes } from '../../../constants/entity/monsters';
import { IAnyObject } from '../../../interfaces/common';
import { WearableModel } from '../wearable_model';
import { EntityModel } from '../../entity/entity_model';
import { ItemTypes } from '../../../constants/items/item';
import { WeaponCriticalDamageType } from '../../../constants/items/weapons';
import { SerializedWeapon } from './weapon_model';

export interface SerializedNaturalWeapon extends SerializedWeapon {
  naturalType: MonsterAttackTypes;
}

export class NaturalWeaponModel extends WearableModel {
  public itemType: ItemTypes = ItemTypes.NaturalWeapon;
  public damage: Dice;
  public toHit: Dice;
  public type: DamageTypes;
  public name: string = null;
  public display: string = null;
  public naturalType: MonsterAttackTypes;
  public criticalHitRate = 0;
  public criticalDamageType: WeaponCriticalDamageType[];

  get description(): string {
    return this.naturalType;
  }

  public get fullDescription(): string {
    return `${this.description} (${this.damage.getSerializedData()}, ${
      this.type
    })`;
  }

  public constructor(config: SerializedNaturalWeapon) {
    super();
    const {
      damage,
      toHit,
      criticalDamageType,
      naturalType,
      type,
      name,
      criticalHitRate,
    } = config;

    if (typeof damage === 'string') {
      this.damage = new Dice(damage);
    } else {
      this.damage = damage;
    }
    if (typeof toHit === 'string') {
      this.toHit = new Dice(toHit);
    } else {
      this.toHit = toHit;
    }
    this.type = type;
    this.naturalType = naturalType;
    this.criticalDamageType = criticalDamageType;
    this.name = name;
  }

  /**
   * Returns serialized model data.
   * @returns  Serialized natural weapon model data
   */
  public getDataToSerialization(): SerializedNaturalWeapon {
    return {
      damage: this.damage.getSerializedData(),
      toHit: this.toHit.getSerializedData(),
      type: this.type,
      name: this.name,
      naturalType: this.naturalType,
      criticalHitRate: this.criticalHitRate,
      criticalDamageType: this.criticalDamageType,
    };
  }

  public wear(entity: EntityModel): never {
    throw new Error("Can't wear natural weapon");
  }

  public takeoff(entity: EntityModel): never {
    throw new Error("Can't take off natural weapon");
  }

  public drop(entity: EntityModel): never {
    throw new Error("Can't drop natural weapon");
  }

  public pickup(entity: EntityModel): never {
    throw new Error("Can't pick up natural weapon");
  }
}
