import { WearableModel } from '../wearable_model';
import { Dice } from '../../dice';
import { ItemSprites } from '../../../constants/cells/sprites';
import { ItemTypes } from '../../../constants/items/item';
import { DamageTypes } from '../../../constants/combat_enums';
import { WeaponCriticalDamageType } from '../../../constants/items/weapons';
import { IWeaponConfigObject } from './data/weapons';

export class WeaponModel extends WearableModel {
  public damage: Dice;
  public toHit: Dice;
  public readonly type: DamageTypes;
  public readonly naturalType: string;
  public readonly name: string;
  public display: string;
  public itemType: ItemTypes = ItemTypes.Weapon;
  public criticalHitRate = 0;
  public criticalDamageType: WeaponCriticalDamageType[];

  get description(): string {
    return this.name;
  }

  public get fullDescription(): string {
    return `${this.description} (${this.damage.getSerializedData()}, ${
      this.type
    })`;
  }

  // TODO Think how to solve passing more specific config object type?
  public constructor(config: IWeaponConfigObject) {
    super();
    const { damage, toHit, name, type, criticalDamageType } = config;

    this.damage = new Dice(damage);
    this.toHit = new Dice(toHit);
    this.type = type;
    this.name = name;
    this.display = ItemSprites.WEAPON;
    this.criticalDamageType = criticalDamageType;
  }

  /**
   * Returns serialized model data.
   * @returns  Serialized natural weapon model data
   */
  public getDataToSerialization(): string {
    return JSON.stringify({
      damage: this.damage.getSerializedData(),
      toHit: this.toHit.getSerializedData(),
      type: this.type,
      naturalType: this.naturalType,
    });
  }
}
