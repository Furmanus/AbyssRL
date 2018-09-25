import {config as globalConfig} from '../../global/config';
import {AbstractLevelGenerator} from './abstract_generator';
import {cellTypes} from '../../constants/cell_types';
import ROT from 'rot-js';
import {Position} from '../../model/position';

const singletonToken = Symbol('Dungeon level generator singleton token');
let instance;

function addIfNoAdjacent(array, position) {
    let isAdjacent = false;

    for (let examinedPosition of array) {
        isAdjacent = examinedPosition.checkIfIsAdjacent(position);

        if (isAdjacent) {
            break;
        }
    }

    if (!isAdjacent) {
        array.push(position);
    }
}

export class DungeonLevelGenerator extends AbstractLevelGenerator {
    /**
     * @constructor
     * @typedef {DungeonLevelGenerator}
     * @param {Symbol}  token   Unique token used to generate only instance.
     */
    constructor(token) {
        super();

        if(token !== singletonToken){
            throw new Error(`Can't create instance of singleton class with new keyword. Use getInstance() static method instead`);
        }
    }
    /**
     * Generates random dungeon (rooms connected with corridors) from given level cells.
     *
     * @param {LevelModel}       level              Level model containing level cells.
     * @param {Object}           config             Additional level config info.
     * @param {function}         debugCallback      Optional callback function serving as debug for map generation
     */
    generateLevel(level, config = {}, debugCallback) {
        const roomDugPercentage = config.roomDugPercentage || 0.2,
            roomWidth = config.roomWidth || [4, 15],
            roomHeight = config.roomHeight || [4, 15],
            corridorsArray = [],
            roomsArray = [],
            doorsArray = [];

        const generator = new ROT.Map.Uniform(
            globalConfig.LEVEL_WIDTH,
            globalConfig.LEVEL_HEIGHT,
            {
                roomDugPercentage,
                roomWidth,
                roomHeight
            }
            );

        generator.create(debugCallback || generatorCallback);

        generator.getRooms().forEach(item => {
            const doorSpots = this.getPotentialDoorSpots(item);

            doorSpots.forEach(doorsPosition => {
                addIfNoAdjacent(doorsArray, doorsPosition);
            });

            roomsArray.push({
                left: item.getLeft(),
                top: item.getTop(),
                right: item.getRight(),
                bottom: item.getBottom(),
                width: item.getRight() - item.getLeft(),
                height: item.getBottom() - item.getTop(),
                size: (item.getRight() - item.getLeft()) * (item.getBottom() - item.getTop()),
                doors: doorSpots
            });
        });

        generator.getCorridors().forEach(item => {
            corridorsArray.push({
                start: {
                    x: item._startX,
                    y: item._startY
                },
                end: {
                    x: item._endX,
                    y: item.endY
                }
            });
        });

        this.generateDoors(level, doorsArray);
        this.generateRandomStairsUp(level);
        this.generateRandomStairsDown(level);

        function generatorCallback(x, y, value){
            if (value === 1) {
                level.changeCellType(x, y, cellTypes.GRAY_WALL);
            } else {
                level.changeCellType(x, y, cellTypes.RED_FLOOR);
            }
        }
    }
    /**
     * Method responsible for generating doors in level model.
     *
     * @param {LevelModel}  level   Level model instance
     * @param {Array}       doors   Array of position instances
     */
    generateDoors(level, doors) {
        doors.forEach(doorPosition => {
            level.changeCellType(doorPosition.x, doorPosition.y, cellTypes.WOODEN_SOLID_DOORS);
        });
    }
    /**
     * Returns array of possible door spots. Takes doors from room objet given as argument. Converts it to simple
     * coordinate object.
     *
     * @param {Object}  room    Instance of ROT.js room object
     * @returns {Array} Array of Position instances
     */
    getPotentialDoorSpots(room) {
        const roomDoors = room._doors;
        const potentialDoors = [];

        for (let door in roomDoors) {
            if (roomDoors.hasOwnProperty(door)) {
                const doorCoords = door.split(','),
                    x = Number(doorCoords[0]),
                    y = Number(doorCoords[1]);

                potentialDoors.push(new Position(x, y));
            }
        }

        return potentialDoors;
    }
    /**
     * Returns only created instance of cavern level generator.
     * @returns {DungeonLevelGenerator}
     */
    static getInstance () {
        if(!instance) {
            instance = new DungeonLevelGenerator(singletonToken);
        }

        return instance;
    }
}