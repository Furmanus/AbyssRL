import { Controller } from './controller';
import { ModalView } from '../view/modal_view';
import { ModalActions } from '../constants/game_actions';

export class ModalController<
  M,
  V extends ModalView = ModalView,
> extends Controller {
  protected currentContent: M;
  protected view: V;
  protected isModalOpen: boolean = false;

  public openModal(content?: M): void {
    this.currentContent = content;
    this.isModalOpen = true;
    this.view.open();

    this.attachEvents();
  }

  public closeModal(): void {
    this.isModalOpen = false;
    this.view.close();

    this.detachEvents();
  }

  public drawContentInView<E extends HTMLElement = HTMLElement>(
    content: E,
  ): void {
    this.view.drawContent(content);
  }

  public isOpen(): boolean {
    return this.isModalOpen;
  }

  public clearContentInView(): void {
    this.view.clearContent();
  }

  protected attachEvents(): void {
    this.view.on(this, ModalActions.OverlayClick, this.onOverlayClick);
    this.view.on(this, ModalActions.OpenModal, this.onModalOpen);
  }

  protected detachEvents(): void {
    this.view.off(this, ModalActions.OverlayClick);
    this.view.off(this, ModalActions.OpenModal);
  }

  private onOverlayClick = (): void => {
    this.closeModal();
    this.notify(ModalActions.CloseModal);
  };

  private onModalOpen = (): void => {
    this.notify(ModalActions.OpenModal);
  };
}
