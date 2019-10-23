import {ModalView} from './modal_view';
import {EntityInventoryActions, InventoryModalEvents} from '../constants/entity_events';
import autobind, {boundMethod} from 'autobind-decorator';
import {SetWithObserver} from '../core/set_with_observer';
import {getNumericValueOfChar} from '../helper/utility';
import {IStringDictionary} from '../interfaces/common';
import {getHTMLListsChildrensArray} from '../helper/dom_helper';

const keyToInventoryActionMap: IStringDictionary = {
    d: EntityInventoryActions.DROP,
    e: EntityInventoryActions.EQUIP,
    u: EntityInventoryActions.USE,
};
const inventoryItemsAllowedChars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'z',
];

export class InventoryView extends ModalView {
    private dropButton: HTMLButtonElement;
    private equipButton: HTMLButtonElement;
    private useButton: HTMLButtonElement;
    private inventoryGroupsContainer: HTMLDivElement;
    private inventoryList: NodeListOf<HTMLUListElement>;

    public attachEvents(): void {
        this.setElementsFields();
        super.attachEvents();
        this.attachEventsToInventoryList();

        if (this.dropButton && this.equipButton && this.useButton) {
            this.dropButton.addEventListener('click', this.onDropButtonClick);
            this.equipButton.addEventListener('click', this.onEquipButtonClick);
            this.useButton.addEventListener('click', this.onUseButtonClick);
        }
    }
    public detachEvents(): void {
        if (this.dropButton && this.equipButton && this.useButton) {
            this.dropButton.removeEventListener('click', this.onDropButtonClick);
            this.equipButton.removeEventListener('click', this.onEquipButtonClick);
            this.useButton.removeEventListener('click', this.onUseButtonClick);
        }
        this.detachEventsFromInventoryList();
        window.removeEventListener('keydown', this.onWindowKeydownCallback);
    }
    public setInventoryMode(mode: EntityInventoryActions): void {
        switch (mode) {
            case EntityInventoryActions.DROP:
                this.dropButton.classList.add('active');
                this.useButton.classList.remove('active');
                this.equipButton.classList.remove('active');
                break;
            case EntityInventoryActions.EQUIP:
                this.dropButton.classList.remove('active');
                this.useButton.classList.remove('active');
                this.equipButton.classList.add('active');
                break;
            case EntityInventoryActions.USE:
                this.dropButton.classList.remove('active');
                this.useButton.classList.add('active');
                this.equipButton.classList.remove('active');
                break;
            default:
                throw new Error(`Invalid entity inventory action: ${mode}`);
        }
    }
    public scrollInventoryDown(): void {
        const {
            inventoryGroupsContainer,
        } = this;

        if (inventoryGroupsContainer.scrollHeight > inventoryGroupsContainer.offsetHeight) {
            inventoryGroupsContainer.scrollTop += 36;
        }
    }
    public scrollInventoryUp(): void {
        const {
            inventoryGroupsContainer,
        } = this;

        if (inventoryGroupsContainer.scrollHeight > inventoryGroupsContainer.offsetHeight) {
            inventoryGroupsContainer.scrollTop -= 36;
        }
    }
    @boundMethod
    protected onWindowKeydownCallback(e: KeyboardEvent): void {
        const {
            key,
        } = e;
        const keyNumericValue: number = getNumericValueOfChar(key);
        const wasMetaPressed: boolean = e.ctrlKey || e.shiftKey || e.altKey || e.metaKey;

        e.preventDefault();

        if (!wasMetaPressed && inventoryItemsAllowedChars.includes(key)) {
            this.notify(InventoryModalEvents.INVENTORY_ITEM_SELECTED, keyNumericValue);
        } else if (!wasMetaPressed && key.toLowerCase() === 'enter') {
            this.notify(InventoryModalEvents.INVENTORY_ACTION_CONFIRMED);
        } else if (e.shiftKey && e.key.toLowerCase() !== 'shift') {
            this.notify(InventoryModalEvents.CHANGE_INVENTORY_ACTION, keyToInventoryActionMap[e.key.toLowerCase()]);
        } else if (!wasMetaPressed && e.key.toLowerCase() === 'pagedown') {
            this.notify(InventoryModalEvents.INVENTORY_SCROLL_DOWN);
        } else if (!wasMetaPressed && e.key.toLowerCase() === 'pageup') {
            this.notify(InventoryModalEvents.INVENTORY_SCROLL_UP);
        }
    }
    private setElementsFields(): void {
        this.dropButton = this.modalContent.querySelector('#inventory-drop') as HTMLButtonElement;
        this.equipButton = this.modalContent.querySelector('#inventory-equip') as HTMLButtonElement;
        this.useButton = this.modalContent.querySelector('#inventory-use') as HTMLButtonElement;
        this.inventoryList = this.modalContent.querySelectorAll('[data-element=modal-inventory-list]');
        this.inventoryGroupsContainer = this.modalContent.querySelector('[data-element=modal-inventory-group-container]');
    }
    private attachEventsToInventoryList(): void {
        this.inventoryList.forEach((ulListElement: HTMLUListElement) => {
            Array.from(ulListElement && ulListElement.children || []).forEach((element: HTMLLIElement) => {
                element.addEventListener('click', this.onInventoryListItemSelect);
            });
        });
    }
    private detachEventsFromInventoryList(): void {
        this.inventoryList.forEach((ulListElement: HTMLUListElement) => {
            Array.from(ulListElement && ulListElement.children || []).forEach((element: HTMLLIElement) => {
                element.removeEventListener('click', this.onInventoryListItemSelect);
            });
        });
    }
    @boundMethod
    private onInventoryListItemSelect(ev: MouseEvent): void {
        let parent: HTMLElement = ev.target as HTMLElement;

        while ((parent.tagName || '').toLowerCase() !== 'li') {
            parent = parent.parentElement;
        }
        const index: number = parseInt(parent.dataset.index, 10);

        this.notify(InventoryModalEvents.INVENTORY_ITEM_SELECTED, index);
    }
    public markItemsAsSelected(selectedItems: SetWithObserver<number>): void {
        const inventoryListItems: HTMLLIElement[] = getHTMLListsChildrensArray(Array.from(this.inventoryList));

        this.markAllItemsAsDeselected();

        selectedItems.forEach((index: number) => {
            inventoryListItems[index].classList.add('selected');
        });
    }
    private markAllItemsAsDeselected(): void {
        const inventoryListItems: HTMLLIElement[] = getHTMLListsChildrensArray(Array.from(this.inventoryList));

        for (const inventoryListItem of inventoryListItems) {
            inventoryListItem.classList.remove('selected');
        }
    }
    @autobind
    private onDropButtonClick(e: MouseEvent): void {
        e.stopPropagation();
        this.notify(InventoryModalEvents.CHANGE_INVENTORY_ACTION, EntityInventoryActions.DROP);
    }
    @autobind
    private onEquipButtonClick(e: MouseEvent): void {
        e.stopPropagation();
        this.notify(InventoryModalEvents.CHANGE_INVENTORY_ACTION, EntityInventoryActions.EQUIP);
    }
    @autobind
    private onUseButtonClick(e: MouseEvent): void {
        e.stopPropagation();
        this.notify(InventoryModalEvents.CHANGE_INVENTORY_ACTION, EntityInventoryActions.USE);
    }
}
