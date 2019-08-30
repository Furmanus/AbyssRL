import {ModalController} from './modal_controller';
import {ItemsCollection} from '../collections/items_collection';
import {EntityInventoryActions, InventoryModalEvents} from '../constants/entity_events';
import {getPreparedInventoryElement} from '../../templates/inventory_template';
import {InventoryView} from '../view/inventory_view';
import {boundMethod} from 'autobind-decorator';
import {SetWithObserver} from '../core/set_with_observer';
import {ENTITY_MAX_INVENTORY_LENGTH} from '../constants/monsters';
import {ItemModel} from '../model/items/item_model';

export class InventoryController extends ModalController<ItemsCollection, InventoryView> {
    private inventoryMode: EntityInventoryActions;
    /**
     * Set of selected items from content's ItemsCollection. Numbers equals to index of selected items in examined
     * items collection.
     */
    private selectedItems: SetWithObserver<number>;
    private inventoryContent: ItemsCollection;

    public openModal(content: ItemsCollection, mode: EntityInventoryActions = EntityInventoryActions.LOOK): void {
        this.view = new InventoryView();
        this.selectedItems = new SetWithObserver<number>();
        this.inventoryContent = content;
        this.drawContentInView(getPreparedInventoryElement(content, mode));
        this.attachEventsInView();

        super.openModal(content);

        this.attachEvents();
        this.setMode(mode);
    }
    public closeModal(): void {
        super.closeModal();

        this.view.clearContent();
        this.inventoryContent = null;
        this.view = null;

        this.notify(InventoryModalEvents.INVENTORY_MODAL_CLOSED);
    }
    protected attachEvents(): void {
        super.attachEvents();

        this.view.on(this, InventoryModalEvents.CHANGE_INVENTORY_ACTION, this.onInventoryActionChangeInView);
        this.view.on(this, InventoryModalEvents.INVENTORY_ITEM_SELECTED, this.onInventoryItemSelectedInView);
        this.view.on(this, InventoryModalEvents.INVENTORY_ACTION_CONFIRMED, this.onInventoryActionConfirmed);

        this.selectedItems.on(this, 'add', this.onInventorySelectedItemsChange);
        this.selectedItems.on(this, 'delete', this.onInventorySelectedItemsChange);
    }
    private setMode(mode: EntityInventoryActions): void {
        this.inventoryMode = mode;
    }
    private setInventoryModeInView(mode: EntityInventoryActions): void {
        this.view.setInventoryMode(mode);
    }
    private rebuildView(mode: EntityInventoryActions): void {
        this.view.detachEvents();
        this.view.clearContent();

        this.drawContentInView(getPreparedInventoryElement(this.inventoryContent, mode));
        this.attachEventsInView();
    }
    private attachEventsInView(): void {
        this.view.attachEvents();
    }
    @boundMethod
    private onInventorySelectedItemsChange(): void {
        this.view.markItemsAsSelected(this.selectedItems);
    }
    @boundMethod
    private onInventoryActionChangeInView(action: EntityInventoryActions): void {
        if (action) {
            this.setMode(action);
            this.rebuildView(action);
            this.selectedItems.clear();
        }
    }
    @boundMethod
    private onInventoryItemSelectedInView(index: number): void {
        if (index >= ENTITY_MAX_INVENTORY_LENGTH || index >= this.inventoryContent.size) {
            return;
        }
        if (this.selectedItems.has(index)) {
            this.selectedItems.delete(index);
        } else {
            this.selectedItems.add(index);
        }
    }
    @boundMethod
    private onInventoryActionConfirmed(): void {
        const selectedItems: ItemModel[] = this.inventoryContent.get().filter((item: ItemModel, index: number) => {
            return this.selectedItems.has(index);
        });

        if (this.inventoryMode !== EntityInventoryActions.LOOK) {
            this.notify(InventoryModalEvents.INVENTORY_ACTION_CONFIRMED, {
                action: this.inventoryMode,
                selectedItems,
            });
        }
    }
}
