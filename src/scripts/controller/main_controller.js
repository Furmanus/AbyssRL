/**
 * Main controller. Responsible for taking user keyboard input, processing it, and triggering appriopiate methods from other sub controllers. Also responsible for managing all
 * sub controllers.
 */
import {GameController} from './game_controller';
import {InfoController} from './info_controller';
import {MiniMapController} from './minimap_controller';
import {MessagesController} from './messages_controller';
import {Observer} from '../core/observer';
import {KEYBOARD_DIRECTIONS} from '../constants/keyboard_directions';
import {config} from '../global/config';
import {
    PLAYER_ACTION_MOVE_PLAYER,
    PLAYER_WALK_CONFIRM_NEEDED,
    SHOW_MESSAGE_IN_VIEW
} from '../constants/player_actions';

export class MainController extends Observer{

    /**
     * Constructor of main application controller.
     * @param {HTMLImageElement}  tileset  HTML Img element with tiles to draw.
     */
    constructor(tileset){
        super();

        this.gameController = new GameController(tileset);
        this.infoController = new InfoController();
        this.miniMapController = new MiniMapController();
        this.messagesController = new MessagesController();

        this.shiftPressed = false;
        this.controlPressed = false;
        this.altPressed = false;

        this.controllerInitialized = false;

        this.initialize();
    }
    /**
     * Method responsible for initialization of main controller.
     */
    initialize(){
        this.bindMethods();
        this.attachEvents();

        this.controllerInitialized = true;
    }
    /**
     * Method responsible for binding methods to main controller object. Methods has to be bound here, because in certain circumstances event listeners to which those
     * function are callbacks are removed from appriopiate objects.
     */
    bindMethods(){
        this.registerKeyPressed = this.registerKeyPressed.bind(this);
        this.registerKeyReleased = this.registerKeyReleased.bind(this);
        this.onResizeWindow = this.onResizeWindow.bind(this);

        this.onShowMessageInView = this.onShowMessageInView.bind(this);
        this.onPlayerConfirmNeeded = this.onPlayerConfirmNeeded.bind(this);
    }
    /**
     * Method responsible for attaching keyboard events to window.
     */
    attachEvents(){

        window.addEventListener('keydown', this.registerKeyPressed);  //register key pressed
        window.addEventListener('keyup', this.registerKeyReleased); //register key released

        if(!this.controllerInitialized) {
            window.addEventListener('resize', this.onResizeWindow);
        }

        this.gameController.on(this, SHOW_MESSAGE_IN_VIEW, this.onShowMessageInView);
        this.gameController.on(this, PLAYER_WALK_CONFIRM_NEEDED, this.onPlayerConfirmNeeded);
    }
    /**
     * Method responsible for removing keyboard events from window and listening to object notifying.
     */
    detachEvents(){
        window.removeEventListener('keydown', this.registerKeyPressed);  //register key pressed
        window.removeEventListener('keyup', this.registerKeyReleased); //register key released

        this.gameController.off(this, SHOW_MESSAGE_IN_VIEW);
        this.gameController.off(this, PLAYER_WALK_CONFIRM_NEEDED);
    }
    /**
     * Method responsible for registering user keyboard input and triggering {@code takeAction} method. Method checks whether key pressed is either shift, alt or control. If it is, it
     * modify appriopiate flag. Otherwise it takes key keycode and passes it to {@code takeAction} method.
     * @param {KeyboardEvent} e - event which triggered this method.
     * @private
     */
    registerKeyPressed(e){

        e.preventDefault();

        if(e.which === 16){
            this.shiftPressed = true;
        }else if(e.which === 17){
            this.controlPressed = true;
        }else if(e.which === 18){
            this.altPressed = true;
        }else{
            this.takeAction(e.which);
        }
    }
    /**
     * Method responsible for registering user releasing key pressed. Changes boolean flag if key pressed was either shift, alt or control.
     * @param {KeyboardEvent} e - event which triggered this method.
     * @private
     */
    registerKeyReleased(e){

        e.preventDefault();

        if(e.which === 16){
            this.shiftPressed = false;
        }else if(e.which === 17){
            this.controlPressed = false;
        }else if(e.which === 18){
            this.altPressed = false;
        }
    }
    /**
     * Method responsible for triggering appriopiate method in response for user input.
     * @param {Number} keycode - Pressed by user key keycode. Keycode comes from {@code KeyboardEvent.which} field.
     */
    takeAction(keycode){

        if(this.shiftPressed){

            if(KEYBOARD_DIRECTIONS[keycode]){

                this.moveCamera(keycode); //shift + numpad direction, move camera around
            }
        }else if(this.controlPressed){

        }else if(this.altPressed){

        }else{

            if(KEYBOARD_DIRECTIONS[keycode]){
                this.gameController.takePlayerAction(PLAYER_ACTION_MOVE_PLAYER, KEYBOARD_DIRECTIONS[keycode]);
            }
        }
    }
    /**
     * Method responsible for moving camera in view.
     * @param {KeyboardEvent} keycode - keycode of key pressed by user. Method accepts only arror keys or numpad keys (with exception of '5').
     */
    moveCamera(keycode){
        const deltaX = KEYBOARD_DIRECTIONS[keycode].x * 4;
        const deltaY = KEYBOARD_DIRECTIONS[keycode].y * 4;

        this.gameController.moveCameraInView(deltaX, deltaY)
    }
    /**
     * Function responsible for resizing game window size and all other canvas/divs(messages, info and map) whenever browser window is resized.
     * Game window should be always about 2/3 and 3/4 of window width/height.
     */
    onResizeWindow(){
        const windowInnerWidth = window.innerWidth;
        const windowInnerHeight = window.innerHeight;
        //we calculate new game window size. Game window should be approximately 3/4 of view size
        let x = Math.floor(windowInnerWidth * 2 / 3);
        let y = Math.floor(windowInnerHeight * 3 / 4);

        //we make sure that new game window size dimensions are multiplication of tile size
        x = x - (x % config.TILE_SIZE);
        y = y - (y % config.TILE_SIZE);

        this.gameController.changeGameScreenInView(x, y);
        this.infoController.changeInfoScreenSize(windowInnerWidth - x - 30, y);
        this.messagesController.changeMessageScreenSize(x, windowInnerHeight - y - 40);
        this.miniMapController.changeMinimapSize(windowInnerWidth - x - 30, windowInnerHeight - y - 40);
    }
    /**
     * Method triggered after game controller notifies that message has to be shown in messages view.
     * @param {string}  message     Message to display.
     */
    onShowMessageInView(message){
        this.messagesController.showMessageInView(message);
    }
    /**
     * Method triggered after game controller notifies about needed certain action confirmation from player.
     * @param {Object}      data            Object with data about confirmation.
     * @param {string}      data.message    Confirmation message to display.
     * @param {function}    data.confirm    Function triggered after player confirms move.
     * @param {function}    data.decline    Function triggered after player declines move.
     */
    onPlayerConfirmNeeded(data){
        const attachEventsFunction = this.attachEvents.bind(this);

        this.detachEvents();

        this.messagesController.showMessageInView(data.message);
        window.addEventListener('keydown', userActionConfirmEventListener);

        function userActionConfirmEventListener(e){
            e.preventDefault();

            if(e.which === 89){
                data.confirm();

                window.removeEventListener('keydown', userActionConfirmEventListener);
                attachEventsFunction();
            }else if(e.which === 78 || e.which === 32 || e.which === 27){
                data.decline();

                window.removeEventListener('keydown', userActionConfirmEventListener);
                attachEventsFunction();
            }
        }
    }
}