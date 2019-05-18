import {Dice} from '../model/dice';
import {MonsterAttackTypes} from '../constants/monsters';
import {DamageTypes} from '../constants/combat_enums';

export interface IWeapon {
    toHit: Dice;
    damage: Dice;
    type: DamageTypes;
}
export interface INaturalWeapon extends IWeapon {
    naturalType: MonsterAttackTypes;
}
