/**
 * Created by Docent Furman on 16.07.2017.
 */

import {WalkAttemptResult} from './walk_attempt_result';
import {Observer} from '../../../core/observer';
import {UseAttemptResult} from './use_attempt_result';
import {UseEffectResult} from './use_effect_result';

/**
 * Class representing single map square(field).
 */
export class Cell extends Observer{
    /**
     * Initializes cell and fills it with data. Data are imported from {@code cellTypes} object, where constructor parameter is used as key.
     * @constructor
     * @typedef Cell
     * @abstract
     * @param {number}  x       Horizontal position on level grid.
     * @param {number}  y       Vertical position on level grid.
     * @param {Object}  config  Object with additional configuration data.
     */
    constructor(x, y, config = {}) {
        super(...arguments);

        if(new.target){
            throw new Error('Can\'t create instance of abstract Cell class');
        }
        /**
         * Horizontal position on level grid.
         * @type {number}
         */
        this.x = x;
        /**
         * Vertical position on level grid.
         * @type {number}
         */
        this.y = y;
        /**
         * Entity (monster or player) occupying cell.
         * @type {EntityModel}
         */
        this.entity = null;
        /**
         * Array of items in cell.
         * @type {Array}
         */
        this.inventory = [];
        /**
         * Boolean variable indicating whether cells display can be changed or not.
         * @type {boolean}
         */
        this.preventDisplayChange = false;
        /**
         * Variable indicating if cell was discovered by player (used for purpose of drawing visited but not currently
         * visible cells)
         * @type {boolean}
         */
        this.wasDiscoveredByPlayer = false;
        /**
         * Whether confirmation from player is needed before entering cell.
         * @type {boolean}
         */
        this.confirmMovement = false;
        /**
         *
         * @type {string}
         */
        this.displaySet = null;
    }
    /**
     * Whether cell blocks entity movement.
     * @type {boolean}
     */
    get blockMovement() {
        return false;
    };
    /**
     * Whether cell blocks entities line of sight.
     * @returns {boolean}
     */
    get blocksLos() {
        return false;
    }
    /**
     * String pointing which sprite should be used as cell display. Must be implemented in sub classes.
     */
    get display() {
        throw new Error('Lack of implementation of display property');
    }
    /**
     * Message displayed when player walks over cell.
     * @type {string}
     */
    get walkMessage() {
        return '';
    }
    /**
     * Object with properties which are modified in entities who enters this cell.
     * @type {Object|null}
     */
    get modifiers() {
        return null;
    }
    /**
     * Resets value entity field of cell model instance (sets it to null).
     */
    clearEntity() {
        this.entity = null;
    }
    /**
     * Sets value of entity field of cell model instance.
     * @param {EntityModel}  entity      Any entity model instance.
     */
    setEntity(entity) {
        this.entity = entity;
    }
    /**
     * Enables possibility to change cell display.
     */
    enableDisplayChange() {
        this.preventDisplayChange = false;
    }
    /**
     * Disables possibility to change cell display.
     */
    disableDisplayChange() {
        this.preventDisplayChange = true;
    }
    /**
     * Changes display of cell.
     *
     * @param {Array.<{string}>}     tiles   Array of new tiles names.
     */
    changeDisplay(tiles) {
        if(!this.preventDisplayChange) {
            this.display = tiles;
        }
    }
    /**
     * Effect from certain cell while entity walks over it. Default function is below empty function. Can be implemented
     * in child classes.
     *
     * @param {EntityController}     entity      Model of entity which walks over cell
     */
    walkEffect(entity) {
    }
    /**
     * Method triggered when certain entity (usually player) tries to walk on cell. Default function is below empty
     * function. Can be implemented in child classes.
     *
     * @param {EntityController}     entity      Model of entity which attempts to walk over cell
     * @returns {WalkAttemptResult}
     */
    walkAttempt(entity) {
        return new WalkAttemptResult();
    }
    /**
     * Method triggered when certain entity (player included) uses cell. Default function, can be overriden in child
     * classes.
     *
     * @param {EntityController}     entity      Model of entity which uses cell
     * @returns {UseEffectResult}
     */
    useEffect(entity) {
        return new UseEffectResult(false, 'You can\'t activate that.');
    }
    /**
     * Method triggered when certain entity (usually player) tries to use cell. Default function, can be overriden in
     * child classes.
     *
     * @param {EntityController}     entity      Model of entity which attempts to use cell
     * @returns {UseAttemptResult}
     */
    useAttempt(entity) {
        return new UseAttemptResult();
    }
}