import { ModalController } from '../modal.controller';
import { ContainerInventoryModalView } from './containerInventoryModal.view';
import { containerInventoryTemplate } from './containerInventoryModal.template';
import { ContainerInventoryModalConstants } from './containerInventoryModal.constants';
import { ItemsCollection } from '../../items/items_collection';
import { ModalActions } from '../../main/constants/gameActions.constants';
import { ItemModel } from '../../items/models/item.model';
import { ContainerInventoryModes, PlayerSelectionResult } from './containerInventoryModal.interfaces';

let instance: ContainerInventoryModalController = null;

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

  public waitForPlayerSelection(): Promise<PlayerSelectionResult | null> {
    return new Promise((resolve) => {
      this.on(ContainerInventoryModalConstants.ItemsTransferred, onPlayerSelection);

      function onPlayerSelection(data: PlayerSelectionResult): void {
        resolve(data);
      }
    });
  }

  private createList(listToDisplay: ItemsCollection): void {
    this.view.createList(listToDisplay);
  }

  protected attachEvents(): void {
    super.attachEvents();

    this.view.on(
      ContainerInventoryModalConstants.PutButtonClick,
      this.onPutButtonClickInView,
    );
    this.view.on(
      ContainerInventoryModalConstants.TakeButtonClick,
      this.onTakeButtonClickInView,
    );
    this.view.on(
      ContainerInventoryModalConstants.OptionSelect,
      this.onOptionSelectInView,
    );
    this.view.on(
      ContainerInventoryModalConstants.Confirm,
      this.onConfirmInView,
    );
  }

  protected detachEvents(): void {
    super.detachEvents();

    this.view.off(ContainerInventoryModalConstants.PutButtonClick);
    this.view.off(ContainerInventoryModalConstants.TakeButtonClick);
    this.view.off(ContainerInventoryModalConstants.OptionSelect);
    this.view.off(ContainerInventoryModalConstants.Confirm);
  }

  private onPutButtonClickInView = (): void => {
    this.mode = 'put';

    this.view.changeHeadingText(this.mode);
    this.view.clearList();

    this.createList(this.currentList);

    this.view.hideEmptyListText();
  }

  private onTakeButtonClickInView = (): void => {
    this.mode = 'withdraw';

    this.view.changeHeadingText(this.mode);
    this.view.clearList();

    this.createList(this.currentList);

    if (this.currentList.size === 0) {
      this.view.showEmptyListText();
    }
  }

  private onOptionSelectInView = (index: number): void => {
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

  private onConfirmInView = (): void => {
    const removedItems = this.sourceCollection.getByIndexes(
      ...this.selectedOptionsInView,
    );

    this.closeModal();

    this.notify(ContainerInventoryModalConstants.ItemsTransferred, {
      items: removedItems,
      mode: this.mode,
    });
  }
}
