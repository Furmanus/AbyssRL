import {Dice} from '../model/dice';
import {MonsterAttackTypes} from '../constants/monsters';
import {DamageTypes} from '../constants/combat_enums';

export interface IWeapon {
    toHit: Dice;
    damage: Dice;
    type: DamageTypes;
    naturalType?: MonsterAttackTypes;
}
export interface INaturalWeapon extends IWeapon {
    naturalType: MonsterAttackTypes;
}
export interface IWeaponConstructorConfig {
    toHit: string;
    damage: string;
    type: string;
    name: string;
}
