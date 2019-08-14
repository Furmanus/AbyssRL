import {Constructor} from '../core/constructor';
import {ModalActions} from '../constants/game_actions';

/**
 * Class describing view of global application modal.
 */
export class ModalView extends Constructor {
    private modalWrapper: HTMLDivElement;
    private modalContent: HTMLDivElement;
    private modalOverlay: HTMLDivElement;

    public constructor() {
        super();
        this.modalWrapper = document.getElementById('modal-wrapper') as HTMLDivElement;
        this.modalContent = document.getElementById('modal-content') as HTMLDivElement;
        this.modalOverlay = document.getElementById('modal-wrapper') as HTMLDivElement;

        this.attachEvents();
    }
    public open(): void {
        this.modalWrapper.classList.remove('hidden');
        this.notify(ModalActions.OPEN_MODAL);
    }
    public close(): void {
        this.modalWrapper.classList.add('hidden');
    }
    private attachEvents(): void {
        this.modalOverlay.addEventListener('click', () => {
            this.notify(ModalActions.OVERLAY_CLICK);
        });
    }
}
