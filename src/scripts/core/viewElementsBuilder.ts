import { PreparedViewTemplate, TemplateObject } from '../interfaces/templates';

const constructorToken = Symbol('View Elements Builder');

export class ViewElementsBuilder<
  TemplateElements extends Record<string, HTMLElement>,
> {
  #content: HTMLDivElement;
  #template: TemplateObject;
  #variables?: object;

  public constructor(
    token: symbol,
    template: TemplateObject,
    variables?: Record<string, string>,
  ) {
    if (token !== constructorToken) {
      throw new Error('Invalid constructor');
    }

    this.#template = template;
    this.#variables = variables;
  }

  public static getInstance<
    TemplateElements extends Record<string, HTMLElement>,
  >(
    template: TemplateObject,
    variables?: Record<string, string>,
  ): ViewElementsBuilder<TemplateElements> {
    return new ViewElementsBuilder(constructorToken, template, variables);
  }

  public build(): PreparedViewTemplate<TemplateElements> {
    let preparedTemplateString = this.#template.content;
    const elements: Record<string, HTMLElement> = {};
    const temporaryDiv = document.createElement('div');

    if (this.#variables) {
      for (const [key, value] of Object.entries(this.#variables)) {
        const regex = new RegExp(`{{${key}}}`, 'g');

        preparedTemplateString = preparedTemplateString.replace(regex, value);
      }
    }

    temporaryDiv.innerHTML = preparedTemplateString;
    this.#content = temporaryDiv;

    return {
      content: temporaryDiv,
      elements: this.getElementsFromContainer(temporaryDiv),
      insert: (
        targetElement: HTMLElement | DocumentFragment,
        referenceNode?: HTMLElement,
      ): void => {
        this.insertContent(targetElement, referenceNode);
      },
    };
  }

  private insertContent(
    targetElement: Element | DocumentFragment,
    referenceNode?: HTMLElement,
  ): void {
    Array.from(this.#content.children).forEach((element) => {
      if (referenceNode) {
        targetElement.insertBefore(element, referenceNode);
      } else {
        targetElement.appendChild(element);
      }
    });
  }

  private getElementsFromContainer(container: HTMLElement): TemplateElements {
    const elements: Record<string, HTMLElement> = {};

    Array.from(this.#content.querySelectorAll('[data-element]')).forEach(
      (element: HTMLElement) => {
        const elementAttributeValue = element.getAttribute('data-element');

        if (elementAttributeValue) {
          elements[elementAttributeValue] = element;
        }
      },
    );

    return elements as TemplateElements;
  }
}
