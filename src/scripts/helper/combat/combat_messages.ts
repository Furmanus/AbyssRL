import { EntityModel } from '../../model/entity/entity_model';
import { MonsterAttackTypes } from '../../constants/monsters';
import { capitalizeString } from '../utility';

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
};

const attackerPart: MessagePartType = {
  hit: {
    [MonsterAttackTypes.Fist]: [
      '{attacker} throws a punch in direction of',
      '{attacker} swings with his fist at',
      '{attacker} throws a jab at',
      '{attacker} punches',
    ],
    [MonsterAttackTypes.Bite]: [
      '{attacker} makes good attempt to bite',
      '{attacker} bites',
      '{attacker} hits',
    ],
  },
  miss: {
    [MonsterAttackTypes.Fist]: [
      '{attacker} throws a punch in direction of',
      '{attacker} swings with his fist at',
      '{attacker} throws a jab at',
      '{attacker} tries to punch',
      '{attacker} throws a lousy punch at',
      '{attacker} swings wildly with his fist at',
      '{attacker} makes poor attempt to punch',
    ],
    [MonsterAttackTypes.Bite]: [
      '{attacker} makes poor attempt to bite',
      '{attacker} tries to bite',
      '{attacker} tries to hit',
    ],
  },
  fail: {
    [MonsterAttackTypes.Fist]: [
      '{attacker} throws a punch in direction of',
      '{attacker} swings with his fist at',
      '{attacker} throws a jab at',
    ],
    [MonsterAttackTypes.Bite]: [
      '{attacker} makes good attempt to bite',
      '{attacker} bites',
      '{attacker} hits',
    ],
  },
};
const defenderPart: MessagePartType = {
  hit: {
    [MonsterAttackTypes.Fist]: [
      ' {defender}. {defender} makes poor attempt to dodge. {defender} is {state} wounded.',
      ' {defender} {state} wounding him.',
      ' {defender}. {defender} tries to dodge incoming strike, but fails. {defender} is {state} wounded.',
      ' {defender}. {defender} fails to dodge strike. {defender} is {state} wounded.',
    ],
    [MonsterAttackTypes.Bite]: [
      ' {defender} {state} wounding him.',
      ' {defender} makes poor attempt to dodge. Sharp teeths cuts {defender} body {state} wounding him.',
    ],
  },
  miss: {
    [MonsterAttackTypes.Fist]: [
      ' {defender}. {defender} makes excellent attempt to dodge. Attack misses',
      ' {defender}. {defender} successfully dodges incoming strike.',
      " {defender} ducks under {attacker}'s strike.",
    ],
    [MonsterAttackTypes.Bite]: [
      ' {defender}. {defender} makes excellent attempt to dodge. Attack misses',
      ' {defender}, but {defender} makes good attempt to dodge.',
    ],
  },
  fail: {
    [MonsterAttackTypes.Fist]: [
      ' {defender}. {defender} makes poor attempt to dodge. Attack hits, but fails to hurt {defender}.',
      ' {defender}, but fails to hurt {defender}.',
      " {defender} fails to dodge incoming strike, but attack doesn't penetrate {defender} armour",
    ],
    [MonsterAttackTypes.Bite]: [
      " {defender}. {defender} makes poor attempt to dodge, but attack doesn't penetrate {defender} armour.",
      " {defender}. {defender} fails to dodge attack, but attack doesn't penetrate {defender} armour.",
    ],
  },
};

export function generateCombatMessage(data: ICombatData): string {
  const { attacker, defender, wasDefenderHit, damageAmount } = data;
  const { weapon } = attacker;
  const weaponType: string = weapon.naturalType || weapon.type;
  let message: string = '';
  let state: string = '';

  if (wasDefenderHit && damageAmount) {
    message = `${attackerPart.hit[weaponType].random()}${defenderPart.hit[
      weaponType
    ].random()}`;
    state = getDefenderState(defender);
  } else if (wasDefenderHit && !damageAmount) {
    message = `${attackerPart.fail[weaponType].random()}${defenderPart.fail[
      weaponType
    ].random()}`;
  } else if (!wasDefenderHit) {
    message = `${attackerPart.miss[weaponType].random()}${defenderPart.miss[
      weaponType
    ].random()}`;
  }

  message = message.replace(/{attacker}/g, attacker.description);
  message = message.replace(/{defender}/g, defender.description);
  message = message.replace(/{state}/g, state);

  return message
    .split('.')
    .map((part: string) => capitalizeString(part))
    .join('. ');
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
