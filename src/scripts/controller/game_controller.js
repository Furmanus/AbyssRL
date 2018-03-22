/**
 * Class representing main game controller. GameController is responsible for taking input from user and manipulating game model and view in appriopiate way.
 */
export class GameController{

    /**
     * GameController class constructor.
     * @param {Info} infoScreen - {@code Info} object representing part of view with informations about player and map.
     * @param {Map} mapScreen - {@code Map} object representing part of view with minimap.
     * @param {Messages} messagesScreen - {@code Messages} object representing part of view with messages.
     * @param {GameView} gameScreen - {@code GameView} object representing main game view.
     * @constructor
     */
    constructor(infoScreen, mapScreen, messagesScreen, gameScreen){

        this.infoScreen = infoScreen;
        this.mapScreen = mapScreen;
        this.messagesScreen = messagesScreen;
        this.gameScreen = gameScreen;
        this.shiftPressed = false;
        this.controlPressed = false;
        this.altPressed = false;

        window.addEventListener('keydown', this._registerKeyPressed.bind(this));  //register key pressed
        window.addEventListener('keyup', this._registerKeyReleased.bind(this)); //register key released
    }

    /**
     * Method responsible for triggering appriopiate method in response for user input.
     * @param {Number} keycode - Pressed by user key keycode. Keycode comes from {@code KeyboardEvent.which} field.
     * @private
     */
    _takeAction(keycode){

        if(this.shiftPressed){

            if(directions[keycode]){

                this._moveCamera(keycode); //shift + numpad direction, move camera around
            }
        }else if(this.controlPressed){


        }else if(this.altPressed){


        }else{


        }
    }

    /**
     * Method responsible for registering user keyboard input and triggering {@code _takeAction} method. Method checks whether key pressed is either shift, alt or control. If it is, it
     * modify appriopiate flag. Otherwise it takes key keycode and passes it to {@code _takeAction} method.
     * @param {KeyboardEvent} e - event which triggered this method.
     * @private
     */
    _registerKeyPressed(e){

        e.preventDefault();

        if(e.which === 16){

            this.shiftPressed = true;
        }else if(e.which === 17){

            this.controlPressed = true;
        }else if(e.which === 18){

            this.altPressed = true;
        }else{

            this._takeAction(e.which);
        }
    }

    /**
     * Method responsible for registering user releasing key pressed. Changes boolean flag if key pressed was either shift, alt or control.
     * @param {KeyboardEvent} e - event which triggered this method.
     * @private
     */
    _registerKeyReleased(e){

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
     * Method responsible for moving camera.
     * @param {KeyboardEvent} keycode - keycode of key pressed by user. Method accepts only arror keys or numpad keys (with exception of '5').
     * @private
     */
    _moveCamera(keycode){

        this.gameScreen.camera.moveCamera(directions[keycode].x * 4, directions[keycode].y * 4);
        this.gameScreen.refreshScreen();
    }
}

let directions = {

    103: {x: -1, y: -1},
    104: {x: 0, y: -1},
    105: {x: 1, y: -1},
    102: {x: 1, y: 0},
    99: {x: 1, y: 1},
    98: {x: 0, y: 1},
    97: {x: -1, y: 1},
    100: {x: -1, y: 0},
    36: {x: -1, y: -1},
    38: {x: 0, y: -1},
    33: {x: 1, y: -1},
    39: {x: 1, y: 0},
    34: {x: 1, y: 1},
    40: {x: 0, y: 1},
    35: {x: -1, y: 1},
    37: {x: -1, y: 0},
};