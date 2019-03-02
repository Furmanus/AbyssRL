import {MessagesView} from '../view/messages_view';
import {config} from '../global/config';
import {Observer} from '../core/observer';

let instance: MessagesController;

export class MessagesController extends Observer {
    private view: MessagesView;
    constructor() {
        super();

        this.view = new MessagesView(
            config.TILE_SIZE * config.ROWS,
            config.SCREEN_HEIGHT - config.TILE_SIZE * config.COLUMNS - 40,
        );

        instance = this;
    }
    /**
     * Method responsible for changing size of info screen.
     * @param   newWidth        New width of info screen.
     * @param   newHeight       New height of info screen.
     */
    public changeMessageScreenSize(newWidth: number, newHeight: number): void {
        this.view.changeSize(newWidth, newHeight);
    }
    /**
     * Displays given message in view.
     * @param {string}  message     Message to display.
     */
    public showMessageInView(message: string): void {
        if (message) {
            this.view.addMessage(message);
        }
    }
    public static getInstance(): MessagesController {
        if (instance) {
            return instance;
        }
        return new MessagesController();
    }
}
