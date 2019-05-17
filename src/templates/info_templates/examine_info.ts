import {ITemplate, ITemplateVariables} from '../../scripts/interfaces/common';

export function getEntityInfoTemplate(variables: ITemplateVariables): ITemplate {
    return {
        wrapper: `
            <div class="examine-wrapper">
                <canvas width="32" height="32" id="image"></canvas>
                <div class="examine-description">
                    <span>${variables.description}</span>
                </div>
                <div class="examine-stats">
                    <span>${variables.hitPoints}/${variables.maxHitPoints} HP</span>
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
}
