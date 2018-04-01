import {entities} from '../../constants/sprites';
import {Observer} from '../../core/observer';

export class EntityModel extends Observer{

    constructor(config){
        super();

        /**
         * Visible sprite of entity. Member of file constants/sprites.js.
         * @type {string}
         */
        this.display = config.display;
        /**
         * Cell model where entity is.
         * @type {Cell}
         */
        this.position = config.position;
        /**
         * Cell model where entity was in last turn.
         * @type {Cell}
         */
        this.lastVisitedCell = config.lastVisitedCell || undefined;
        /**
         * Speed statistic of entity.
         * @type {number}
         */
        this.speed = config.speed;
    }
    /**
     *
     * @param {Cell}    newCell     New cell which entity will occupy.
     */
    changePosition(newCell){
        this.position = newCell;
    }
    /**
     *
     * @returns {number}
     */
    getSpeed(){
        return this.speed;
    }
}