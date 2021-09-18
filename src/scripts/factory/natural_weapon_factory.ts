import {
  MonsterAttackTypes,
  MonstersTypes,
} from '../constants/entity/monsters';
import { NaturalWeaponModel } from '../model/items/weapons/natural_weapon_model';
import { Dice } from '../model/dice';
import { DamageTypes } from '../constants/combat_enums';

export function getMonsterNaturalWeapon(
  type: MonstersTypes,
): NaturalWeaponModel {
  switch (type) {
    case MonstersTypes.GiantRat:
      return new NaturalWeaponModel({
        damage: new Dice('1d2+1'),
        toHit: new Dice('1d2'),
        type: DamageTypes.Piercing,
        naturalType: MonsterAttackTypes.Bite,
      });
    case MonstersTypes.Player:
      return new NaturalWeaponModel({
        damage: new Dice('1d5'),
        toHit: new Dice('2d2'),
        type: DamageTypes.Bludgeoning,
        naturalType: MonsterAttackTypes.Fist,
      });
    default:
      return null;
  }
}
