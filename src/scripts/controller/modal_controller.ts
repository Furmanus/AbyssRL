import {Controller} from './controller';
import {ModalView} from '../view/modal_view';
import {ModalActions} from '../constants/game_actions';

export class ModalController<M, V extends ModalView = ModalView> extends Controller {
    protected currentContent: M;
    protected view: V;
    protected isModalOpen: boolean = false;

    public openModal(content: M): void {
        this.currentContent = content;
        this.isModalOpen = true;
        this.view.open();
    }
    public closeModal(): void {
        this.isModalOpen = false;
        this.view.close();
    }
    public drawContentInView<E extends HTMLElement = HTMLElement>(content: E): void {
        this.view.drawContent(content);
    }
    public isOpen(): boolean {
        return this.isModalOpen;
    }
    public clearContentInView(): void {
        this.view.clearContent();
    }
    protected attachEvents(): void {
        this.view.on(this, ModalActions.OVERLAY_CLICK, () => {
            this.closeModal();
            this.notify(ModalActions.CLOSE_MODAL);
        });
        this.view.on(this, ModalActions.OPEN_MODAL, () => {
            this.notify(ModalActions.OPEN_MODAL);
        });
    }
}
