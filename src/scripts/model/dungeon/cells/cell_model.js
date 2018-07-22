/**
 * Created by Docent Furman on 16.07.2017.
 */

/**
 * Class representing single map square(field).
 */
export class Cell {
    /**
     * Initializes cell and fills it with data. Data are imported from {@code cellTypes} object, where constructor parameter is used as key.
     * @constructor
     * @typedef Cell
     * @abstract
     * @param {number}  x       Horizontal position on level grid.
     * @param {number}  y       Vertical position on level grid.
     */
    constructor (x, y) {
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
    }
    /**
     * Resets value entity field of cell model instance (sets it to null).
     */
    clearEntity () {
        this.entity = null;
    }
    /**
     * Sets value of entity field of cell model instance.
     * @param {EntityModel}  entity      Any entity model instance.
     */
    setEntity (entity) {
        this.entity = entity;
    }
    /**
     * Enables possibility to change cell display.
     */
    enableDisplayChange () {
        this.preventDisplayChange = false;
    }
    /**
     * Disables possibility to change cell display.
     */
    disableDisplayChange () {
        this.preventDisplayChange = true;
    }
    /**
     * Changes display of cell.
     *
     * @param {Array.<{string}>}     tiles   Array of new tiles names.
     */
    changeDisplay (tiles) {
        if(!this.preventDisplayChange) {
            this.display = tiles;
        }
    }
    /**
     * Effect from certain cell while entity walks over it. Default function is below empty function. Can be implemented
     * in child classes.
     *
     * @param {EntityModel}     entity      Model of entity which walks over cell.
     */
    walkEffect (entity) {
    }
    /**
     * Method triggered when certain entity (usually player) tries to walk on cell. Default function is below empty
     * function. Can be implemented in child classes.
     *
     * @param {EntityModel}     entity      Model of entity which attempts to walk over cell.
     */
    walkAttempt (entity) {
    }
}