import { BaseController } from '../core/base.controller';
import { ModalView } from './modal.view';
import { ModalActions } from '../main/constants/gameActions.constants';
import { gameEventBus } from '../eventBus/gameEventBus/gameEventBus';
import { GameEventBusEventNames } from '../eventBus/gameEventBus/gameEventBus.constants';

export class ModalController<
  M,
  V extends ModalView = ModalView,
> extends BaseController {
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
    this.view.on(this, ModalActions.OverlayClick, this.onOverlayClick);
    this.view.on(this, ModalActions.OpenModal, this.onModalOpen);
    this.view.on(this, ModalActions.CloseModal, this.onModalClose);
  }

  protected detachEvents(): void {
    this.view.off(this, ModalActions.OverlayClick);
    this.view.off(this, ModalActions.OpenModal);
    this.view.off(this, ModalActions.CloseModal);
  }

  private onOverlayClick(): void {
    this.closeModal();
  }

  private onModalOpen(): void {
    gameEventBus.publish(GameEventBusEventNames.ModalOpen);
  }

  private onModalClose(): void {
    this.isModalOpen = false;

    this.detachEvents();

    gameEventBus.publish(GameEventBusEventNames.ModalClose);
  }
}
