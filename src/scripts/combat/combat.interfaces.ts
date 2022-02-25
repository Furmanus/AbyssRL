import { Dice } from '../position/dice';
import { MonsterAttackTypes } from '../entity/constants/monsters';
import { DamageTypes } from './combat.constants';

export interface IWeapon {
  toHit: Dice;
  damage: Dice;
  type: DamageTypes;
  naturalType?: MonsterAttackTypes;
  description: string;
}
export interface INaturalWeapon extends IWeapon {
  naturalType: MonsterAttackTypes;
}
