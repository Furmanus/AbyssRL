import { Observer } from '../../observer';
import { PreparedViewTemplate } from '../../../interfaces/templates';
import { ViewElementsBuilder } from '../../viewElementsBuilder';
import {
  multiSelectOptionTemplate,
  multiSelectTemplate,
} from '../multiselect/multiselect_template';
import {
  singleSelectOptionTemplate,
  singleSelectTemplate,
} from './single_select_template';
import { dispatchChangeEvent } from '../utils/utils';

type SingleSelectTemplateElements = {
  singleSelectWrapper: HTMLDivElement;
  singleSelectBox: HTMLDivElement;
  singleSelectList: HTMLUListElement;
};

export class SingleSelect extends Observer {
  #itemsListExpanded = false;

  #selectElement: HTMLSelectElement;
  #template: PreparedViewTemplate<SingleSelectTemplateElements>;
  #selectedOption: string;

  public constructor(select: HTMLSelectElement) {
    super();

    this.#selectElement = select;
  }

  public static getInstance(select: HTMLSelectElement): SingleSelect {
    return new SingleSelect(select);
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
      ViewElementsBuilder.getInstance<SingleSelectTemplateElements>(
        singleSelectTemplate,
        { boxDescription: description },
      ).build();

    this.#template.elements.singleSelectList.appendChild(optionsFragment);
    this.#template.insert(parentElement, this.#selectElement);

    this.defineAttributesOnNativeSelect();
    this.attachEvents();
  }

  private prepareBoxDescription(): string {
    const placeholder = this.#selectElement?.dataset.placeholder;

    return this.#selectElement.selectedOptions?.[0]?.text || placeholder || '';
  }

  private defineAttributesOnNativeSelect(): void {
    Object.defineProperty(this.#selectElement, 'value', {
      enumerable: true,
      configurable: true,
      set: (value: string): void => {
        const oldValue = this.#selectedOption;

        if (oldValue) {
          this.markNativeOptionAsUnselected(oldValue);
          this.#selectedOption = value;
          this.markNativeOptionAsSelected(value);

          dispatchChangeEvent(this.#selectElement);
        } else {
          this.markNativeOptionAsSelected(value);
          this.#selectedOption = value;

          dispatchChangeEvent(this.#selectElement);
        }
      },
      get: (): string => {
        return this.#selectedOption;
      },
    });
  }

  private buildOptions(options: HTMLOptionsCollection): DocumentFragment {
    const optionsArray = Array.from(options);
    const fragment = document.createDocumentFragment();

    optionsArray.forEach((option) => {
      const { value, text } = option;
      const template = ViewElementsBuilder.getInstance(
        singleSelectOptionTemplate,
        { listItemValue: value, listItemText: text },
      ).build();

      template.insert(fragment);
    });

    return fragment;
  }

  private attachEvents(): void {
    const { singleSelectWrapper, singleSelectList } = this.#template.elements;

    this.#selectElement.addEventListener('click', this.onNativeSelectClick);
    this.#selectElement.addEventListener('change', this.onNativeSelectChange);
    singleSelectWrapper.addEventListener('click', this.onSelectWrapperClick);
    singleSelectList.addEventListener('click', this.onSelectListClick);
    singleSelectWrapper.addEventListener('blur', this.onWrapperBlur);
  }

  private onSelectWrapperClick = (): void => {
    const { singleSelectWrapper } = this.#template.elements;

    this.toggleListVisibility();

    if (this.#itemsListExpanded) {
      singleSelectWrapper.focus();
    }
  };

  private onNativeSelectClick = (): void => {
    this.showList();
  };

  private showList(): void {
    this.#template.elements.singleSelectWrapper.classList.add('expanded');
    this.#template.elements.singleSelectList.classList.add('expanded');

    this.#itemsListExpanded = true;
  }

  private hideList(): void {
    this.#template.elements.singleSelectWrapper.classList.remove('expanded');
    this.#template.elements.singleSelectList.classList.remove('expanded');

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
    const oldSelectedValue = this.#selectedOption;

    if (target instanceof HTMLLIElement) {
      const { value } = target.dataset;

      if (this.#selectedOption === value) {
        this.#selectedOption = null;
        this.markNativeOptionAsUnselected(oldSelectedValue);
      } else {
        this.#selectedOption = value;
        this.markNativeOptionAsSelected(value);
        this.markNativeOptionAsUnselected(oldSelectedValue);
      }

      dispatchChangeEvent(this.#selectElement);
    }
  };

  private markNativeOptionAsSelected(value: string): void {
    const nativeSelectedItem = Array.from(this.#selectElement.options).find(
      (option) => option.value === value,
    );

    if (nativeSelectedItem) {
      nativeSelectedItem.setAttribute('selected', 'true');
    }
  }

  private markNativeOptionAsUnselected(value: string): void {
    const nativeSelectedItem = Array.from(this.#selectElement.options).find(
      (option) => option.value === value,
    );

    if (nativeSelectedItem) {
      nativeSelectedItem.removeAttribute('selected');
    }
  }

  private drawDescription(): void {
    const { singleSelectBox } = this.#template.elements;

    if (singleSelectBox) {
      singleSelectBox.innerText = this.prepareBoxDescription();
    }
  }

  private onWrapperBlur = (): void => {
    this.hideList();
  };

  private onNativeSelectChange = (): void => {
    this.drawDescription();
  };
}
