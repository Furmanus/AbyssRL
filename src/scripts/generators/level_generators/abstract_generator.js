import {cellTypes} from '../../constants/cell_types';
import {config as globalConfig} from '../../global/config';
import {Rng} from "../../helper/rng";
import {Utility} from "../../helper/utility";
import {DIRECTIONS, DIRECTIONS_SHORT} from '../../constants/keyboard_directions';
import {terrain} from '../../constants/sprites';
import {getCircleFromLevelCells} from '../../helper/level_cells_helper';
import ROT from 'rot-js';
import {DIRECTION_HORIZONTAL} from '../../constants/directions';
import {Position} from '../../model/position/position';

const {
    NE,
    N,
    NW,
    W,
    SW,
    S,
    SE,
    E
} = DIRECTIONS_SHORT;
/**
 * Which cell types can be replaced to stairs during level generation.
 */
const stairsReplaceCells = {
    [cellTypes.GRASS]: true,
    [cellTypes.RED_FLOOR]: true,
    [cellTypes.BUSH]: true
};

/**
 * @class
 * @abstract
 * @typedef {AbstractLevelGenerator}
 */
export class AbstractLevelGenerator {
    constructor() {
        if(new.target){
            throw new Error(`Can't make instance of abstract generator class.`);
        }
    }
    //TODO nie działa
    generateTestLevel(levelCells, config) {
        const debugDisplay = new ROT.Display({
            width: globalConfig.LEVEL_WIDTH,
            height: globalConfig.LEVEL_HEIGHT,
            fontSize: 20
        });

        this.generateLevel(levelCells, config, debugDisplay.DEBUG);
    }
    /**
     * Method responsible for "smoothing" certain level cells. For example, method iterates through level and if it
     * has high mountain cell in its surroundings. If yes, it changes grass cell to mountain cell.
     *
     * @param {LevelModel}      level                Level model containing level cells.
     * @param {Object}          config                      Configuration object.
     * @param {Array.<string>}  config.cellsToSmooth        Cells which we are looking for in surrounding of examined
     *                                                      cell.
     * @param {Array.<string>}  config.cellsToChange        Cells to change if cell to smooth is detected in its
     *                                                      surrounding.
     * @param {Array.<string>}  config.cellsAfterChange     Cells (randomly selected) which will appear in place of
     *                                                      changed cells.
     */
    smoothLevel(level, config = {}) {
        const cellsToSmooth = config.cellsToSmooth || [];
        const cellsToChange = config.cellsToChange || [];
        const cellsAfterChange = config.cellsAfterChange || [];
        const levelCells = level.getCells();
        let examinedCellNeighbours;

        if(cellsToSmooth.length && cellsToChange.length && cellsAfterChange.length){
            levelCells.forEach(function(examinedCell){
                if(cellsToChange.includes(examinedCell.type)) {
                    examinedCellNeighbours = this.isCertainCellInCellSurroundings(
                        levelCells,
                        examinedCell,
                        cellsToSmooth
                    );
                    if (examinedCellNeighbours.directions.length) {
                        level.changeCellType(examinedCell.x, examinedCell.y, cellsAfterChange.random());
                    }
                }
            }.bind(this));
        }
    }
    /**
     * Method responsible for smoothing hills cells. It iterates through level cells and looks for grass cells.
     * Then it examines cells to left and right - if any of those cells are hills, it changes grass cell to hill_left
     * or hills_right (or just to hills, if hills cells are on both sides).
     *
     * @param {LevelModel}     level      Level model containing level cells.
     */
    smoothLevelHills(level) {
        const levelCells = level.getCells();
        let examinedCellNeighbours;
        let isHillFromLeftSide;
        let isHillFromRightSide;

        levelCells.forEach(function(examinedCell){
            if(examinedCell.type === cellTypes.GRASS){
                examinedCellNeighbours = this.isCertainCellInCellSurroundings(
                    levelCells,
                    examinedCell,
                    [cellTypes.HILLS]
                );

                if(examinedCellNeighbours.directions.length){
                    isHillFromLeftSide = examinedCellNeighbours.directions.find(function(direction){
                        return (direction.x === -1 && direction.y === 0);
                    });
                    isHillFromRightSide = examinedCellNeighbours.directions.find(function(direction){
                        return (direction.x === 1 && direction.y === 0);
                    });

                    if(isHillFromLeftSide && isHillFromRightSide){
                        level.changeCellType(examinedCell.x, examinedCell.y, cellTypes.HILLS);
                    }else if(isHillFromLeftSide && !isHillFromRightSide){
                        level.changeCellType(examinedCell.x, examinedCell.y, cellTypes.RIGHT_HILLS);
                    }else if(!isHillFromLeftSide && isHillFromRightSide){
                        level.changeCellType(examinedCell.x, examinedCell.y, cellTypes.LEFT_HILLS);
                    }
                }
            }
        }.bind(this));
    }
    /**
     * Method responsible for checking if one of given searched cell types is in certain cell surroundings.
     *
     * @param {Map}             levelCells      Map containing level cell models.
     * @param {Cell}            cell            Cell model which surroundings we want to check.
     * @param {Array.<string>}  searchedCells   Array of string which are types of searched cells.
     * @returns {Object}
     */
    isCertainCellInCellSurroundings(levelCells, cell, searchedCells = []) {
        const x = cell.x;
        const y = cell.y;
        const result = {
            directions: []
        };
        let examinedCell;

        for(let i=-1; i<=1; i++){
            for(let j=-1; j<=1; j++){
                examinedCell = levelCells.get(`${x + i}x${y + j}`);
                if(examinedCell && examinedCell !== cell && searchedCells.includes(examinedCell.type)){
                    result.directions.push({
                        x: i,
                        y: j
                    });
                }
            }
        }

        return result;
    }
    /**
     * Method responsible for generating number of random points such that no two points distance is below given range.
     *
     * @param {number}     pointsQuantity   How many points we want to generate.
     * @param {number}     range            Minimum distance between each two points.
     * @returns {Array}
     */
    generateRandomPoints(pointsQuantity, range) {
        const generatedPoints = [];
        let randomPoint;
        let isGeneratedPointValid;
        let generationAttempt = 0;

        while(generatedPoints.length < pointsQuantity && generationAttempt < 1000){
            randomPoint = {
                x: Rng.getRandomNumber(1, globalConfig.LEVEL_WIDTH - 1),
                y: Rng.getRandomNumber(1, globalConfig.LEVEL_HEIGHT - 1)
            };

            isGeneratedPointValid = generatedPoints.every(function(item){
                return Utility.getDistance(randomPoint.x, randomPoint.y, item.x, item.y) > range;
            });

            if(isGeneratedPointValid){
                generatedPoints.push(randomPoint);
            }

            generationAttempt++;
        }

        return generatedPoints;
    }
    /**
     * Method responsible for smoothing (ie. changing cells display to grass with coastline) grass cells which are
     * adjacent to water cells.
     *
     * @param {LevelModel}  level   Level model.
     */
    smoothShallowWaterCoastline(level) {
        const abstractLevelGenerator = this;
        const levelCells = level.getCells();
        let examinedCellWaterNeighbours;

        levelCells.forEach(levelCellsSmoothCallback);

        function levelCellsSmoothCallback(cell){
            /**
             * We smooth only grass tiles, because only grass sprites are suitable for smoothing water.
             */
            if(cell.type === cellTypes.GRASS){
                examinedCellWaterNeighbours = abstractLevelGenerator.isCertainCellInCellSurroundings(
                    levelCells,
                    cell,
                    [cellTypes.SHALLOW_WATER]
                ).directions;
                examinedCellWaterNeighbours = examinedCellWaterNeighbours.map((item) => {
                    return DIRECTIONS[`${item.x}x${item.y}`];
                });

                if(
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NE, N, NW) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NE, N) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, N, NW) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, N)
                ){
                    cell.changeDisplay([terrain.NORTH_COASTLINE]);
                    cell.disableDisplayChange();
                }else if(
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NW, W, SW) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NW, W) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, SW, W) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, W)
                ){
                    cell.changeDisplay([terrain.WEST_COASTLINE]);
                    cell.disableDisplayChange();
                }else if(
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NE, E, SE) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NE, E) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, E, SE) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, E)
                ){
                    cell.changeDisplay([terrain.EAST_COASTLINE]);
                    cell.disableDisplayChange();
                }else if(
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, SE, S, SW) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, SE, S) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, S, SW) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, S)
                ){
                    cell.changeDisplay([terrain.SOUTH_COASTLINE]);
                    cell.disableDisplayChange();
                }else if(
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, SE, E, S) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, SE, E, S, SW) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NE, E, S, SE) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NE, E, S, SE, SW)
                ){
                    cell.changeDisplay([terrain.NORTHWEST_COASTLINE]);
                    cell.disableDisplayChange();
                }else if(
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, W, S, SW) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, SE, W, S, SW) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NW, W, SW, S) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NW, W, SW, S, SE)
                ){
                    cell.changeDisplay([terrain.NORTHEAST_COASTLINE]);
                    cell.disableDisplayChange();
                } else if(
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NE, E, N) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NE, E, N, NW) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NE, E, N, SE) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NW, NE, E, N, SE)
                ){
                    cell.changeDisplay([terrain.SOUTHWEST_COASTLINE]);
                    cell.disableDisplayChange();
                } else if(
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NW, N, W) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NW, N, W, NE) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NW, N, W, SW) ||
                    Utility.isArrayEqualToArguments(examinedCellWaterNeighbours, NE, NW, N, W, SW)
                ){
                    cell.changeDisplay([terrain.SOUTHEAST_COASTLINE]);
                    cell.disableDisplayChange();
                }else if(
                    Utility.doesArrayContainsArguments(examinedCellWaterNeighbours, W, N, E) ||
                    Utility.doesArrayContainsArguments(examinedCellWaterNeighbours, N, E, S) ||
                    Utility.doesArrayContainsArguments(examinedCellWaterNeighbours, E, S, W) ||
                    Utility.doesArrayContainsArguments(examinedCellWaterNeighbours, S, W, N)
                ){
                    /**
                     * Cell is single grass cell surrounded from three sides by water. We can't smooth such cell (lack
                     * of proper grass sprite), so we change it to water.
                     */
                    level.changeCellType(cell.x, cell.y, cellTypes.SHALLOW_WATER);
                    /**
                     * We changed grass cell to shallow water cell, most likely one of its neighbours in straight line
                     * has already been examined, and will not be smooth, that's why we recursively call smooth callback
                     * function on all in straight line neighbours of changed cell.
                     */
                    levelCellsSmoothCallback(level.getCell(cell.x - 1, cell.y));
                    levelCellsSmoothCallback(level.getCell(cell.x + 1, cell.y));
                    levelCellsSmoothCallback(level.getCell(cell.x, cell.y - 1));
                    levelCellsSmoothCallback(level.getCell(cell.x, cell.y + 1));
                }
            }
        }
    }
    /**
     * Function responsible for generating deep water cells from shallow water. It uses following rule: if shallow water
     * cell within radius of two cells, has only water surrounding cells, change it to deep water.
     *
     * @param {LevelModel}  level   LevelModel
     */
    generateDeepWater(level) {
        const levelCells = level.getCells();
        let examinedCellSurrounding;
        let isCellSurroundedByWaterOnly;

        levelCells.forEach(function(cell){
            if(cell.type === cellTypes.SHALLOW_WATER){
                examinedCellSurrounding = getCircleFromLevelCells(cell.x, cell.y, 2);

                isCellSurroundedByWaterOnly = examinedCellSurrounding.every(function(neighbour){
                    const neighbourCellType = level.getCell(neighbour.x, neighbour.y).type;

                    return (neighbourCellType === cellTypes.SHALLOW_WATER || neighbourCellType === cellTypes.DEEP_WATER);
                });

                if(isCellSurroundedByWaterOnly){
                    level.changeCellType(cell.x, cell.y,cellTypes.DEEP_WATER);
                }
            }
        });
    }
    /**
     * Function responsible examining every cell in level and changing selected cell types (with given probability)
     * into other cell type randomly selected from target cell types given in array.
     *
     * @param {LevelModel}          level                   Level model.
     * @param {Object}              config                  Configuration object.
     * @param {Array.<string>}      config.cellsToChange    Array of cell types to change.
     * @param {Array.<string>}      config.cellsAfterChange Array of target cell types used as replacement.
     * @param {number}              config.probability      Probability of changing any cell.
     */
    changeEveryCellInLevel(level, config = {}) {
        const levelCells = level.getCells();
        const {
            cellsToChange,
            cellsAfterChange,
            probability
        } = config;
        let shouldChangeCell;

        levelCells.forEach(function(cell){
            if(!cell.preventDisplayChange && Rng.getPercentage() <= probability){
                shouldChangeCell = cellsToChange.some(function(item){
                    return cell.type === item;
                });

                if(shouldChangeCell){
                    //TODO poprawić na opcjonalne wagi dla poszczególnych opcji i nierówne prawdopodobieństwa
                    level.changeCellType(cell.x, cell.y, cellsAfterChange.random());
                }
            }
        });
    }
    /**
     * Function responsible for generating in random placement staircase up.
     * @param {LevelModel} levelModel
     */
    generateRandomStairsUp(levelModel) {
        let randomCell = levelModel.getCell(
            Rng.getRandomNumber(1, globalConfig.LEVEL_WIDTH - 1),
            Rng.getRandomNumber(1, globalConfig.LEVEL_HEIGHT - 1)
        );
        let attemptNumber = 0;

        while(!stairsReplaceCells[randomCell.type]){
            randomCell = levelModel.getCell(
                Rng.getRandomNumber(1, globalConfig.LEVEL_WIDTH - 1),
                Rng.getRandomNumber(1, globalConfig.LEVEL_HEIGHT - 1)
            );

            attemptNumber++;
            if(attemptNumber > 10000){
                throw new Error('Failed to generate stairs up, too many failed attempts.');
            }
        }

        levelModel.changeCellType(randomCell.x, randomCell.y, cellTypes.STAIRS_UP);
        levelModel.setStairsUp(randomCell.x, randomCell.y);
    }
    generateRandomStairsDown(levelModel) {
        let randomCell = levelModel.getCell(
            Rng.getRandomNumber(1, globalConfig.LEVEL_WIDTH - 1),
            Rng.getRandomNumber(1, globalConfig.LEVEL_HEIGHT - 1)
        );
        let attemptNumber = 0;
        const stairsUp = levelModel.getStairsUpLocation() || {x: Infinity, y: Infinity};
        let distanceFromStairsUp = Utility.getDistance(stairsUp.x, stairsUp.y, randomCell.x, randomCell.y);

        while(!stairsReplaceCells[randomCell.type] && distanceFromStairsUp < 40){
            randomCell = levelModel.getCell(
                Rng.getRandomNumber(1, globalConfig.LEVEL_WIDTH - 1),
                Rng.getRandomNumber(1, globalConfig.LEVEL_HEIGHT - 1)
            );
            distanceFromStairsUp = Utility.getDistance(stairsUp.x, stairsUp.y, randomCell.x, randomCell.y);
            attemptNumber++;
            if(attemptNumber > 10000){
                throw new Error('Failed to generate stairs down, too many failed attempts.');
            }
        }

        levelModel.changeCellType(randomCell.x, randomCell.y, cellTypes.STAIRS_DOWN);
        levelModel.setStairsDown(randomCell.x, randomCell.y);
    }
    /**
     * Creates and returns connection between any two points on map.
     * @param {LevelModel}      levelModel      Model of level on which we want to create connection
     * @param {string}          direction       Prefered direction in which connection can be made, either horizontal
     *                                          or vertical
     * @param {Position}        point1          Starting point
     * @param {Position}        point2          Target point
     * @param {Array.<string>}  newCells        Array of string cell types of cells after change.
     * @param {Array.<string>}  forbiddenCells  Array of string cell types which are forbidden to change/encounter.
     *                                          If algorithm encounters such cell on its path, it stops and returns
     *                                          false, meaning that connection was not successful
     * @returns {boolean}                       If creation was successful
     */
    createConnectionBetweenTwoPoints(levelModel, direction, point1, point2, newCells, forbiddenCells = []) {
        const firstCell = levelModel.getCellFromPosition(point1),
            secondCell = levelModel.getCellFromPosition(point2),
            horizontalDirection = Math.sign(point2.x - point1.x),
            verticalDirection = Math.sign(point2.y - point1.y),
            cellsToChangeArray = [];
        let firstMiddlePoint,
            secondMiddlePoint,
            examinedX,
            examinedY,
            examinedCell,
            middlePointValue,
            distance,
            createdCorridor = [],
            isCreationSuccessful = true;

        cellsToChangeArray.push(firstCell);

        if (DIRECTION_HORIZONTAL === direction) {
            distance = Math.abs(point2.x - point1.x);
            middlePointValue = Math.floor((point1.x + point2.x) / 2);
            firstMiddlePoint = new Position(middlePointValue, point1.y);
            secondMiddlePoint = new Position(middlePointValue, point2.y);
            examinedX = point1.x;
            examinedY = point1.y;

            if (horizontalDirection) {
                examinedX += horizontalDirection;
                while (examinedX !== firstMiddlePoint.x) {
                    examinedCell = levelModel.getCell(examinedX, examinedY);
                    if (!forbiddenCells.includes(examinedCell.type)) {
                        cellsToChangeArray.push(examinedCell);
                    } else {
                        isCreationSuccessful = false;
                        break;
                    }
                    examinedX += horizontalDirection;
                }
            }
            if (verticalDirection) {
                while (examinedY !== secondMiddlePoint.y) {
                    examinedCell = levelModel.getCell(examinedX, examinedY);
                    if (!forbiddenCells.includes(examinedCell.type)) {
                        cellsToChangeArray.push(examinedCell);
                    } else {
                        isCreationSuccessful = false;
                        break;
                    }
                    examinedY += verticalDirection;
                }
            }
            if (horizontalDirection) {
                while (examinedX !== point2.x) {
                    examinedCell = levelModel.getCell(examinedX, examinedY);
                    if (!forbiddenCells.includes(examinedCell.type)) {
                        cellsToChangeArray.push(examinedCell);
                    } else {
                        isCreationSuccessful = false;
                        break;
                    }
                    examinedX += horizontalDirection;
                }
            }
        } else {
            distance = Math.abs(point2.y - point1.y);
            middlePointValue = Math.floor((point1.y + point2.y) / 2);
            firstMiddlePoint = new Position(point1.x, middlePointValue);
            secondMiddlePoint = new Position(point2.x, middlePointValue);

            examinedX = point1.x;
            examinedY = point1.y;

            if (verticalDirection) {
                examinedY += verticalDirection;
                while (examinedY !== firstMiddlePoint.y) {
                    examinedCell = levelModel.getCell(examinedX, examinedY);
                    if (!forbiddenCells.includes(examinedCell.type)) {
                        cellsToChangeArray.push(examinedCell);
                    } else {
                        isCreationSuccessful = false;
                        break;
                    }
                    examinedY += verticalDirection;
                }
            }
            if (horizontalDirection) {
                while (examinedX !== secondMiddlePoint.x) {
                    examinedCell = levelModel.getCell(examinedX, examinedY);
                    if (!forbiddenCells.includes(examinedCell.type)) {
                        cellsToChangeArray.push(examinedCell);
                    } else {
                        isCreationSuccessful = false;
                        break;
                    }
                    examinedX += horizontalDirection;
                }
            }
            if (verticalDirection) {
                while (examinedY !== point2.y) {
                    examinedCell = levelModel.getCell(examinedX, examinedY);
                    if (!forbiddenCells.includes(examinedCell.type)) {
                        cellsToChangeArray.push(examinedCell);
                    } else {
                        isCreationSuccessful = false;
                        break;
                    }
                    examinedY += verticalDirection;
                }
            }
        }
        cellsToChangeArray.push(secondCell);

        if (isCreationSuccessful) {
            cellsToChangeArray.forEach(room => {
                createdCorridor.push(new Position(room.x, room.y));
                levelModel.changeCellType(room.x, room.y, newCells.random());
            });

            return createdCorridor;
        }

        return isCreationSuccessful;
    }
}