/**
 * Created by Docent Furman on 16.07.2017.
 */

import {Cell} from './cell_model.js';
import Utility from '../../helper/utility.js';
import {config} from '../../global/config';

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
        this.cells = null; //2D array containing Cell objects.

        this.createCells();
    }

    /**
     * Method responsible for initializing level with {@code Cell} objects. Initially creates level filled with walls.
     */
    createCells(){

        this.cells = new Array(config.LEVEL_WIDTH);

        for(let i=0; i<this.cells.length; i++){

            this.cells[i] = new Array(config.LEVEL_HEIGHT);

            for(let j=0; j<this.cells[i].length; j++){

                if(i === 0 || j === 0 || i === this.cells.length - 1 || j === this.cells[i].length - 1){

                    this.cells[i][j] = new Cell(i, j, "high_peaks");
                }else{

                    this.cells[i][j] = new Cell(i, j, "mountain");
                }
            }
        }
    }
    /**
     * Method responsible for verification whether certain level cell is a part of a room(array property of {@code rooms} of {@code LevelModel} object).
     * @param {number} x - row(horizontal) coordinate of cell.
     * @param {number} y - column(vertical) coordinate of cell.
     * @return {boolean} Returns true if cell is a part of a room, returns false otherwise.
     */
    isCellInRoom(x, y){

        for(let i=0; i<this.rooms.length; i++){

            if(this.rooms[i].type === 'rectangle' && x >= this.rooms[i].x && x <= this.rooms[i].x + this.rooms[i].width - 1 && y >= this.rooms[i].y && y <= this.rooms[i].y + this.rooms[i].height - 1){

                return true;
            }else if(this.rooms[i].type === 'circle' && Utility.getDistance(x, y, this.rooms[i].x, this.rooms[i].y) < this.rooms[i].radius){

                return true;
            }else if(this.rooms[i].type === 'irregular'){

                for(let j=0; j<this.rooms[i].data.border.length; j++){

                    if(this.rooms[i].data.border[j].x === x && this.rooms[i].data.border[j].y === y){

                        return true;
                    }
                }

                for(let j=0; j<this.rooms[i].data.interior.length; j++){

                    if(this.rooms[i].data.interior[j].x === x && this.rooms[i].data.interior[j].y === y){

                        return true;
                    }
                }

                return false;
            }
        }

        return false;
    }
    /**
     * Returns cell at given coordinates.
     * @param {number}  x
     * @param {number}  y
     * @returns {Cell}
     */
    getCell(x, y){
        return this.cells[x][y];
    }
}