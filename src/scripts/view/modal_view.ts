import { Constructor } from '../core/constructor';
import { ModalActions } from '../constants/game_actions';
import { clearElement } from '../helper/dom_helper';
import autobind from 'autobind-decorator';
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

    if (template) {
      this.template = ViewElementsBuilder.getInstance<TemplateElements>(
        template,
        variables,
      ).build();

      this.modalContent.appendChild(this.template.content);
    }
  }

  public open(): void {
    if (this.template) {
      this.modalContent.appendChild(this.template.content.cloneNode(true));
    }

    this.modalWrapper.classList.remove('hidden');
    this.notify(ModalActions.OpenModal);
  }

  public close(): void {
    this.modalWrapper.classList.add('hidden');
    this.detachEvents();
    this.clearContent();
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
  }

  public detachEvents(): void {
    this.modalOverlay.removeEventListener('click', this.onOverlayClick);
    this.modalContent.removeEventListener('click', this.onContentClick);

    window.removeEventListener('keydown', this.onWindowKeydownCallback);
  }

  private onOverlayClick = (e: MouseEvent): void => {
    this.notify(ModalActions.OverlayClick);
  };

  private onContentClick(e: MouseEvent): void {
    e.stopPropagation();
  }

  protected abstract onWindowKeydownCallback(e: KeyboardEvent): void;
}
