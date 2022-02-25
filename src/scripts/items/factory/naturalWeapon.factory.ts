import {
  MonsterAttackTypes,
  MonstersTypes,
} from '../../entity/constants/monsters';
import {
  NaturalWeaponModel,
  SerializedNaturalWeapon,
} from '../models/weapons/naturalWeapon.model';
import { DamageTypes } from '../../combat/combat.constants';
import {
  NaturalWeaponNames,
  WeaponCriticalDamageType,
} from '../constants/weapons.constants';
import { ItemTypes } from '../constants/itemTypes.constants';

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
