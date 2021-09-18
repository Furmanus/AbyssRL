import { ItemsCollection } from '../scripts/collections/items_collection';
import { ItemModel } from '../scripts/model/items/item_model';
import { drawSpriteOnCanvas } from '../scripts/helper/canvas_helper';
import { EntityInventoryActions } from '../scripts/constants/entity_events';
import { getLetterFromNumber } from '../scripts/helper/utility';
import { actionNameToModalHeaderMap } from '../scripts/constants/entity/inventory';
import { EntityModel } from '../scripts/model/entity/entity_model';
import { WeaponModel } from '../scripts/model/items/weapons/weapon_model';

interface IGroups {
  [groupName: string]: DocumentFragment;
}

export function getPreparedInventoryElement(
  items: ItemsCollection,
  mode: EntityInventoryActions = EntityInventoryActions.Look,
  inventoryOwner?: EntityModel,
): HTMLDivElement {
  const wrapper: DocumentFragment = getInventoryWrapper().content;
  const wrapperElement: HTMLDivElement = wrapper.querySelector(
    'div[class="modal-inventory-wrapper"]',
  );
  const groupContainer: HTMLDivElement = wrapper.querySelector(
    'div[class="modal-inventory-group-container"]',
  );
  const groups: IGroups = {};

  if (items.size) {
    const header: HTMLHeadingElement = document.createElement('h4');
    header.classList.add('modal-inventory-header');
    header.innerText = actionNameToModalHeaderMap[mode];

    wrapperElement.insertAdjacentElement('afterbegin', header);

    items.forEach((item: ItemModel, index: number) => {
      const { itemType } = item;

      if (!groups[itemType]) {
        groups[itemType] = generateItemGroup(itemType).content;
      }

      const list = groups[itemType].querySelector('ul');
      list.appendChild(
        generateItemListElement(item, mode, inventoryOwner || null, index)
          .content,
      );
    });

    Object.values(groups).forEach((groupElement: DocumentFragment) => {
      groupContainer.appendChild(groupElement);
    });

    if (mode !== EntityInventoryActions.PickUp) {
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
            <ul class="modal-inventory-group-list" id="modal-inventory-list"/>
        </div>
    `;

  return group;
}
function generateItemListElement(
  item: ItemModel,
  mode: EntityInventoryActions,
  inventoryOwner: EntityModel,
  index: number,
): HTMLTemplateElement {
  const template: HTMLTemplateElement = document.createElement('template');
  const shouldRenderMultiSelectBoxes: boolean =
    mode === EntityInventoryActions.Drop ||
    mode === EntityInventoryActions.PickUp;
  const isItemEquipped =
    !!inventoryOwner && Object.values(inventoryOwner.equipSlots).includes(item);

  template.innerHTML = `
        <li class="modal-inventory-group-item" data-index="${index}">
            <span class="identifier">[${getLetterFromNumber(index)}]</span>
            <canvas width="32" height="32"></canvas>
            <span>${item.fullDescription} ${
    isItemEquipped ? '[equipped]' : ''
  }</span>
            ${
              shouldRenderMultiSelectBoxes
                ? '<div class="checkbox" data-element="inventory-checkbox"/>'
                : ''
            }
        </li>
    `;
  drawSpriteOnCanvas(template.content.querySelector('canvas'), item.display);

  return template;
}

function generateFooter(mode: EntityInventoryActions): HTMLTemplateElement {
  const template: HTMLTemplateElement = document.createElement('template');
  const isDropAction: boolean = mode === EntityInventoryActions.Drop;
  const isEquipAction: boolean = mode === EntityInventoryActions.Equip;
  const isUseAction: boolean = mode === EntityInventoryActions.Use;

  template.innerHTML = `
        <div class="modal-inventory-footer">
            <button class="inventory-action ${
              isDropAction ? 'active' : ''
            }" id="inventory-drop">
                ${isDropAction ? 'confirm [D]' : 'drop [D]'}
            </button>
            <button class="inventory-action ${
              isEquipAction ? 'active' : ''
            }" id="inventory-equip">
                equip [E]
            </button>
            <button class="inventory-action ${
              isUseAction ? 'active' : ''
            }" id="inventory-use">
                use [U]
            </button>
        </div>
    `;

  return template;
}
