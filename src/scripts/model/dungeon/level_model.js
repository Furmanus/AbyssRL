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
export class LevelModel {
    /**
     * Object representing single dungeon level.
     * @typedef LevelModel
     * @constructor
     * @param {DungeonModel} branch             Object to which this level belongs
     * @param {number}      levelNumber         Number of this dungeon level
     */
    constructor (branch, levelNumber) {
        this.branch = branch;
        this.levelNumber = levelNumber;
        this.defaultWallType = null;
        this.rooms = [];
        this.roomConnections = new Set();
        this.cells = new Map();
    }
    /**
     * Initializes level model data.
     *
     * @param {string}  defaultWallType     Type of default wall of level
     */
    initialize(defaultWallType = cellTypes.HIGH_PEAKS) {
        this.defaultWallType = defaultWallType;

        this.createCells(defaultWallType);
    }
    /**
     * Method responsible for initializing level with {@code Cell} objects. Initially creates level filled with walls.
     */
    createCells () {
        const defaultWallType = this.defaultWallType;

        for(let i=0; i<globalConfig.LEVEL_WIDTH; i++){
            for(let j=0; j<globalConfig.LEVEL_HEIGHT; j++){
                this.cells.set(`${i}x${j}`, CellModelFactory.getCellModel(i, j, defaultWallType));
            }
        }
    }
    changeCellType (x, y, type) {
        this.cells.set(`${x}x${y}`, CellModelFactory.getCellModel(x, y, type));
    }
    /**
     * Method responsible for setting stairsUp field of level model.
     * @param {number}  x   Row
     * @param {number}  y   Column
     */
    setStairsUp (x, y) {
        this.stairsUp = {x, y};
    }
    /**
     * Returns stairs up location.
     * @returns {{x: number, y: number}|*}
     */
    getStairsUpLocation () {
        return this.stairsUp;
    }
    /**
     * Sets stairs down field location in level model.
     * @param {number}  x   Row
     * @param {number}  y   Column
     */
    setStairsDown (x, y) {
        this.stairsDown = {x, y};
    }
    /**
     * Returns location of stairs down.
     * @returns {{x: number, y: number}|*}
     */
    getStairsDownLocation () {
        return this.stairsDown;
    }
    /**
     * Returns cell at given coordinates.
     * @param {number}  x
     * @param {number}  y
     * @returns {Cell}
     */
    getCell (x, y) {
        return this.cells.get(`${x}x${y}`);
    }
    /**
     * Returns cell from given position object.
     * @param {Position}    position
     * @returns {Cell}
     */
    getCellFromPosition(position) {
        return this.cells.get(`${position.x}x${position.y}`);
    }
    /**
     * Returns map object containing level cells.
     * @returns {Map}
     */
    getCells () {
        return this.cells;
    }
    /**
     * Returns array of room model present in level.
     *
     * @returns {Array.<RoomModel>}
     */
    getRooms() {
        return this.rooms.length ? this.rooms : null;
    }
    /**
     * Sets array of level rooms.
     *
     * @param {Array.<RoomModel>}   rooms   Array of room models
     */
    setRooms(rooms) {
        this.rooms = rooms
    }
    /**
     * Adds model of room connection to roomConnections set.
     *
     * @param {RoomConnectionModel}     roomConnectionModel     Model of connection between rooms
     */
    addConnectionBetweenRooms(roomConnectionModel) {
        this.roomConnections.add(roomConnectionModel);
    }
    /**
     * Returns array of rooms which are in certain dungeon area.
     *
     * @param {DungeonAreaModel}    region      Region in which we are looking for rooms
     * @returns {Array.<RoomModel>}
     */
    getRoomsFromRegion(region) {
        const regionLeftTop = region.leftTop,
            regionRightBottom = region.rightBottom;

        return this.rooms.filter(room => {
            const xValid = room.left >= regionLeftTop.x && room.right <= regionRightBottom.x,
                yValid = room.top >= regionLeftTop.y && room.bottom <= regionRightBottom.y;

            return xValid && yValid;
        });
    }
    getNearestRoomFromRoom(sourceRoom) {
        let distance = Infinity,
            rooms = this.rooms,
            choosenRoom;

        for (let room of rooms) {
            if (room !== sourceRoom) {
                const dist = room.getDistanceFromRoom(sourceRoom);

                if (dist < distance) {
                    distance = dist;
                    choosenRoom = room;
                }
            }
        }

        return choosenRoom;
    }
}