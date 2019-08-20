import {Constructor} from '../core/constructor';
import {ModalActions} from '../constants/game_actions';
import {clearElement} from '../helper/dom_helper';
import autobind from 'autobind-decorator';

/**
 * Class describing view of global application modal.
 */
export class ModalView extends Constructor {
    protected modalWrapper: HTMLDivElement;
    protected modalContent: HTMLDivElement;
    protected modalOverlay: HTMLDivElement;

    public constructor() {
        super();
        this.modalWrapper = document.getElementById('modal-wrapper') as HTMLDivElement;
        this.modalContent = document.getElementById('modal-content') as HTMLDivElement;
        this.modalOverlay = document.getElementById('modal-wrapper') as HTMLDivElement;
    }
    public open(): void {
        this.modalWrapper.classList.remove('hidden');
        this.notify(ModalActions.OPEN_MODAL);
    }
    public close(): void {
        this.modalWrapper.classList.add('hidden');
        this.detachEvents();
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
    }
    private detachEvents(): void {
        this.modalOverlay.removeEventListener('click', this.onOverlayClick);
        this.modalContent.removeEventListener('click', this.onContentClick);
    }
    @autobind
    private onOverlayClick(e: MouseEvent): void {
        this.notify(ModalActions.OVERLAY_CLICK);
    }
    private onContentClick(e: MouseEvent): void {
        e.stopPropagation();
    }
}
