import { ModalController } from './modal_controller';
import { ItemsCollection } from '../collections/items_collection';
import {
  EntityInventoryActions,
  InventoryModalEvents,
} from '../constants/entity_events';
import { getPreparedInventoryElement } from '../../templates/inventory_template';
import { InventoryView } from '../view/inventory_view';
import { boundMethod } from 'autobind-decorator';
import { SetWithObserver } from '../core/set_with_observer';
import { ENTITY_MAX_INVENTORY_LENGTH } from '../constants/entity/monsters';
import { ItemModel } from '../model/items/item_model';
import { EntityModel } from '../model/entity/entity_model';

export class InventoryController extends ModalController<
  ItemsCollection,
  InventoryView
> {
  private inventoryMode: EntityInventoryActions;
  /**
   * Set of selected items from content's ItemsCollection. Numbers equals to index of selected items in examined
   * items collection.
   */
  private selectedItems: SetWithObserver<number>;
  private inventoryContent: ItemsCollection;
  protected view: InventoryView = new InventoryView();

  public openModal(
    content: ItemsCollection,
    mode: EntityInventoryActions = EntityInventoryActions.Look,
    inventoryOwner?: EntityModel,
  ): void {
    this.selectedItems = new SetWithObserver<number>();
    this.inventoryContent = content;

    this.drawContentInView(
      getPreparedInventoryElement(content, mode, inventoryOwner),
    );
    this.attachEventsInView();

    super.openModal(content);

    this.setMode(mode);
  }

  public closeModal(): void {
    super.closeModal();

    this.inventoryContent = null;

    this.notify(InventoryModalEvents.InventoryModalClosed);
  }

  protected attachEvents(): void {
    super.attachEvents();

    this.view.on(
      this,
      InventoryModalEvents.ChangeInventoryAction,
      this.onInventoryActionChangeInView,
    );
    this.view.on(
      this,
      InventoryModalEvents.InventoryItemSelected,
      this.onInventoryItemSelectedInView,
    );
    this.view.on(
      this,
      InventoryModalEvents.InventoryActionConfirmed,
      this.onInventoryActionConfirmed,
    );

    this.selectedItems.on(this, 'add', this.onInventorySelectedItemsChange);
    this.selectedItems.on(this, 'delete', this.onInventorySelectedItemsChange);
  }

  protected detachEvents(): void {
    super.detachEvents();

    this.view.off(this, InventoryModalEvents.ChangeInventoryAction);
    this.view.off(this, InventoryModalEvents.InventoryItemSelected);
    this.view.off(this, InventoryModalEvents.InventoryActionConfirmed);

    this.selectedItems.off(this, 'add');
    this.selectedItems.off(this, 'delete');
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

    this.drawContentInView(
      getPreparedInventoryElement(this.inventoryContent, mode),
    );
    this.attachEventsInView();
  }

  private attachEventsInView(): void {
    this.view.attachEvents();
  }

  @boundMethod
  private onInventorySelectedItemsChange(): void {
    if (this.inventoryMode === EntityInventoryActions.Equip) {
      this.onInventoryActionConfirmed();
    } else {
      this.view.markItemsAsSelected(this.selectedItems);
    }
  }

  @boundMethod
  private onInventoryActionChangeInView(action: EntityInventoryActions): void {
    if (action && this.inventoryMode !== EntityInventoryActions.PickUp) {
      if (action === this.inventoryMode) {
        this.onInventoryActionConfirmed();
      } else {
        this.setMode(action);
        this.rebuildView(action);
        this.selectedItems.clear();
      }
    }
  }

  @boundMethod
  private onInventoryItemSelectedInView(index: number): void {
    if (
      index >= ENTITY_MAX_INVENTORY_LENGTH ||
      index >= this.inventoryContent.size
    ) {
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
    const selectedItems: ItemModel[] = this.inventoryContent
      .get()
      .filter((item: ItemModel, index: number) => {
        return this.selectedItems.has(index);
      });

    if (this.inventoryMode !== EntityInventoryActions.Look) {
      this.notify(InventoryModalEvents.InventoryActionConfirmed, {
        action: this.inventoryMode,
        selectedItems,
      });
    }
  }
}
