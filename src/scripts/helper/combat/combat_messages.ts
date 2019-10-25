import {EntityModel} from '../../model/entity/entity_model';
import {MonsterAttackTypes} from '../../constants/monsters';
import {capitalizeString} from '../utility';
import {DamageTypes} from '../../constants/combat_enums';

export interface ICombatData {
    attacker: EntityModel;
    defender: EntityModel;
    wasDefenderHit: boolean;
    damageAmount: number;
}
// tslint:disable-next-line:interface-over-type-literal
type MessagePartType = {
    hit: {
        [prop: string]: string[];
    };
    miss: {
        [prop: string]: string[];
    };
    fail: {
        [prop: string]: string[];
    };
    dead?: {
        [prop: string]: string[];
    };
};

const attackerPart: MessagePartType = {
    hit: {
        [MonsterAttackTypes.FIST]: [
            '{attacker} throws a punch in direction of',
            '{attacker} swings with his fist at',
            '{attacker} throws a jab at',
            '{attacker} punches',
        ],
        [MonsterAttackTypes.BITE]: [
            '{attacker} makes good attempt to bite',
            '{attacker} bites',
            '{attacker} hits',
        ],
        [DamageTypes.SLASHING]: [
            '{attacker} slashes',
            '{attacker} cuts',
            '{attacker} swings at direction of',
        ],
        [DamageTypes.PIERCING]: [
            '{attacker} stabs',
            '{attacker} pierces',
            '{attacker} hits',
        ],
        [DamageTypes.BLUDGEONING]: [
            '{attacker} mauls',
            '{attacker} swings at direction of',
            '{attacker} hits',
        ],
    },
    miss: {
        [MonsterAttackTypes.FIST]: [
            '{attacker} throws a punch in direction of',
            '{attacker} swings with his fist at',
            '{attacker} throws a jab at',
            '{attacker} tries to punch',
            '{attacker} throws a lousy punch at',
            '{attacker} swings wildly with his fist at',
            '{attacker} makes poor attempt to punch',
        ],
        [MonsterAttackTypes.BITE]: [
            '{attacker} makes poor attempt to bite',
            '{attacker} tries to bite',
            '{attacker} tries to hit',
        ],
        [DamageTypes.SLASHING]: [
            '{attacker} tries to swing at direction of',
            '{attacker} makes poor attempt to cut',
            '{attacker} tries to slash',
        ],
        [DamageTypes.PIERCING]: [
            '{attacker} tries to swing at direction of',
            '{attacker} makes poor attempt to hit',
            '{attacker} tries to pierce',
        ],
        [DamageTypes.BLUDGEONING]: [
            '{attacker} tries to swing at direction of',
            '{attacker} makes poor attempt to hit',
            '{attacker} tries to maul',
        ],
    },
    fail: {
        [MonsterAttackTypes.FIST]: [
            '{attacker} throws a punch in direction of',
            '{attacker} swings with his fist at',
            '{attacker} throws a jab at',
        ],
        [MonsterAttackTypes.BITE]: [
            '{attacker} makes good attempt to bite',
            '{attacker} bites',
            '{attacker} hits',
        ],
        [DamageTypes.SLASHING]: [
            '{attacker} hits',
            '{attacker} cuts',
            '{attacker} makes good attempt to cut',
        ],
        [DamageTypes.PIERCING]: [
            '{attacker} hits',
            '{attacker} tries to pierce',
            '{attacker} makes good attempt to pierce',
        ],
        [DamageTypes.BLUDGEONING]: [
            '{attacker} hits',
            '{attacker} makes good attempt to hit',
        ],
    },
};
const defenderPart: MessagePartType = {
    hit: {
        [MonsterAttackTypes.FIST]: [
            ' {defender}. {defender} makes poor attempt to dodge. {defender} is {state} wounded.',
            ' {defender} {state} wounding him.',
            ' {defender}. {defender} tries to dodge incoming strike, but fails. {defender} is {state} wounded.',
            ' {defender}. {defender} fails to dodge strike. {defender} is {state} wounded.',
        ],
        [MonsterAttackTypes.BITE]: [
            ' {defender} {state} wounding him.',
            ' {defender} makes poor attempt to dodge. Sharp teeths cuts {defender} body {state} wounding him.',
        ],
        [DamageTypes.SLASHING]: [
            ' {defender}. {defender} makes poor attempt to dodge. {weapon} cuts {defender} {state} wounding him',
            ' {defender}. {defender} tries to avoid incoming strike, but fails. {defender} is {state} wounded',
            ' {defender} with {weapon}. {defender} fails to dodge. {weapon} cuts {defender} {state} wounding him',
        ],
        [DamageTypes.PIERCING]: [
            ' {defender} with {weapon}. {defender} is {state} wounded.',
            ' {defender} with {weapon}. {defender} fails to dodge incoming strike. {defender} is {state} wounded',
        ],
        [DamageTypes.BLUDGEONING]: [
            ' {defender} with {weapon}. {defender} is {state} wounded.',
            ' {defender} with {weapon}. {defender} fails to dodge incoming strike. {defender} is {state} wounded',
        ],
    },
    miss: {
        [MonsterAttackTypes.FIST]: [
            ' {defender}. {defender} makes excellent attempt to dodge. Attack misses',
            ' {defender}. {defender} successfully dodges incoming strike.',
            ' {defender} ducks under {attacker}\'s strike.',
        ],
        [MonsterAttackTypes.BITE]: [
            ' {defender}. {defender} makes excellent attempt to dodge. Attack misses',
            ' {defender}, but {defender} makes good attempt to dodge.',
        ],
        [DamageTypes.SLASHING]: [
            ' {defender} with his {weapon}. {defender} makes good attempt to dodge. {weapon} cuts through air right next to {defender}.',
            ' {defender} with his {weapon}. {defender} jumps aside and attack misses.',
            ' {defender}, but he dodges',
        ],
        [DamageTypes.PIERCING]: [
            ' {defender} with his {weapon}. {defender} makes good attempt to dodge. {weapon} pierces through air right next to {defender}.',
            ' {defender} with his {weapon}. {defender} jumps aside and attack misses.',
            ' {defender}, but he dodges',
        ],
        [DamageTypes.BLUDGEONING]: [
            ' {defender} with his {weapon}. {defender} makes good attempt to dodge. {weapon} swings  right next to {defender}.',
            ' {defender} with his {weapon}. {defender} jumps aside and attack misses.',
            ' {defender}, but he dodges',
        ],
    },
    fail: {
        [MonsterAttackTypes.FIST]: [
            ' {defender}. {defender} makes poor attempt to dodge. Attack hits, but fails to hurt {defender}.',
            ' {defender}, but fails to hurt {defender}.',
            ' {defender} fails to dodge incoming strike, but attack doesn\'t penetrate {defender} armour',
        ],
        [MonsterAttackTypes.BITE]: [
            ' {defender}. {defender} makes poor attempt to dodge, but attack doesn\'t penetrate {defender} armour.',
            ' {defender}. {defender} fails to dodge attack, but attack doesn\'t penetrate {defender} armour.',
        ],
        [DamageTypes.SLASHING]: [
            ' {defender} with his {weapon}. {defender} fails to dodge attack, but attack doesn\'t penetrate {defender} armour.',
            ' {defender}. {weapon} hits {defender} but doesn\'t cut through {defender} armour.',
        ],
        [DamageTypes.PIERCING]: [
            ' {defender} with his {weapon}. {defender} fails to dodge attack, but attack doesn\'t penetrate {defender} armour.',
            ' {defender}. {weapon} hits {defender} but doesn\'t penetrate through {defender} armour.',
        ],
        [DamageTypes.BLUDGEONING]: [
            ' {defender} with his {weapon}. {defender} fails to dodge attack, but attack doesn\'t penetrate {defender} armour.',
            ' {defender}. {weapon} hits {defender} but doesn\'t penetrate through {defender} armour.',
        ],
    },
    dead: {
        hit: [
            ' {defender} with {weapon}. {defender} drops dead.',
            ' {defender} with {weapon}. {defender} dead body falls on ground.',
        ],
    },
};

