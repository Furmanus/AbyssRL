/**
 * Created by Docent Furman on 16.07.2017.
 */

import {LevelModel} from './level_model.js';

/**
 * Class representing single dungeon.
 */
export class DungeonModel {

    /**
     * Constructor method for dungeon.
     * @constructor
     * @typedef DungeonModel
     * @param {string} type             DungeonModel type (main dungeon or some branches).
     * @param {number} maxLevelNumber   How many levels this dungeon or branch contains.
     */
    constructor (type, maxLevelNumber) {

        this.type = type; //string determining type of dungeon
        this.maxLevelNumber = maxLevelNumber; //number determining number of dungeon levels (how deep it is)
    }
}