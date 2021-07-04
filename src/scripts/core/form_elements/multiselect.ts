import { ITemplate } from '../../interfaces/common';
import { PreparedViewTemplate } from '../../interfaces/templates';
import { ViewElementsBuilder } from '../viewElementsBuilder';
import {
  multiSelectOptionTemplate,
  multiSelectTemplate,
} from './multiselect_template';
import { SetWithObserver } from '../set_with_observer';
import { Observer } from '../observer';
import { dispatchChangeEvent } from './utils/utils';

type MultiSelectTemplateElements = {
  selectBox: HTMLDivElement;
  selectWrapper: HTMLDivElement;
  selectList: HTMLUListElement;
};

export class MultiSelect extends Observer {
  #itemsListExpanded = false;

  #selectElement: HTMLSelectElement;
  #template: PreparedViewTemplate<MultiSelectTemplateElements>;

  #selectedOptions = new SetWithObserver<string>();

  public constructor(select: HTMLSelectElement) {
    super();

    this.#selectElement = select;
  }

  public static getInstance(select: HTMLSelectElement): MultiSelect {
    return new MultiSelect(select);
  }

  public build(): void {
    this.#selectElement.hidden = true;

    this.prepareTemplate();
  }

  private prepareTemplate(): void {
    const { parentElement } = this.#selectElement;
    const { options } = this.#selectElement;
    const description = this.prepareBoxDescription(Array.from(options));
    const optionsFragment = this.buildOptions(options);

    this.#template =
      ViewElementsBuilder.getInstance<MultiSelectTemplateElements>(
        multiSelectTemplate,
        { boxDescription: description },
      ).build();

    this.#template.elements.selectList.appendChild(optionsFragment);
    this.#template.insert(parentElement, this.#selectElement);

    this.attachEvents();
  }

  private prepareBoxDescription(options: HTMLOptionElement[]): string {
    return options
      .filter((option) => option.selected)
      .map((option) => option.text)
      .join(', ');
  }

  private buildOptions(options: HTMLOptionsCollection): DocumentFragment {
    const optionsArray = Array.from(options);
    const fragment = document.createDocumentFragment();

    optionsArray.forEach((option) => {
      const { value, text } = option;
      const template = ViewElementsBuilder.getInstance(
        multiSelectOptionTemplate,
        { listItemValue: value, listItemText: text },
      ).build();

      template.insert(fragment);
    });

    return fragment;
  }

  private attachEvents(): void {
    const { selectWrapper, selectList } = this.#template.elements;

    this.#selectedOptions.on(this, 'add', this.onSelectedItemAdded);
    this.#selectedOptions.on(this, 'delete', this.onSelectedItemRemoved);

    this.#selectElement.addEventListener('click', this.onNativeSelectClick);
    selectWrapper.addEventListener('click', this.onSelectWrapperClick);
    selectList.addEventListener('click', this.onSelectListClick);
    selectWrapper.addEventListener('blur', this.onWrapperBlur);
  }

  private onSelectWrapperClick = (): void => {
    const { selectWrapper } = this.#template.elements;

    this.toggleListVisibility();

    if (this.#itemsListExpanded) {
      selectWrapper.focus();
    }
  };

  private onNativeSelectClick = (): void => {
    this.showList();
  };

  private showList(): void {
    this.#template.elements.selectWrapper.classList.add('expanded');
    this.#template.elements.selectList.classList.add('expanded');

    this.#itemsListExpanded = true;
  }

  private hideList(): void {
    // this.#template.elements.selectWrapper.classList.remove('expanded');
    // this.#template.elements.selectList.classList.remove('expanded');
    //
    // this.#itemsListExpanded = false;
  }

  private toggleListVisibility(): void {
    if (this.#itemsListExpanded) {
      this.hideList();
    } else {
      this.showList();
    }
  }

  private onSelectListClick = (e: MouseEvent): void => {
    const { target } = e;

    if (target instanceof HTMLLIElement) {
      const { value } = target.dataset;

      if (this.#selectedOptions.has(value)) {
        this.#selectedOptions.delete(value);
      } else {
        this.#selectedOptions.add(value);
      }
    }
  };

  private onSelectedItemAdded(item: string): void {
    const { selectList } = this.#template.elements;
    const { children } = selectList;
    const selectedItem = Array.from(children).find(
      (listItem: HTMLLIElement) => listItem.dataset.value === item,
    );

    if (selectedItem) {
      selectedItem.classList.add('selected');
    }

    this.markNativeOptionAsSelected(item);
  }

  private onSelectedItemRemoved(item: string): void {
    const { selectList } = this.#template.elements;
    const { children } = selectList;
    const selectedItem = Array.from(children).find(
      (listItem: HTMLLIElement) => listItem.dataset.value === item,
    );

    if (selectedItem) {
      selectedItem.classList.remove('selected');
    }

    this.markNativeOptionAsUnselected(item);
  }

  private markNativeOptionAsSelected(value: string): void {
    const nativeSelectedItem = Array.from(this.#selectElement.options).find(
      (option) => option.value === value,
    );

    if (nativeSelectedItem) {
      nativeSelectedItem.setAttribute('selected', 'true');

      dispatchChangeEvent(this.#selectElement);
    }
  }

  private markNativeOptionAsUnselected(value: string): void {
    const nativeSelectedItem = Array.from(this.#selectElement.options).find(
      (option) => option.value === value,
    );

    if (nativeSelectedItem) {
      nativeSelectedItem.removeAttribute('selected');

      dispatchChangeEvent(this.#selectElement);
    }
  }

  private onWrapperBlur = (): void => {
    this.hideList();
  };
}
