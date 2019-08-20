import {ModalController} from './modal_controller';
import {ItemsCollection} from '../collections/items_collection';
import {EntityInventoryActions, InventoryModalEvents} from '../constants/entity_events';
import {getPreparedInventoryElement} from '../../templates/inventory_template';
import {InventoryView} from '../view/inventory_view';
import {boundMethod} from 'autobind-decorator';

export class InventoryController extends ModalController<ItemsCollection, InventoryView> {
    private inventoryMode: EntityInventoryActions;

    public openModal(content: ItemsCollection, mode: EntityInventoryActions = EntityInventoryActions.LOOK): void {
        this.view = new InventoryView();
        this.drawContentInView(getPreparedInventoryElement(content, mode));
        this.attachEventsInView();

        super.openModal(content);

        this.attachEvents();
        this.setMode(mode);
    }
    public closeModal(): void {
        super.closeModal();

        this.view.clearContent();
        this.currentContent = null;
        this.view = null;
    }
    protected attachEvents(): void {
        super.attachEvents();

        this.view.on(this, InventoryModalEvents.CLICK_ACTION_BUTTON, this.onInventoryActionClickInView);
    }
    private setMode(mode: EntityInventoryActions): void {
        this.inventoryMode = mode;
    }
    private setInventoryModelInView(mode: EntityInventoryActions): void {
        this.view.setInventoryMode(mode);
    }
    private attachEventsInView(): void {
        this.view.attachEvents();
    }
    @boundMethod
    private onInventoryActionClickInView(action: EntityInventoryActions): void {
        this.setMode(action);
        this.setInventoryModelInView(action);
    }
}
