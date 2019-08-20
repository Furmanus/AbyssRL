import {ModalView} from './modal_view';
import {EntityInventoryActions, InventoryModalEvents} from '../constants/entity_events';

export class InventoryView extends ModalView {
    private dropButton: HTMLButtonElement;
    private equipButton: HTMLButtonElement;
    private useButton: HTMLButtonElement;

    public attachEvents(): void {
        this.setActionButtonsFields();
        super.attachEvents();

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
                throw new Error(`Invalid  entity inventory action: ${mode}`);
        }
    }
    private setActionButtonsFields(): void {
        this.dropButton = this.modalContent.querySelector('#inventory-drop') as HTMLButtonElement;
        this.equipButton = this.modalContent.querySelector('#inventory-equip') as HTMLButtonElement;
        this.useButton = this.modalContent.querySelector('#inventory-use') as HTMLButtonElement;
    }
}
