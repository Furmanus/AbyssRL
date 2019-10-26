import {MonsterAttackTypes, MonstersTypes} from '../constants/monsters';
import {NaturalWeaponModel} from '../model/items/natural_weapon_model';
import {Dice} from '../model/dice';
import {DamageTypes} from '../constants/combat_enums';

export function getMonsterNaturalWeapon(type: MonstersTypes): NaturalWeaponModel {
    switch (type) {
        case MonstersTypes.GIANT_RAT:
            return new NaturalWeaponModel({
                damage: new Dice('1d2+1'),
                toHit: new Dice('1d2'),
                type: DamageTypes.PIERCING,
                naturalType: MonsterAttackTypes.BITE,
            });
        case MonstersTypes.ORC:
            return new NaturalWeaponModel({
                damage: new Dice('2d2+1'),
                toHit: new Dice('1d1'),
                type: DamageTypes.BLUDGEONING,
                naturalType: MonsterAttackTypes.FIST,
            });
        case MonstersTypes.PLAYER:
            return new NaturalWeaponModel({
                damage: new Dice('1d5'),
                toHit: new Dice('2d2'),
                type: DamageTypes.BLUDGEONING,
                naturalType: MonsterAttackTypes.FIST,
            });
        default:
            return null;
    }
}
