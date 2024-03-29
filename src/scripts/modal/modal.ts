import { ModalView } from './modal.view';
import { ModalActions } from '../main/constants/gameActions.constants';
import { gameEventBus } from '../eventBus/gameEventBus/gameEventBus';
import { GameEventBusEventNames } from '../eventBus/gameEventBus/gameEventBus.constants';
import { Observer } from '../core/observer';

export class Modal<M, V extends ModalView = ModalView> extends Observer {
  protected currentContent: M;
  protected view: V;
  protected isModalOpen: boolean = false;

  public openModal(content?: M): void {
    this.currentContent = content;
    this.isModalOpen = true;

    this.attachEvents();

    this.view.open();
  }

  public closeModal(): void {
    this.view.close();
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
    this.view.on(ModalActions.OverlayClick, this.onOverlayClick);
    this.view.on(ModalActions.OpenModal, this.onModalOpen);
    this.view.on(ModalActions.CloseModal, this.onModalClose);
  }

  protected detachEvents(): void {
    this.view.off(ModalActions.OverlayClick);
    this.view.off(ModalActions.OpenModal);
    this.view.off(ModalActions.CloseModal);
  }

  private onOverlayClick = (): void => {
    this.closeModal();
  }

  private onModalOpen = (): void => {
    gameEventBus.publish(GameEventBusEventNames.ModalOpen);
  }

  private onModalClose = (): void => {
    this.isModalOpen = false;

    this.detachEvents();

    gameEventBus.publish(GameEventBusEventNames.ModalClose);
  }
}
