import {
  ITemplate,
  ITemplateVariables,
  TemplateType,
} from '../../scripts/interfaces/common';
import { ItemTypes } from '../../scripts/constants/item';

export function getEntityInfoTemplate(
  variables: ITemplateVariables,
  itemType?: ItemTypes,
): ITemplate {
  const baseTemplate: ITemplate = {
    wrapper: `
            <div class="examine-wrapper">
                <canvas width="32" height="32" id="image"></canvas>
                <div class="examine-description">
                    <span>${variables.description}</span>
                </div>
                <div class="examine-stats">
                    <span>${variables.hitPoints}/${variables.maxHitPoints} HP</span>
                </div>
                <div class="examine-weapon">
                    <span>Attack: ${variables.weaponType} ${variables.weaponDamage} ${variables.weaponDmgType}</span>
                </div>
            </div>
        `,
    cell: `
            <div class="examine-wrapper">
                <canvas width="32" height="32" id="image"></canvas>
                <div class="examine-description">
                    <span>${variables.description}</span>
                </div>
            </div>
        `,
  };
  const itemTemplate: TemplateType = {
    [ItemTypes.Weapon]: `
            <div class="examine-wrapper">
                <canvas width="32" height="32" id="image"></canvas>
                <div class="examine-description">
                    <span>${variables.description}</span>
                </div>
                <div class="examine-stats">
                    <span>Damage: ${variables.damage}</span>
                </div>
                <div class="examine-stats">
                    <span>toHit: ${variables.toHit}</span>
                </div>
            </div>
        `,
  };

  return {
    ...baseTemplate,
    item: itemTemplate[itemType] || '',
  };
}
