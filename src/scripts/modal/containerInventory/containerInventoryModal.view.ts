import { ModalView } from '../modal.view';
import { ContainerInventoryModalConstants } from './containerInventoryModal.constants';
import { ItemsCollection } from '../../items/items_collection';
import { ItemModel } from '../../items/models/item.model';
import { ViewElementsBuilder } from '../../core/viewElementsBuilder';
import { containerInventoryTemplate } from './containerInventoryModal.template';
import { drawSpriteOnCanvas } from '../../utils/canvas_helper';
import {
  getLetterFromNumber,
  getNumericValueOfChar,
} from '../../utils/utility';
import { ContainerInventoryModes } from './containerInventoryModal.interfaces';

type ContainerInventoryModalViewElements = {
  heading: HTMLHeadingElement;
  list: HTMLUListElement;
  putActionButton: HTMLButtonElement;
  takeActionButton: HTMLButtonElement;
  emptyText: HTMLDivElement;
};

export class ContainerInventoryModalView extends ModalView<ContainerInventoryModalViewElements> {
  protected onWindowKeydownCallback = (e: KeyboardEvent): void => {
    if (e.shiftKey) {
      switch (e.key.toLowerCase()) {
        case 'p':
          this.notify(ContainerInventoryModalConstants.PutButtonClick);
          break;
        case 't':
          this.notify(ContainerInventoryModalConstants.TakeButtonClick);
          break;
      }
    } else if (e.key.toLowerCase() === 'enter') {
      this.notify(ContainerInventoryModalConstants.Confirm);
    } else if (e.key.toLowerCase().match(/[a-z]/)) {
      this.notify(
        ContainerInventoryModalConstants.OptionSelect,
        getNumericValueOfChar(e.key.toLowerCase()),
      );
    }
  };

  public attachEvents(): void {
    const { putActionButton, takeActionButton, list } = this.template.elements;

    putActionButton.addEventListener('click', this.onPutActionButtonClick);
    takeActionButton.addEventListener('click', this.onTakeActionButtonClick);
    list.addEventListener('click', this.onListItemClick);

    super.attachEvents();
  }

  public detachEvents() {
    const { putActionButton, takeActionButton, list } = this.template.elements;

    putActionButton.removeEventListener('click', this.onPutActionButtonClick);
    takeActionButton.removeEventListener('click', this.onTakeActionButtonClick);
    list.removeEventListener('click', this.onListItemClick);

    super.detachEvents();
  }

  public changeHeadingText(mode: ContainerInventoryModes): void {
    const { heading } = this.template.elements;

    if (mode === 'put') {
      heading.innerText = 'Put items into container';
    } else {
      heading.innerText = 'Take items from container';
    }
  }

  public createList(items: ItemsCollection): void {
    const { list } = this.template.elements;

    items.forEach((item: ItemModel, index: number) => {
      list.appendChild(this.createListItem(item, index));
    });
  }

  public clearList(): void {
    const { list } = this.template.elements;

    if (list) {
      list.innerHTML = '';
    }
  }

  private onListItemClick = (e: MouseEvent): void => {
    let { target } = e;
    let listItem: HTMLLIElement;

    while (
      !(target instanceof HTMLLIElement) &&
      target !== document &&
      target
    ) {
      target = (target as Element).parentElement;
    }

    if (target && target instanceof HTMLLIElement) {
      const { index } = target.dataset;

      this.notify(
        ContainerInventoryModalConstants.OptionSelect,
        parseInt(index, 10),
      );
    }
  };

  private createListItem(item: ItemModel, index: number): HTMLLIElement {
    const template = ViewElementsBuilder.getInstance<{
      canvas: HTMLCanvasElement;
    }>(
      {
        content: containerInventoryTemplate.listItem,
      },
      {
        identifier: `[${getLetterFromNumber(index)}]`,
        description: item.fullDescription,
        index: index.toString(),
      },
    ).build();
    const { canvas } = template.elements;

    drawSpriteOnCanvas(canvas, item.display);

    return template.getContentWithoutWrapper()[0] as HTMLLIElement;
  }

  public selectOption(index: number): void {
    const { list } = this.template.elements;
    const listItem = list.querySelector(`[data-index="${index}"]`);

    if (listItem) {
      listItem.classList.add('selected');
    }
  }

  public unSelectOption(index: number): void {
    const { list } = this.template.elements;
    const listItem = list.querySelector(`[data-index="${index}"]`);

    if (listItem) {
      listItem.classList.remove('selected');
    }
  }

  public showEmptyListText(): void {
    const { emptyText } = this.template.elements;

    if (emptyText) {
      emptyText.hidden = false;
    }
  }

  public hideEmptyListText(): void {
    const { emptyText } = this.template.elements;

    if (emptyText) {
      emptyText.hidden = true;
    }
  }

  private onPutActionButtonClick = () => {
    this.notify(ContainerInventoryModalConstants.PutButtonClick);
  };

  private onTakeActionButtonClick = () => {
    this.notify(ContainerInventoryModalConstants.TakeButtonClick);
  };
}
