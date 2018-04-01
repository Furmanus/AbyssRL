import {EntityController} from './entity_controller';
import {Utility} from "../../helper/utility";
import {config} from "../../global/config";
import {
    END_PLAYER_TURN,
    PLAYER_WALK_CONFIRM_NEEDED,
    START_PLAYER_TURN
} from '../../constants/player_actions';
import {PlayerModel} from '../../model/entity/player_model';

export class PlayerController extends EntityController{
    /**
     * Constructor for player controller.
     * @param {Object}  config              Object with data for creating model and controller.
     * @param {string}  config.display      Name of sprite visible on game screen.
     * @param {Cell}    config.position     Starting player position.
     * @constructor
     */
    constructor(config){
        super(config);
        /**@type {PlayerModel}*/
        this.model = new PlayerModel(config);
    }
    /**
     * Method triggered at beginning of each player turn.
     */
    act(){
        this.notify(START_PLAYER_TURN);
    }
    /**
     * Method responsible for attempting to move player into target cell. A little bit magic happens here: function returns a promise. If movement is instantly possible or
     * not possible, promise is resolved immediately. If confirmation from player is needed, game controller is notified about that. Along with notification, two
     * functions are passed. First is callback function triggered when player confirms movement, second is triggered when player rejects movement attempt. Both those
     * functions inside calls promise resolve function.
     * @param {Cell}    newCell     New target cell object.
     * @returns {Promise<Object>}   Returns promise. Resolved promise returns object with data with information whether move is allowed and movement message.
     */
    move(newCell){
        const {
            x,
            y
        } = newCell;
        const playerController = this;
        /**
         * Move function from entity class bound to this player controller instance.
         * @type {function}
         */
        const entityMoveFunction = super.move.bind(this);
        const playerModel = this.model;

        if(x < 0 || y < 0 || x > config.LEVEL_WIDTH - 1 || y > config.LEVEL_HEIGHT - 1){
            throw new Error('Entity moved beyond level grid');
        }

        return new Promise(function(resolve) {
            if (newCell.blockMovement) {
                resolve({
                    canMove: false,
                    message: `${Utility.capitalizeString(newCell.description)} is blocking your way.`,
                });
            } else if (newCell.confirmMovement) {
                if(newCell.type === playerModel.position.type){
                    entityMoveFunction(newCell);
                    playerController.notify(END_PLAYER_TURN); // player successfully moved, so we notify game controller to end turn

                    resolve({
                        canMove: true,
                        message: ''
                    });
                }else {
                    /**
                     * Magic part: promise is not resolved here, instead game controller is notified about needed movement confirmation from player. Along with
                     * notification object is passed with two functions. One function is called after player confirms movement, other when player rejects. Both
                     * function calls promise resolve.
                     */
                    playerController.notify(PLAYER_WALK_CONFIRM_NEEDED, {
                        message: `Do you really want to walk into ${newCell.description}? (y/n)`,
                        confirm: () => {
                            entityMoveFunction(newCell);
                            playerController.notify(END_PLAYER_TURN);

                            resolve({
                                canMove: true,
                                message: ''
                            });
                        },
                        decline: () => {
                            resolve({
                                canMove: false,
                                message: 'You abort your attempt.'
                            });
                        }
                    });
                }
            } else {
                entityMoveFunction(newCell);
                playerController.notify(END_PLAYER_TURN);

                resolve({
                    canMove: true,
                    message: ``
                });
            }
        });
    }
}