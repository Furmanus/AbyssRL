import { WearableModel } from '../wearable.model';
import { Dice } from '../../../position/dice';
import { ItemSprites } from '../../../dungeon/constants/sprites.constants';
import { ItemTypes } from '../../constants/itemTypes.constants';
import { DamageTypes } from '../../../combat/combat.constants';
import { WeaponCriticalDamageType } from '../../constants/weapons.constants';

export interface SerializedWeapon {
  id: string;
  itemType: ItemTypes.Weapon;
  damage: string;
  toHit: string;
  name: string;
  type: DamageTypes;
  criticalHitRate?: number;
  criticalDamageType: WeaponCriticalDamageType[];
}

export class WeaponModel extends WearableModel {
  public itemType: ItemTypes.Weapon = ItemTypes.Weapon;
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
    return `${this.description} (${this.damage.getDataToSerialization()}, ${
      this.type
    })`;
  }

  public constructor(config: SerializedWeapon) {
    super(config);

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
      ...super.serialize(),
      damage: this.damage.getDataToSerialization(),
      toHit: this.toHit.getDataToSerialization(),
      type: this.type,
      name: this.name,
      criticalHitRate: this.criticalHitRate,
      criticalDamageType: this.criticalDamageType,
      itemType: this.itemType,
    };
  }
}
