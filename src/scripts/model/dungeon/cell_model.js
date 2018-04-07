/**
 * Created by Docent Furman on 16.07.2017.
 */
import cellTypes from './cell-data.js';

/**
 * Class representing single map square(field).
 */
export class Cell{

    /**
     * Initializes cell and fills it with data. Data are imported from {@code cellTypes} object, where constructor parameter is used as key.
     * @constructor
     * @typedef Cell
     * @param {number}  x       Horizontal position on level grid.
     * @param {number}  y       Vertical position on level grid.
     * @param {string}  type    Key from {@code cellTypes} object. Through this key method can access various data about certain square field.
     */
    constructor(x, y, type){

        if(!type){
            throw new Error("Cell type is not defined!");
        }
        if(!cellTypes[type]){
            throw new Error("Illegal cell type");
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

        //copy data for certain field from cellTypes object.
        this.type = type;
        /**
         * Sprite (animated or not) to draw in view.
         * @type {string}
         */
        this.display = cellTypes[this.type].display.random();
        /**
         * Should cell block movement.
         * @type {boolean}
         */
        this.blockMovement = cellTypes[this.type].blockMovement;
        /**
         * Should player confirm his movement into this cell.
         * @type {boolean}
         */
        this.confirmMovement = cellTypes[this.type].confirmMovement;
        /**
         * Should cell block line of sight.
         * @type {boolean}
         */
        this.blockLos = cellTypes[this.type].blockLos;
        /**
         * Description of cell to display in view.
         * @type {string}
         */
        this.description = cellTypes[this.type].description;
        /**
         * @type {string}
         */
        this.key = cellTypes[this.type].key;
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
    }

    /**
     * Method responsible from changing one square field type to another.
     * @param {string} type - field name we to change this square to.
     */
    changeCellType(type){

        if(!type) throw new Error("Cell type is not defined!");
        if(!cellTypes[type]) throw new Error("Illegal cell type");

        this.type = type;
        this.display = cellTypes[this.type].display.random();
        this.blockMovement = cellTypes[this.type].blockMovement;
        this.confirmMovement = cellTypes[this.type].confirmMovement;
        this.blockLos = cellTypes[this.type].blockLos;
        this.description = cellTypes[this.type].description;
        this.key = cellTypes[this.type].key;
    }
    /**
     * Resets value entity field of cell model instance (sets it to null).
     */
    clearEntity(){
        this.entity = null;
    }
    /**
     * Sets value of entity field of cell model instance.
     * @param {EntityModel}  entity      Any entity model instance.
     */
    setEntity(entity){
        this.entity = entity;
    }
}