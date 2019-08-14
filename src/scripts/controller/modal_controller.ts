import {Controller} from './controller';
import {ModalView} from '../view/modal_view';
import {ModalActions} from '../constants/game_actions';

export class ModalController extends Controller {
    private view: ModalView;
    private isModalOpen: boolean = false;

    public constructor() {
        super();

        this.view = new ModalView();

        this.attachEvents();
    }
    public openModal(): void {
        this.isModalOpen = true;
        this.view.open();
    }
    public closeModal(): void {
        this.isModalOpen = false;
        this.view.close();
    }
    public isOpen(): boolean {
        return this.isModalOpen;
    }
    private attachEvents(): void {
        this.view.on(this, ModalActions.OVERLAY_CLICK, () => {
            this.closeModal();
            this.notify(ModalActions.CLOSE_MODAL);
        });
        this.view.on(this, ModalActions.OPEN_MODAL, () => {
            this.notify(ModalActions.OPEN_MODAL);
        });
    }
}
