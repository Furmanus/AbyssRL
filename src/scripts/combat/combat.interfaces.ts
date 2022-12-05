import { Dice } from '../position/dice';
import { MonsterAttackTypes } from '../entity/constants/monsters';
import { DamageTypes, EntityDamageReasons } from './combat.constants';
import { Entity } from '../entity/controllers/entity';

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

export interface EntityDamageSource {
  entity: Entity;
  reason: EntityDamageReasons;
}
