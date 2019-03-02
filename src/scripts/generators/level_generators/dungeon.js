import {config as globalConfig} from '../../global/config';
import {AbstractLevelGenerator} from './abstract_generator';
import {cellTypes} from '../../constants/cell_types';
import {Position} from '../../model/position/position';
import {Rectangle} from '../../model/position/rectangle';
import {RoomModel} from '../../model/dungeon/room_model';
import {
    DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL
} from '../../constants/directions';
import * as Rng from '../../helper/rng';
import {DungeonAreaModel} from '../../model/dungeon/dungeon_area_model';
import {RoomConnectionModel} from '../../model/dungeon/room_connection_model';

const singletonToken = Symbol('Dungeon level generator singleton token');
let instance;

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
        const roomHeight = config.roomHeight || [5, 15],
            corridorsArray = [],
            roomsArray = [],
            bspRegions = this.createBspSplitRegions(),
            createdRooms = bspRegions.roomsToReturn,
            createdAreas = bspRegions.createdAreas,
            rooms = this.createRoomsFromRegions(createdRooms);

        level.initialize(cellTypes.GRAY_WALL);

        /**
         * Transform rectangles into rooms on level model.
         */
        rooms.forEach(room => {
            const scalePercentage = Rng.getRandomNumber(50, 70) / 100;
            //TODO Think and implement moving each room by random vector
            room.scale(scalePercentage).transform(generatorCallback);
            roomsArray.push(room);
        });

        level.setRooms(roomsArray);

        this.connectAreas(level, this.prepareLevelAreas(createdAreas));

        this.generateDoors(level);
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
     */
    generateDoors(level) {
        const levelRooms = level.rooms;

        if (levelRooms) {
            levelRooms.forEach(room => {
                const doorSpots = room.doorSpots;

                if (doorSpots) {
                    doorSpots.forEach(doorSpot => {
                        level.changeCellType(doorSpot.x, doorSpot.y, cellTypes.WOODEN_SOLID_DOORS);
                    });
                }
            });
        }
    }
    /**
     * Recursively splits starting rectangle into set of separate regions of given min and max size.
     *
     * @param {number}                      iteration           Number of current iteration of algorithm
     * @param {object}                      config              Object with config data
     * @param {Array.<Rectangle>}           roomsToAnalyze      Array of rectangles to analyze in next iteration
     * @param {Array.<Rectangle>}           roomsToReturn       Array of rectangles finally returned by algorithm
     * @param {Array.<Rectangle>}           createdAreas        Array of rectangles created during algorithm
     * @returns {Array.<Rectangle>}
     */
    createBspSplitRegions(iteration = {value: 0}, config = {}, roomsToAnalyze, roomsToReturn = [], createdAreas = []) {
        const minRoomLength = config.minRoomLength || 8,
            maxRoomLength = config.maxRoomLength || 15;
        /**
         * Array of rooms to analyze in next iteration
         * @type {Array.<Rectangle>}
         */
        let newRoomsToAnalyze = [];

        iteration.value += 1;
        /**
         * If no roomsToAnalyze argument is passed it means it's first iteration of algorithm and we have to initialize
         * starting room
         */
        roomsToAnalyze = roomsToAnalyze || [new DungeonAreaModel(
            new Position(0, 0),
            globalConfig.LEVEL_WIDTH,
            globalConfig.LEVEL_HEIGHT,
            null
        )];
        /**
         * We analyze each rectangle in array with rectangles to analyze
         */
        roomsToAnalyze.forEach(area => {
            let isWalidWidth = area.width <= maxRoomLength,
                isWalidHeight = area.height <= maxRoomLength,
                splitRooms;

            if (area.width < minRoomLength || area.height < minRoomLength) {
                return;
            }
            /**
             * If room has valid width and height, add it to rectangles finally returned by method. Otherwise split
             * it into to separate rectangles and add it to analyze in next iteration.
             */
            if (isWalidHeight && isWalidWidth) {
                roomsToReturn.push(area);
            } else if (isWalidWidth && !isWalidHeight) {
                splitRooms = area.splitVertical(iteration.value);
                if (2 === splitRooms.length) {
                    newRoomsToAnalyze = newRoomsToAnalyze.concat(splitRooms);
                    createdAreas.push(...splitRooms);
                }
            } else if (!isWalidWidth && isWalidHeight) {
                splitRooms = area.splitHorizontal(iteration.value);
                if (2 === splitRooms.length) {
                    newRoomsToAnalyze = newRoomsToAnalyze.concat(splitRooms);
                    createdAreas.push(...splitRooms);
                }
            } else {
                splitRooms = area.width > area.height ?
                    area.splitHorizontal(iteration.value) :
                    area.splitVertical(iteration.value);
                if (2 === splitRooms.length) {
                    newRoomsToAnalyze = newRoomsToAnalyze.concat(splitRooms);
                    createdAreas.push(...splitRooms);
                }
            }
        });
        /**
         * If there are any rectangles to analyze, trigger next iteration. Because last parameter, roomsToReturn array
         * is always a referrence to the same array, it can be finally returned when all iterations except for starting
         * one are completed.
         */
        if (newRoomsToAnalyze.length) {
            this.createBspSplitRegions(iteration, config, newRoomsToAnalyze, roomsToReturn, createdAreas);
        }

        return {
            roomsToReturn,
            createdAreas
        };
    }
    /**
     * Method responsible for connecting adjacent areas with each other. createdAreasObject contains keys which are
     * equal to iteration of areas. Each key contains object which keys are generated uids of two adjacent regions.
     * {
     *     1: {
     *             'uniqueUid1': Array.<DungeonAreaModel>
     *        },
     *     2: {
     *             'uniqueUid2': Array.<DungeonAreaModel>
     *        }
     * }
     * Each array always has only two dungeon area models. Method iterates from highest iteration to lowest and connects
     * adjacent regions with each others.
     *
     * @param {LevelModel}              level                   Level model
     * @param {Object}                  createdAreasObject      Level areas object data
     */
    connectAreas(level, createdAreasObject) {
        const iterationsKeys = Object.keys(createdAreasObject),
            iterationsLength = iterationsKeys.length;

        for (let iteration = iterationsLength; iteration >= 1; iteration--) {
            const iterationUids = createdAreasObject[iteration];

            for (let uid in iterationUids){
                if (iterationUids.hasOwnProperty(uid)) {
                    this.connectTwoRegions(level, ...iterationUids[uid]);
                }
            }
        }
    }
    /**
     * Method responsible for creating object described in connectAreas method.
     *
     * @param {Array.<DungeonAreaModel>}    createdAreas    Array of created areas in dungeon
     */
    prepareLevelAreas(createdAreas) {
        const result = {};

        createdAreas.forEach(area => {
            const areaUid = area.uid,
                areaIteration = area.iteration;
            let examinedResultIteration;

            if (!result[areaIteration]) {
                result[areaIteration] = {};
            }

            examinedResultIteration = result[areaIteration];

            if (!examinedResultIteration[areaUid]) {
                examinedResultIteration[areaUid] = [];
            }

            examinedResultIteration[areaUid].push(area);
        });

        return result;
    }
    /**
     * Method responsible for connecting two separate, preferably adjacent regions.
     *
     * @param {LevelModel}          level           Level model in which both areas are present
     * @param {DungeonAreaModel}    firstRegion     Model of first dungeon area
     * @param {DungeonAreaModel}    secondRegion    Model of second dungeon area
     * @param {Array.<string>}      cellsToChange   Array of cell types to which created corridors should be changed
     * @param {Array.<string>}      forbiddenCells  Array of cell types forbidden from changing. When algorithm which
     *                                              connects rooms encounters such cell, it should stop
     */
    connectTwoRegions(level, firstRegion, secondRegion, cellsToChange, forbiddenCells) {
        const firstRegionRooms = level.getRoomsFromRegion(firstRegion),
            secondRegionRooms = level.getRoomsFromRegion(secondRegion);
        let distance = Infinity,
            chosenRooms;
        /**
         * We take rooms from each of areas and compare distance of each room from first area with each room from second
         * area. We take two rooms with lowest distance and connect them.
         */
        firstRegionRooms.forEach(firstRoom => {
            secondRegionRooms.forEach(secondRoom => {
                const roomsDistance = firstRoom.getDistanceFromRoom(secondRoom);

                if (roomsDistance < distance) {
                    distance = roomsDistance;
                    chosenRooms = [firstRoom, secondRoom];
                }
            });
        });

        if (chosenRooms) {
            this.connectTwoRooms(level, chosenRooms[0], chosenRooms[1], [cellTypes.RED_FLOOR]);
        }
    }
    /**
     * Creates array of RoomModels from array of rectangles.
     *
     * @param {Array.<Rectangle>}    regionArray    Array of rectangles in which level map was split
     * @returns {Array.<LevelModel>}
     */
    createRoomsFromRegions(regionArray) {
        return regionArray.map(item => {
            if (item.area >= 16) {
                const roomModel = new RoomModel(item);
                item.roomModel = roomModel;
                return roomModel;
            }
            return null;
        }).filter(item => {
            return !!item;
        });
    }
    /**
     * Creates connection between two rooms.
     *
     * @param {LevelModel}      level               Level model which contains both rooms
     * @param {RoomModel}       room1               First room to connect
     * @param {RoomModel}       room2               Second room to connect
     * @param {Array.<string>}  cellsToChange       Array of cell types on which corridor cells will be changed
     * @param {Array.<string>}  forbidenCells       Array of cell types which can't be changed, algorithm should stop
     *                                              when first forbidden cell is encountered
     * @returns {boolean}
     */
    connectTwoRooms(level, room1, room2, cellsToChange, forbidenCells = []) {
        const x1 = room1.left,
            y1 = room1.top,
            w1 = room1.width,
            h1 = room1.height,
            x2 = room2.left,
            y2 = room2.top,
            w2 = room2.width,
            h2 = room2.height,
            firstRoomBeforeHorizontal = x1 + w1 < x2,
            firstRoomAfterHorizontal = x2 + w2 < x1,
            horizontal = (firstRoomBeforeHorizontal || firstRoomAfterHorizontal),
            firstRoomBeforeVertical = y1 + h1 < y2,
            firstRoomAfterVertical = y2 + h2 < y1,
            horizontalDistance = room1.rectangle.getHorizontalDistanceFromRect(room2.rectangle),
            verticalDistance = room1.rectangle.getVerticalDistanceFromRect(room2.rectangle),
            vertical = (firstRoomBeforeVertical || firstRoomAfterVertical);
        let pointA,
            pointB,
            direction,
            connectionResult;

        if (horizontal && !vertical) {
            direction = DIRECTION_HORIZONTAL;
        } else if (!horizontal && vertical) {
            direction = DIRECTION_VERTICAL;
        } else if (horizontal && vertical) {
            direction = verticalDistance > horizontalDistance ? DIRECTION_VERTICAL : DIRECTION_HORIZONTAL;
        } else {
            console.warn('Connection of two rooms in method connectTwoRooms returned false.');
            return false;
        }

        if (DIRECTION_HORIZONTAL === direction) {
            const room1X = firstRoomBeforeHorizontal ? room1.right : room1.left,
                room2X = firstRoomBeforeHorizontal ? room2.left : room2.right,
                room1DeltaY = Rng.getRandomNumber(-1, 1) * Rng.getRandomNumber(0, Math.floor(h1 / 3)),
                room2DeltaY = Rng.getRandomNumber(-1, 1) * Rng.getRandomNumber(0, Math.floor(h2 / 3)),
                room1Y = Math.floor(room1.top + (room1.height / 2)) + room1DeltaY,
                room2Y = Math.floor(room2.top + (room2.height / 2)) + room2DeltaY;

            pointA = new Position(room1X, room1Y);
            pointB = new Position(room2X, room2Y);
        } else if (DIRECTION_VERTICAL === direction) {
            const room1Y = firstRoomBeforeVertical ? room1.bottom : room1.top,
                room2Y = firstRoomBeforeVertical ? room2.top : room2.bottom,
                room1DeltaX = Rng.getRandomNumber(-1, 1) * Rng.getRandomNumber(0, Math.floor(w1 / 3)),
                room2DeltaX = Rng.getRandomNumber(-1, 1) * Rng.getRandomNumber(0, Math.floor(w2 / 3)),
                room1X = Math.floor(room1.left + (room1.width / 2)) + room1DeltaX,
                room2X = Math.floor(room2.left + (room2.width / 2)) + room2DeltaX;

            pointA = new Position(room1X, room1Y);
            pointB = new Position(room2X, room2Y);
        } else {
            throw new Error('Uknown direction type in connectTwoRooms method');
        }

        connectionResult = this.createConnectionBetweenTwoPoints(level, direction, pointA, pointB, cellsToChange, forbidenCells);

        if (connectionResult) {
            room1.addDoorSpot(pointA);
            room2.addDoorSpot(pointB);
            level.addConnectionBetweenRooms(new RoomConnectionModel(room1, room2, connectionResult));
        }
    }
    /**
     * Generates stairs up in randomly choosen room.
     *
     * @param {LevelModel}  level   Level model
     */
    generateRandomStairsUp(level) {
        const rooms = level.rooms,
            randomRoom = rooms.random(),
            randomCellPosition = randomRoom.getRandomRoomCellPosition();

        level.changeCellType(randomCellPosition.x, randomCellPosition.y, cellTypes.STAIRS_UP);
        level.setStairsUp(randomCellPosition.x, randomCellPosition.y);
    }
    /**
     * Generates stairsDown in randomly choosen room, but not in the room with stairs up.
     *
     * @param {LevelModel}  level   Level model
     */
    generateRandomStairsDown(level) {
        const rooms = level.rooms;
        let randomRoom = rooms.random();
        let randomCellPosition;

        while (randomRoom.hasStairsUp) {
            randomRoom = rooms.random();
        }

        randomCellPosition = randomRoom.getRandomRoomCellPosition();

        level.changeCellType(randomCellPosition.x, randomCellPosition.y, cellTypes.STAIRS_DOWN);
        level.setStairsUp(randomCellPosition.x, randomCellPosition.y);
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