import {ModalView} from './modal_view';
import {EntityInventoryActions, InventoryModalEvents} from '../constants/entity_events';
import {boundMethod} from 'autobind-decorator';
import {SetWithObserver} from '../core/set_with_observer';
import {getNumericValueOfChar} from '../helper/utility';

export class InventoryView extends ModalView {
    private dropButton: HTMLButtonElement;
    private equipButton: HTMLButtonElement;
    private useButton: HTMLButtonElement;
    private inventoryList: HTMLUListElement;

    public attachEvents(): void {
        this.setElementsFields();
        super.attachEvents();
        this.attachEventsToInventoryList();

        this.dropButton.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
            this.notify(InventoryModalEvents.CLICK_ACTION_BUTTON, EntityInventoryActions.DROP);
        });
        this.equipButton.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
            this.notify(InventoryModalEvents.CLICK_ACTION_BUTTON, EntityInventoryActions.EQUIP);
        });
        this.useButton.addEventListener('click', (e: MouseEvent) => {
            e.stopPropagation();
            this.notify(InventoryModalEvents.CLICK_ACTION_BUTTON, EntityInventoryActions.USE);
        });
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

        this.notify(InventoryModalEvents.INVENTORY_ITEM_SELECTED, keyNumericValue);
    }
    private setElementsFields(): void {
        this.dropButton = this.modalContent.querySelector('#inventory-drop') as HTMLButtonElement;
        this.equipButton = this.modalContent.querySelector('#inventory-equip') as HTMLButtonElement;
        this.useButton = this.modalContent.querySelector('#inventory-use') as HTMLButtonElement;
        this.inventoryList = this.modalContent.querySelector('#modal-inventory-list') as HTMLUListElement;
    }
    private attachEventsToInventoryList(): void {
        Array.from(this.inventoryList.children).forEach((element: HTMLLIElement, index: number) => {
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
}
