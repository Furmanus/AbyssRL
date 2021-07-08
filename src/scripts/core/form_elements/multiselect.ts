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
    const description = this.prepareBoxDescription();
    const optionsFragment = this.buildOptions(options);

    this.#template =
      ViewElementsBuilder.getInstance<MultiSelectTemplateElements>(
        multiSelectTemplate,
        { boxDescription: description },
      ).build();

    this.#template.elements.selectList.appendChild(optionsFragment);
    this.#template.insert(parentElement, this.#selectElement);

    this.adjustNativeSelectBoxStyles();
    this.defineValueInNativeSelect();

    this.attachEvents();
  }

  private prepareBoxDescription(): string {
    const { selectedOptions } = this.#selectElement;
    const placeholder = this.#selectElement?.dataset.placeholder;

    return (
      Array.from(selectedOptions)
        .map((option) => option.text)
        .join(', ') || placeholder
    );
  }

  private defineValueInNativeSelect(): void {
    Object.defineProperty<HTMLSelectElement>(this.#selectElement, 'value', {
      enumerable: true,
      configurable: true,
      get: (): string[] => {
        return this.#selectedOptions.getArrayItems();
      },
      set: (values: string[]): void => {
        this.#selectedOptions.setItems(values);
      },
    });
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
    this.#selectedOptions.on(this, 'change', this.onSelectedItemsChange);

    this.#selectElement.addEventListener('click', this.onNativeSelectClick);
    this.#selectElement.addEventListener('change', this.onNativeSelectChange);
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
    this.#template.elements.selectWrapper.classList.remove('expanded');
    this.#template.elements.selectList.classList.remove('expanded');

    this.#itemsListExpanded = false;
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

      e.stopPropagation();

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

  private onSelectedItemsChange = (): void => {
    const { selectList } = this.#template.elements;
    const { children } = selectList;

    Array.from(children).forEach((listItem: HTMLLIElement) => {
      if (this.#selectedOptions.has(listItem.dataset.value)) {
        listItem.classList.add('selected');

        this.markNativeOptionAsSelected(listItem.dataset.value, false);
      } else {
        listItem.classList.remove('selected');

        this.markNativeOptionAsUnselected(listItem.dataset.value, false);
      }
    });

    dispatchChangeEvent(this.#selectElement);
  };

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

  private markNativeOptionAsSelected(
    value: string,
    shouldDispatchEvent = true,
  ): void {
    const nativeSelectedItem = Array.from(this.#selectElement.options).find(
      (option) => option.value === value,
    );

    if (nativeSelectedItem) {
      nativeSelectedItem.setAttribute('selected', 'true');

      if (shouldDispatchEvent) {
        dispatchChangeEvent(this.#selectElement);
      }
    }
  }

  private markNativeOptionAsUnselected(
    value: string,
    shouldDispatchEvent = true,
  ): void {
    const nativeSelectedItem = Array.from(this.#selectElement.options).find(
      (option) => option.value === value,
    );

    if (nativeSelectedItem) {
      nativeSelectedItem.removeAttribute('selected');

      if (shouldDispatchEvent) {
        dispatchChangeEvent(this.#selectElement);
      }
    }
  }

  private drawDescription(): void {
    const { selectBox } = this.#template.elements;

    if (selectBox) {
      selectBox.innerText = this.prepareBoxDescription();
    }
  }

  private onWrapperBlur = (): void => {
    this.hideList();
  };

  private onNativeSelectChange = (): void => {
    this.drawDescription();
    this.adjustNativeSelectBoxStyles();
  };

  private adjustNativeSelectBoxStyles(): void {
    const { selectedOptions } = this.#selectElement;
    const { selectBox } = this.#template.elements;

    if (selectedOptions.length) {
      selectBox.classList.remove('empty');
    } else {
      selectBox.classList.add('empty');
    }
  }
}
