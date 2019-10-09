import {ItemsCollection} from '../scripts/collections/items_collection';
import {ItemModel} from '../scripts/model/items/item_model';
import {drawSpriteOnCanvas} from '../scripts/helper/canvas_helper';
import {EntityInventoryActions} from '../scripts/constants/entity_events';
import {getLetterFromNumber} from '../scripts/helper/utility';
import {actionNameToModalHeaderMap} from '../scripts/constants/inventory';

interface IGroups {
    [groupName: string]: DocumentFragment;
}

export function getPreparedInventoryElement(
    items: ItemsCollection,
    mode: EntityInventoryActions = EntityInventoryActions.LOOK,
): HTMLDivElement {
    const wrapper: DocumentFragment = getInventoryWrapper().content;
    const wrapperElement: HTMLDivElement = wrapper.querySelector('div[class="modal-inventory-wrapper"]');
    const groupContainer: HTMLDivElement = wrapper.querySelector('div[class="modal-inventory-group-container"]');
    const groups: IGroups = {};

    if (items.size) {
        const header: HTMLHeadingElement = document.createElement('h4');
        header.classList.add('modal-inventory-header');
        header.innerText = actionNameToModalHeaderMap[mode];

        wrapperElement.insertAdjacentElement('afterbegin', header);

        items.forEach((item: ItemModel, index: number) => {
            const itemType: string = item.itemType;
            let list: HTMLUListElement;

            if (!groups[itemType]) {
                groups[itemType] = generateItemGroup(itemType).content;
            }

            list = groups[itemType].querySelector('ul');
            list.appendChild(generateItemListElement(item, mode, index).content);
        });

        Object.values(groups).forEach((groupElement: DocumentFragment) => {
            groupContainer.appendChild(groupElement);
        });

        if (mode !== EntityInventoryActions.PICK_UP) {
            wrapperElement.appendChild(generateFooter(mode).content);
        }
    } else {
        const noItemsMessage: HTMLParagraphElement = document.createElement('p');

        noItemsMessage.textContent = 'Your inventory is empty';
        noItemsMessage.classList.add('empty-content');
        groupContainer.appendChild(noItemsMessage);
    }

    return wrapperElement;
}

function getInventoryWrapper(): HTMLTemplateElement {
    const wrapper: HTMLTemplateElement = document.createElement('template');
    wrapper.innerHTML = `
        <div class="modal-inventory-wrapper">
            <div class="modal-inventory-group-container"></div>
        </div>
    `;

    return wrapper;
}

function generateItemGroup(groupName: string): HTMLTemplateElement {
    const group: HTMLTemplateElement = document.createElement('template');
    group.innerHTML = `
        <div class="modal-inventory-group">
            <h4 class="modal-inventory-group-header">${groupName}</h4>
            <ul class="modal-inventory-group-list" data-element="modal-inventory-list"/>
        </div>
    `;

    return group;
}
function generateItemListElement(
    item: ItemModel,
    mode: EntityInventoryActions,
    index: number,
): HTMLTemplateElement {
    const template: HTMLTemplateElement = document.createElement('template');
    const shouldRenderMultiSelectBoxes: boolean = mode === EntityInventoryActions.DROP || mode === EntityInventoryActions.PICK_UP;

    template.innerHTML = `
        <li class="modal-inventory-group-item" data-index="${index}">
            <span class="identifier">[${getLetterFromNumber(index)}]</span>
            <canvas width="32" height="32"></canvas>
            <span>${item.fullDescription}</span>
            ${shouldRenderMultiSelectBoxes ? '<div class="checkbox" data-element="inventory-checkbox"/>' : ''}
        </li>
    `;
    drawSpriteOnCanvas(template.content.querySelector('canvas'), item.display);

    return template;
}

function generateFooter(mode: EntityInventoryActions): HTMLTemplateElement {
    const template: HTMLTemplateElement = document.createElement('template');
    const isDropAction: boolean = mode === EntityInventoryActions.DROP;
    const isEquipAction: boolean = mode === EntityInventoryActions.EQUIP;
    const isUseAction: boolean = mode === EntityInventoryActions.USE;

    template.innerHTML = `
        <div class="modal-inventory-footer">
            <button class="inventory-action ${isDropAction ? 'active' : ''}" id="inventory-drop">
                ${isDropAction ? 'confirm [D]' : 'drop [D]'}
            </button>
            <button class="inventory-action ${isEquipAction ? 'active' : ''}" id="inventory-equip">
                equip [E]
            </button>
            <button class="inventory-action ${isUseAction ? 'active' : ''}" id="inventory-use">
                use [U]
            </button>
        </div>
    `;

    return template;
}
