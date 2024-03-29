import { MonsterSizes } from '../entity/constants/monsters';
import { Dice } from '../position/dice';
import { capitalizeString } from '../utils/utility';
import { generateCombatMessage } from './combatMessages';
import { criticalDamageTypeToStatusConstructor } from '../items/constants/weapons.constants';
import { Entity } from '../entity/entities/entity';
import { entityStatusToDamageText } from '../entity/constants/statuses';

const sizeToDodgeModifierMap: { [prop: string]: Dice } = {
  [MonsterSizes.Small]: new Dice('3d2'),
  [MonsterSizes.Medium]: new Dice('0d0'),
  [MonsterSizes.Large]: new Dice('-2d2'),
};
const d20: Dice = new Dice('1d20');

export interface ICombatResult {
  message: string;
  damageDealt: boolean;
}

export function doCombatAction(
  attackerController: Entity,
  defenderController: Entity,
): ICombatResult {
  const defenderModel = defenderController.getModel();
  const attackerModel = attackerController.getModel();
  const {
    dexterity: defenderDexterity,
    speed: defenderSpeed,
    protection: defenderProtection,
    size: defenderSize,
    evasion,
  } = defenderModel;
  const { dexterity: attackerDexterity, weapon: attackerWeapon } = attackerModel;
  const { toHit: attackerToHit } = attackerWeapon;
  let defenderDefenseRate: number =
    defenderDexterity +
    Math.floor(defenderSpeed / 12) +
    sizeToDodgeModifierMap[defenderSize].roll() +
    evasion;
  /**
   * Array of numbers (maximum value is 15) all of which d20 rolls have to be passed in order of successful attack
   */
  const attackerRollArray: number[] = [];
  const attackerBonus: number =
    attackerToHit.roll() + Math.floor(attackerDexterity / 4);
  let isDefenderHit: boolean = true;
  let damageDealt: number = null;
  let isCriticalHit = false;

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

  attackerRollArray.forEach((reqRoll: number, index: number) => {
    const roll = d20.roll();

    if (roll < reqRoll) {
      isDefenderHit = false;
    }

    if (roll >= 18 - index) {
      isCriticalHit = true;
      isDefenderHit = true;
    }
  });

  if (isDefenderHit) {
    const defenderDefenseRate = isCriticalHit
      ? Math.round(defenderProtection / 2)
      : defenderProtection;

    damageDealt = attackerWeapon.damage.roll() - defenderProtection;

    if (damageDealt > 0) {
      defenderController.takeHit(damageDealt);
      const isAlive = defenderController.getModel().hitPoints > 0;
      let message = generateCombatMessage({
        damageAmount: damageDealt,
        wasDefenderHit: isDefenderHit,
        isCriticalHit,
        attacker: attackerModel,
        defender: defenderModel,
      });
      let criticalText: string;

      if (
        isAlive &&
        isCriticalHit &&
        Array.isArray(attackerWeapon.criticalDamageType)
      ) {
        const criticalHitEffect = attackerModel.weapon.criticalDamageType.random();
        const criticalStatusConstructor =
          criticalDamageTypeToStatusConstructor[criticalHitEffect];
        const criticalStatusController = criticalStatusConstructor({
          entityModelId: defenderController.getModel().id,
        });
        const criticalType = criticalStatusController.type;

        criticalText =
          entityStatusToDamageText[
            criticalType as keyof typeof entityStatusToDamageText // TODO remove type cast after implementing all criticals
          ];
        defenderModel.addStatus(criticalStatusController);
      }

      if (criticalText) {
        message += ` ${capitalizeString(
          criticalText.replace('{{description}}', defenderModel.getDescription()),
        )}`;
      }

      if (!isAlive) {
        message += ` ${capitalizeString(defenderModel.getDescription())} dies.` // TODO refactor so dying text is a part of combat damage text
      }

      return {
        damageDealt: true,
        message,
      };
    } else {
      const message: string = generateCombatMessage({
        damageAmount: damageDealt,
        wasDefenderHit: isDefenderHit,
        isCriticalHit,
        attacker: attackerModel,
        defender: defenderModel,
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
      isCriticalHit: false,
      attacker: attackerModel,
      defender: defenderModel,
    });

    return {
      damageDealt: false,
      message,
    };
  }
}
