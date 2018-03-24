/**
 * Created by Docent Furman on 16.07.2017.
 */

import {Level} from './level.js';

/**
 * Class representing single dungeon.
 */
export class Dungeon{

    /**
     * Constructor method for dungeon.
     * @constructor
     * @typedef Dungeon
     * @param {string} type - dungeon type (main dungeon or some branches).
     * @param {number} maxLevelNumber - how many levels this dungeon or branch contains.
     */
    constructor(type = 'main', maxLevelNumber = 8){

        this.type = type; //string determining type of dungeon
        this.maxLevelNumber = maxLevelNumber; //number determining number of dungeon levels (how deep it is)
        this.levels = {}; //stores all Level objects (dungeon levels). Key is equal to level number.

        this.init();
    }

    init(){

        this.levels[1] = new Level(this, 1);
    }
}