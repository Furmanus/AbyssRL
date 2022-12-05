import { Constructor } from '../core/constructor';
import { ModalActions } from '../main/constants/gameActions.constants';
import { clearElement } from '../utils/dom_helper';
import { PreparedViewTemplate, TemplateObject } from '../interfaces/templates';
import { ViewElementsBuilder } from '../core/viewElementsBuilder';

/**
 * Class describing view of global application modal.
 */
export abstract class ModalView<
  TemplateElements extends Record<string, HTMLElement> = {},
> extends Constructor {
  protected modalWrapper: HTMLDivElement;
  protected modalContent: HTMLDivElement;
  protected modalOverlay: HTMLDivElement;
  protected template?: PreparedViewTemplate<TemplateElements>;
  private rawTemplate: {
    template: TemplateObject;
    variables: Record<string, string>;
  };

  public constructor(
    template?: TemplateObject,
    variables: Record<string, string> = {},
  ) {
    super();
    this.modalWrapper = document.getElementById(
      'modal-wrapper',
    ) as HTMLDivElement;
    this.modalContent = document.getElementById(
      'modal-content',
    ) as HTMLDivElement;
    this.modalOverlay = document.getElementById(
      'modal-wrapper',
    ) as HTMLDivElement;
    /* Inventory modal view is constructed in different way without passing templateObject to constructor */
    if (template) {
      this.rawTemplate = {
        template,
        variables,
      };
    }
  }

  public open(): void {
    if (this.rawTemplate) {
      const { template, variables } = this.rawTemplate;

      this.template = ViewElementsBuilder.getInstance<TemplateElements>(
        template,
        variables,
      ).build();
      this.template.insert(this.modalContent);
    }

    this.modalWrapper.classList.remove('hidden');
    this.attachEvents();
    this.notify(ModalActions.OpenModal);

    this.initialize();
  }

  protected initialize(): void {}

  public close(): void {
    this.modalWrapper.classList.add('hidden');
    this.detachEvents();
    this.clearContent();

    this.notify(ModalActions.CloseModal);
  }

  public drawContent<E extends HTMLElement = HTMLElement>(content: E): void {
    this.clearContent();
    this.modalContent.appendChild(content);
  }

  public clearContent(): void {
    clearElement(this.modalContent);
  }

  public attachEvents(): void {
    this.modalOverlay.addEventListener('click', this.onOverlayClick);
    this.modalContent.addEventListener('click', this.onContentClick);

    window.addEventListener('keydown', this.onWindowKeydownCallback);
    window.addEventListener('keydown', this.windowKeydownCloseModalHandler);
  }

  public detachEvents(): void {
    this.modalOverlay.removeEventListener('click', this.onOverlayClick);
    this.modalContent.removeEventListener('click', this.onContentClick);

    window.removeEventListener('keydown', this.onWindowKeydownCallback);
    window.removeEventListener('keydown', this.windowKeydownCloseModalHandler);
  }

  private onOverlayClick = (e: MouseEvent): void => {
    this.notify(ModalActions.OverlayClick);
  };

  private onContentClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  private windowKeydownCloseModalHandler = (e: KeyboardEvent): void => {
    if (e.key.toLowerCase() === 'escape') {
      this.close();
    }
  };

  protected abstract onWindowKeydownCallback(e: KeyboardEvent): void;
}
