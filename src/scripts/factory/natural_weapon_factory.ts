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
        case MonstersTypes.GIANT_BAT:
            return new NaturalWeaponModel({
                damage: new Dice('1d2'),
                toHit: new Dice('1d3'),
                type: DamageTypes.PIERCING,
                naturalType: MonsterAttackTypes.BITE,
            });
        case MonstersTypes.GIANT_SPIDER:
            return new NaturalWeaponModel({
                damage: new Dice('1d4'),
                toHit: new Dice('1d2'),
                type: DamageTypes.PIERCING,
                naturalType: MonsterAttackTypes.BITE,
            });
        case MonstersTypes.PYTHON:
            return new NaturalWeaponModel({
                damage: new Dice('1d6'),
                toHit: new Dice('2d1'),
                type: DamageTypes.PIERCING,
                naturalType: MonsterAttackTypes.BITE,
            });
        case MonstersTypes.HEADLESS:
            return new NaturalWeaponModel({
                damage: new Dice('1d6+1'),
                toHit: new Dice('2d1'),
                type: DamageTypes.BLUDGEONING,
                naturalType: MonsterAttackTypes.FIST,
            });
        case MonstersTypes.SKELETON:
            return new NaturalWeaponModel({
                damage: new Dice('1d4+1'),
                toHit: new Dice('1d1'),
                type: DamageTypes.BLUDGEONING,
                naturalType: MonsterAttackTypes.FIST,
            });
        case MonstersTypes.TROLL:
            return new NaturalWeaponModel({
                damage: new Dice('1d6+2'),
                toHit: new Dice('2d2'),
                type: DamageTypes.BLUDGEONING,
                naturalType: MonsterAttackTypes.FIST,
            });
        case MonstersTypes.ETTIN:
            return new NaturalWeaponModel({
                damage: new Dice('1d8+3'),
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