export function generateCombatMessage(data: ICombatData): string {
    const {
        attacker,
        defender,
        wasDefenderHit,
        damageAmount,
    } = data;
    const {
        weapon,
    } = attacker;
    const weaponType: string = weapon.naturalType || weapon.type;
    let message: string = '';
    let state: string = '';

    if (wasDefenderHit && damageAmount) {
        if (defender.hitPoints > 0) {
            message = `${attackerPart.hit[weaponType].random()}${defenderPart.hit[weaponType].random()}`;
            state = getDefenderState(defender);
        } else {
            message = `${attackerPart.hit[weaponType].random()}${defenderPart.dead.hit.random()}`;
        }
    } else if (wasDefenderHit && !damageAmount) {
        message = `${attackerPart.fail[weaponType].random()}${defenderPart.fail[weaponType].random()}`;
    } else if (!wasDefenderHit) {
        message = `${attackerPart.miss[weaponType].random()}${defenderPart.miss[weaponType].random()}`;
    }

    message = message.replace(/{attacker}/g, attacker.description);
    message = message.replace(/{defender}/g, defender.description);
    message = message.replace(/{state}/g, state);
    message = message.replace(/{weapon}/g, weapon.description);

    return message.split('.').map((part: string) => capitalizeString(part)).join('. ');
}
function getDefenderState(defender: EntityModel): string {
    const percentHealthLeft: number = defender.hitPoints / defender.maxHitPoints;
    let state: string = '';

    if (percentHealthLeft < 1 && percentHealthLeft > 0.8) {
        state = 'lightly';
    } else if (percentHealthLeft <= 0.8 && percentHealthLeft > 0.6) {
        state = 'barely';
    } else if (percentHealthLeft <= 0.6 && percentHealthLeft > 0.4) {
        state = 'heavily';
    } else if (percentHealthLeft <= 0.4 && percentHealthLeft > 0.2) {
        state = 'critically';
    } else if (percentHealthLeft <= 0.2 && percentHealthLeft > 0.001) {
        state = 'mortally';
    }

    return state;
}
