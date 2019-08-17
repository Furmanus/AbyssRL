import {ItemsCollection} from '../scripts/collections/items_collection';
import {ItemModel} from '../scripts/model/items/item_model';
import {drawSpriteOnCanvas} from '../scripts/helper/canvas_helper';

interface IGroups {
    [groupName: string]: DocumentFragment;
}

export function getPreparedInventoryElement(items: ItemsCollection): HTMLDivElement {
    const wrapper: DocumentFragment = getInventoryWrapper().content;
    const wrapperElement: HTMLDivElement = wrapper.querySelector('div[class="modal-inventory-wrapper"]');
    const groupContainer: HTMLDivElement = wrapper.querySelector('div[class="modal-inventory-group-container"]');
    const groups: IGroups = {};

    items.forEach((item: ItemModel) => {
        const itemType: string = item.itemType;
        let list: HTMLUListElement;

        if (!groups[itemType]) {
            groups[itemType] = generateItemGroup(itemType).content;
        }

        list = groups[itemType].querySelector('ul');
        list.appendChild(generateItemListElement(item).content);
    });

    Object.values(groups).forEach((groupElement: DocumentFragment) => {
        groupContainer.appendChild(groupElement);
    });

    wrapperElement.appendChild(generateFooter().content);

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
            <ul class="modal-inventory-group-list"/>
        </div>
    `;

    return group;
}
function generateItemListElement(item: ItemModel): HTMLTemplateElement {
    const template: HTMLTemplateElement = document.createElement('template');
    template.innerHTML = `
        <li class="modal-inventory-group-item">
            <canvas width="32" height="32"></canvas>
            <span>${item.fullDescription}</span>
        </li>
    `;
    drawSpriteOnCanvas(template.content.querySelector('canvas'), item.display);

    return template;
}

function generateFooter(): HTMLTemplateElement {
    const template: HTMLTemplateElement = document.createElement('template');
    template.innerHTML = `
        <div class="modal-inventory-footer">
            <button class="inventory-action" id="inventory-drop">drop [D]</button>
            <button class="inventory-action" id="inventory-drop">equip [E]</button>
            <button class="inventory-action" id="inventory-drop">use [U]</button>
        </div>
    `;

    return template;
}
