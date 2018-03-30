import {MessagesView} from '../view/messages_view';
import {config} from '../global/config';
import {Observer} from '../core/observer';

export class MessagesController extends Observer{

    constructor(){
        super();

        this.view = new MessagesView(
            config.TILE_SIZE * config.ROWS,
            config.SCREEN_HEIGHT - config.TILE_SIZE * config.COLUMNS - 40
        );
    }
    /**
     * Method responsible for changing size of info screen.
     * @param {number}  newWidth        New width of info screen.
     * @param {number}  newHeight       New height of info screen.
     */
    changeMessageScreenSize(newWidth, newHeight){
        this.view.changeSize(newWidth, newHeight);
    }
    /**
     * Displays given message in view.
     * @param {string}  message     Message to display.
     */
    showMessageInView(message){
        this.view.addMessage(message);
    }
}