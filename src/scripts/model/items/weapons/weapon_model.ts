import { WearableModel } from '../wearable_model';
import { Dice } from '../../dice';
import { ItemSprites } from '../../../constants/cells/sprites';
import { ItemTypes } from '../../../constants/items/item';
import { DamageTypes } from '../../../constants/combat_enums';
import { WeaponCriticalDamageType } from '../../../constants/items/weapons';

export interface SerializedWeapon {
  damage: string;
  toHit: string;
  name: string;
  type: DamageTypes;
  criticalHitRate?: number;
  criticalDamageType: WeaponCriticalDamageType[];
}

export class WeaponModel extends WearableModel {
  public itemType: ItemTypes = ItemTypes.Weapon;
  public damage: Dice;
  public toHit: Dice;
  public readonly type: DamageTypes;
  public readonly name: string;
  public display: string;
  public criticalHitRate;
  public criticalDamageType: WeaponCriticalDamageType[];

  get description(): string {
    return this.name;
  }

  public get fullDescription(): string {
    return `${this.description} (${this.damage.getSerializedData()}, ${
      this.type
    })`;
  }

  public constructor(config: SerializedWeapon) {
    super();

    const { damage, toHit, name, type, criticalDamageType, criticalHitRate } =
      config;

    this.damage = new Dice(damage);
    this.toHit = new Dice(toHit);
    this.type = type;
    this.name = name;
    this.display = ItemSprites.WEAPON;
    this.criticalHitRate = criticalHitRate || 0;
    this.criticalDamageType = criticalDamageType;
  }

  /**
   * Returns serialized model data.
   * @returns  Serialized natural weapon model data
   */
  public getDataToSerialization(): SerializedWeapon {
    return {
      damage: this.damage.getSerializedData(),
      toHit: this.toHit.getSerializedData(),
      type: this.type,
      name: this.name,
      criticalHitRate: this.criticalHitRate,
      criticalDamageType: this.criticalDamageType,
    };
  }
}
