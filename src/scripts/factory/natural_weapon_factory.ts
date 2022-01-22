import {
  MonsterAttackTypes,
  MonstersTypes,
} from '../constants/entity/monsters';
import { NaturalWeaponModel } from '../model/items/weapons/natural_weapon_model';
import { Dice } from '../model/dice';
import { DamageTypes } from '../constants/combat_enums';
import {
  NaturalWeaponNames,
  WeaponCriticalDamageType,
} from '../constants/items/weapons';

export function getMonsterNaturalWeapon(
  type: MonstersTypes,
): NaturalWeaponModel {
  switch (type) {
    case MonstersTypes.GiantRat:
      return new NaturalWeaponModel({
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
