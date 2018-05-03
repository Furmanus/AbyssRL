/**
 * Created by Docent Furman on 16.07.2017.
 */

import {Cell} from './cells/cell_model.js';
import Utility from '../../helper/utility.js';
import {config as globalConfig} from '../../global/config';
import {cellTypes} from '../../constants/cell_types';
import {CellModelFactory} from '../../factory/cell_model_factory';

/**
 * Class representing single dungeon level. Contains level map which consist {@code Cell} objects.
 */
export class LevelModel{

    /**
     * Object representing single dungeon level.
     * @typedef LevelModel
     * @constructor
     * @param {DungeonModel} branch - object to which this level belongs.
     * @param {number} levelNumber - number of this dungeon level.
     */
    constructor(branch, levelNumber){
        this.branch = branch;
        this.levelNumber = levelNumber;
        this.rooms = [];
        this.cells = new Map();

        this.createCells();
    }

    /**
     * Method responsible for initializing level with {@code Cell} objects. Initially creates level filled with walls.
     */
    createCells(){
        for(let i=0; i<globalConfig.LEVEL_WIDTH; i++){
            for(let j=0; j<globalConfig.LEVEL_HEIGHT; j++){
                this.cells.set(`${i}x${j}`, CellModelFactory.getHighPeaksWallModel(i, j));
            }
        }
    }
    changeCellType(x, y, type){
        this.cells.set(`${x}x${y}`, CellModelFactory.getCellModel(x, y, type));
    }
    /**
     * Returns cell at given coordinates.
     * @param {number}  x
     * @param {number}  y
     * @returns {Cell}
     */
    getCell(x, y){
        return this.cells.get(`${x}x${y}`);
    }
    /**
     * Returns map object containing level cells.
     * @returns {Map}
     */
    getCells(){
        return this.cells;
    }
}