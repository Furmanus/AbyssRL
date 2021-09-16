import { ModalController } from './modal_controller';
import { ContainerInventoryModalView } from '../view/container_inventory_modal_view';
import { containerInventoryTemplate } from '../../templates/container_inventory_template';
import { ContainerInventoryModalEvents } from '../constants/events/containerInventoryModalEvents';
import { ItemsCollection } from '../collections/items_collection';
import { ModalActions } from '../constants/game_actions';
import { ItemModel } from '../model/items/item_model';

let instance: ContainerInventoryModalController = null;

export type ContainerInventoryModes = 'put' | 'withdraw';
export type ContainerInventoryTransferData = {
  items: ItemModel[];
  mode: ContainerInventoryModes;
};

export class ContainerInventoryModalController extends ModalController<ContainerInventoryModalView> {
  private mode: ContainerInventoryModes = 'put';
  private containerInventory: ItemsCollection = null;
  private playerInventory: ItemsCollection = null;
  private selectedOptionsInView = new Set<number>();
  protected view = new ContainerInventoryModalView(containerInventoryTemplate);
  private get currentList(): ItemsCollection {
    return this.mode === 'put' ? this.playerInventory : this.containerInventory;
  }

  private get sourceCollection(): ItemsCollection {
    return this.mode === 'put' ? this.playerInventory : this.containerInventory;
  }

  private get targetCollection(): ItemsCollection {
    return this.mode === 'put' ? this.containerInventory : this.playerInventory;
  }

  public static getInstance(): ContainerInventoryModalController {
    if (!instance) {
      instance = new ContainerInventoryModalController();
    }

    return instance;
  }

  public openModal() {
    this.mode = 'withdraw';

    super.openModal();

    this.notify(ModalActions.OpenModal);
  }

  public closeModal() {
    super.closeModal();

    this.selectedOptionsInView.clear();
  }

  public init(
    containerInventory: ItemsCollection,
    playerInventory: ItemsCollection,
  ): void {
    this.containerInventory = containerInventory;
    this.playerInventory = playerInventory;

    this.createList(this.currentList);
    this.view.changeHeadingText(this.mode);

    if (this.mode === 'withdraw' && this.currentList.size === 0) {
      this.view.showEmptyListText();
    }
  }

  private createList(listToDisplay: ItemsCollection): void {
    this.view.createList(listToDisplay);
  }

  protected attachEvents(): void {
    super.attachEvents();

    this.view.on(
      this,
      ContainerInventoryModalEvents.PutButtonClick,
      this.onPutButtonClickInView,
    );
    this.view.on(
      this,
      ContainerInventoryModalEvents.TakeButtonClick,
      this.onTakeButtonClickInView,
    );
    this.view.on(
      this,
      ContainerInventoryModalEvents.OptionSelect,
      this.onOptionSelectInView,
    );
    this.view.on(
      this,
      ContainerInventoryModalEvents.Confirm,
      this.onConfirmInView,
    );
  }

  protected detachEvents(): void {
    super.detachEvents();

    this.view.off(this, ContainerInventoryModalEvents.PutButtonClick);
    this.view.off(this, ContainerInventoryModalEvents.TakeButtonClick);
    this.view.off(this, ContainerInventoryModalEvents.OptionSelect);
    this.view.off(this, ContainerInventoryModalEvents.Confirm);
  }

  private onPutButtonClickInView(): void {
    this.mode = 'put';

    this.view.changeHeadingText(this.mode);
    this.view.clearList();

    this.createList(this.currentList);

    this.view.hideEmptyListText();
  }

  private onTakeButtonClickInView(): void {
    this.mode = 'withdraw';

    this.view.changeHeadingText(this.mode);
    this.view.clearList();

    this.createList(this.currentList);

    if (this.currentList.size === 0) {
      this.view.showEmptyListText();
    }
  }

  private onOptionSelectInView(index: number): void {
    if (index < this.currentList.size) {
      if (this.selectedOptionsInView.has(index)) {
        this.selectedOptionsInView.delete(index);
        this.view.unSelectOption(index);
      } else {
        this.selectedOptionsInView.add(index);
        this.view.selectOption(index);
      }
    }
  }

  private onConfirmInView(): void {
    const removedItems = this.sourceCollection.removeByIndexes(
      ...this.selectedOptionsInView,
    );

    this.targetCollection.add(removedItems);
    this.closeModal();

    this.notify(ContainerInventoryModalEvents.ItemsTransferred, {
      items: removedItems,
      mode: this.mode,
    });
  }
}
