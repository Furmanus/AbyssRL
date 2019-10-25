import {EntityModel} from '../model/entity/entity_model';
import {MonsterSizes} from '../constants/monsters';
import {Dice} from '../model/dice';
import {generateCombatMessage} from './combat/combat_messages';

const sizeToDodgeModifierMap: {[prop: string]: Dice} = {
    [MonsterSizes.SMALL]: new Dice('3d2'),
    [MonsterSizes.MEDIUM]: new Dice('0d0'),
    [MonsterSizes.LARGE]: new Dice('-2d2'),
};
const d20: Dice = new Dice('1d20');

export interface ICombatResult {
    message: string;
    damageDealt: boolean;
}

export function doCombatAction(attacker: EntityModel, defender: EntityModel): ICombatResult {
    const {
        dexterity: defenderDexterity,
        speed: defenderSpeed,
        protection: defenderProtection,
        size: defenderSize,
    } = defender;
    const {
        dexterity: attackerDexterity,
        weapon: attackerWeapon,
    } = attacker;
    const {
        toHit: attackerToHit,
    } = attackerWeapon;
    let defenderDefenseRate: number = defenderDexterity +
        Math.floor(defenderSpeed / 2) +
        sizeToDodgeModifierMap[defenderSize].roll();
    /**
     * Array of numbers (maximum value is 15) all of which d20 rolls have to be passed in order of successful attack
     */
    const attackerRollArray: number[] = [];
    const attackerBonus: number = attackerToHit.roll() + Math.floor(attackerDexterity / 4);
    let isDefenderHit: boolean = true;
    let damageDealt: number = null;

    if (defenderDefenseRate > 0.5 * attackerBonus) {
        defenderDefenseRate -= Math.floor(attackerBonus / 2);
    }

    do {
        const partial = defenderDefenseRate - 15;

        if (partial > 0) {
            attackerRollArray.push(partial);
            defenderDefenseRate %= 15;
        } else {
            attackerRollArray.push(defenderDefenseRate);
        }
    } while (defenderDefenseRate > 15);

    attackerRollArray.forEach((reqRoll: number) => {
        if (d20.roll() < reqRoll) {
            isDefenderHit = false;
        }
    });

    if (isDefenderHit) {
        damageDealt = attackerWeapon.damage.roll() - defenderProtection;

        if (damageDealt > 0) {
            const message: string = generateCombatMessage({
                damageAmount: damageDealt,
                wasDefenderHit: isDefenderHit,
                attacker,
                defender,
            });

            return {
                damageDealt: true,
                message,
            };
        } else {
            const message: string = generateCombatMessage({
                damageAmount: damageDealt,
                wasDefenderHit: isDefenderHit,
                attacker,
                defender,
            });

            return {
                damageDealt: false,
                message,
            };
        }
    } else {
        const message: string = generateCombatMessage({
            damageAmount: 0,
            wasDefenderHit: isDefenderHit,
            attacker,
            defender,
        });

        return {
            damageDealt: false,
            message,
        };
    }
}
