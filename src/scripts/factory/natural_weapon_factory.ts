import {
  MonsterAttackTypes,
  MonstersTypes,
} from '../constants/entity/monsters';
import {
  NaturalWeaponModel,
  SerializedNaturalWeapon,
} from '../model/items/weapons/natural_weapon_model';
import { DamageTypes } from '../constants/combat_enums';
import {
  NaturalWeaponNames,
  WeaponCriticalDamageType,
} from '../constants/items/weapons';
import { ItemTypes } from '../constants/items/item';

export class NaturalWeaponFactory {
  public static getMonsterNaturalWeaponFromData(
    data: SerializedNaturalWeapon,
  ): NaturalWeaponModel {
    return new NaturalWeaponModel(data);
  }

  public static getMonsterNaturalWeapon(
    type: MonstersTypes,
  ): NaturalWeaponModel {
    switch (type) {
      case MonstersTypes.GiantRat:
        return new NaturalWeaponModel({
          itemType: ItemTypes.NaturalWeapon,
          damage: '1d2+1',
          toHit: '1d2',
          type: DamageTypes.Piercing,
          naturalType: MonsterAttackTypes.Bite,
          criticalDamageType: [WeaponCriticalDamageType.Bleeding],
          criticalHitRate: 3,
          name: NaturalWeaponNames.Teeth,
        });
      case MonstersTypes.Player:
        return new NaturalWeaponModel({
          itemType: ItemTypes.NaturalWeapon,
          damage: '1d5',
          toHit: '2d2',
          type: DamageTypes.Bludgeoning,
          naturalType: MonsterAttackTypes.Fist,
          criticalHitRate: 5,
          criticalDamageType: [WeaponCriticalDamageType.Stun],
          name: NaturalWeaponNames.Fist,
        });
      default:
        return null;
    }
  }
}
