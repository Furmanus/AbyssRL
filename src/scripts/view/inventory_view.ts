import {ModalView} from './modal_view';
import {EntityInventoryActions, InventoryModalEvents} from '../constants/entity_events';
import autobind, {boundMethod} from 'autobind-decorator';
import {SetWithObserver} from '../core/set_with_observer';
import {getNumericValueOfChar} from '../helper/utility';
import {IStringDictionary} from '../interfaces/common';

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
    private inventoryList: HTMLUListElement;

    public attachEvents(): void {
        this.setElementsFields();
        super.attachEvents();
        this.attachEventsToInventoryList();

        if (this.inventoryList) {
            this.dropButton.addEventListener('click', this.onDropButtonClick);
            this.equipButton.addEventListener('click', this.onEquipButtonClick);
            this.useButton.addEventListener('click', this.onUseButtonClick);
        }
    }
    public detachEvents(): void {
        if (this.inventoryList) {
            this.dropButton.removeEventListener('click', this.onDropButtonClick);
            this.equipButton.removeEventListener('click', this.onEquipButtonClick);
            this.useButton.removeEventListener('click', this.onUseButtonClick);
        }

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
        }
    }
    private setElementsFields(): void {
        this.dropButton = this.modalContent.querySelector('#inventory-drop') as HTMLButtonElement;
        this.equipButton = this.modalContent.querySelector('#inventory-equip') as HTMLButtonElement;
        this.useButton = this.modalContent.querySelector('#inventory-use') as HTMLButtonElement;
        this.inventoryList = this.modalContent.querySelector('#modal-inventory-list') as HTMLUListElement;
    }
    // TODO detach those events to prevent memory leak
    private attachEventsToInventoryList(): void {
        Array.from(this.inventoryList && this.inventoryList.children || []).forEach((element: HTMLLIElement, index: number) => {
            element.addEventListener('click', this.onInventoryListItemSelect.bind(this, index));
        });
    }
    @boundMethod
    private onInventoryListItemSelect(index: number): void {
        this.notify(InventoryModalEvents.INVENTORY_ITEM_SELECTED, index);
    }
    public markItemsAsSelected(selectedItems: SetWithObserver<number>): void {
        this.markAllItemsAsDeselected();

        const inventoryListItems: HTMLCollection = this.inventoryList.children;

        selectedItems.forEach((index: number) => {
            inventoryListItems[index].classList.add('selected');
        });
    }
    private markAllItemsAsDeselected(): void {
        const inventoryListItems: HTMLCollection = this.inventoryList.children;

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
