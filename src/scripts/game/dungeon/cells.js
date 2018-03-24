/**
 * Created by Docent Furman on 16.07.2017.
 */

import ROT from './../../../../libraries/rot.min.js';
import cellTypes from './cell-data.js';

/**
 * Class representing single map square(field).
 */
export class Cell{

    /**
     * Initializes cell and fills it with data. Data are imported from {@code cellTypes} object, where constructor parameter is used as key.
     * @constructor
     * @typedef Cell
     * @param {string} type - key from {@code cellTypes} object. Through this key method can access various data about certain square field.
     */
    constructor(type){

        if(!type) throw new Error("Cell type is not defined!");
        if(!cellTypes[type]) throw new Error("Illegal cell type");

        //copy data for certain field from cellTypes object.
        this.type = type;
        this.display = cellTypes[this.type].display.random();
        this.blockMovement = cellTypes[this.type].blockMovement;
        this.blockLos = cellTypes[this.type].blockLos;
        this.description = cellTypes[this.type].description;
        this.key = cellTypes[this.type].key;

        this.animationFrame = 1; //frame currently displayed on view
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
        this.blockLos = cellTypes[this.type].blockLos;
        this.description = cellTypes[this.type].description;
        this.key = cellTypes[this.type].key;
    }
}