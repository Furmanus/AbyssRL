import { INaturalWeapon } from '../../../combat/combat.interfaces';
import { Dice } from '../../../position/dice';
import { DamageTypes } from '../../../combat/combat.constants';
import { MonsterAttackTypes } from '../../../entity/constants/monsters';
import { IAnyObject } from '../../../interfaces/common';
import { WearableModel } from '../wearable.model';
import { EntityModel } from '../../../entity/models/entity.model';
import { ItemTypes } from '../../constants/itemTypes.constants';
import { WeaponCriticalDamageType } from '../../constants/weapons.constants';
import { SerializedWeapon } from './weapon.model';

export interface SerializedNaturalWeapon {
  itemType: ItemTypes.NaturalWeapon;
  naturalType: MonsterAttackTypes;
  damage: string;
  toHit: string;
  name: string;
  type: DamageTypes;
  criticalHitRate?: number;
  criticalDamageType: WeaponCriticalDamageType[];
}

export class NaturalWeaponModel extends WearableModel {
  public itemType: ItemTypes.NaturalWeapon = ItemTypes.NaturalWeapon;
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
    return `${this.description} (${this.damage.getDataToSerialization()}, ${
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
      itemType: this.itemType,
      damage: this.damage.getDataToSerialization(),
      toHit: this.toHit.getDataToSerialization(),
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
