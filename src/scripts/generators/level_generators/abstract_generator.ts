import {CellTypes} from '../../constants/cell_types';
import {config as globalConfig} from '../../global/config';
import * as Rng from '../../helper/rng';
import * as Utility from "../../helper/utility";
import {DIRECTIONS, DIRECTIONS_SHORT} from '../../constants/keyboard_directions';
import {TerrainSprites} from '../../constants/sprites';
import {getCircleFromLevelCells} from '../../helper/level_cells_helper';
import {DIRECTION_HORIZONTAL} from '../../constants/directions';
import {Position} from '../../model/position/position';
import {LevelModel} from '../../model/dungeon/level_model';
import {
    IChangeEveryCellInLevelConfig,
    ISearchCellSurroundingResult,
    ISmoothLevelConfig,
} from '../../interfaces/generators';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {Direction} from '../../model/position/direction';
import {directionType} from '../../interfaces/common';

const {
    NE,
    N,
    NW,
    W,
    SW,
    S,
    SE,
    E,
} = DIRECTIONS_SHORT;
const MONSTERS_LIMIT_PER_LEVEL: number = 20;

/**
 * Which cell types can be replaced to stairs during level generation.
 */
const stairsReplaceCells = [CellTypes.GRASS, CellTypes.RED_FLOOR, CellTypes.BUSH];

/**
 * Abstract class of dungeon levels generator. Contains common methods for all other generators. Generators methods
 * usually as first arguments takes level model or collection of cell models and changes them in desired way.
 */
export abstract class AbstractLevelGenerator {
    /**
     * Method responsible for "smoothing" certain level cells. For example, method iterates through level and if it
     * has high mountain cell in its surroundings. If yes, it changes grass cell to mountain cell.
     *
     * @param   level                       Level model containing level cells.
     * @param   config                      Configuration object.
     * @param   config.cellsToSmooth        Cells which we are looking for in surrounding of examined cell.
     * @param   config.cellsToChange        Cells to change if cell to smooth is detected in its surrounding.
     * @param   config.cellsAfterChange     Cells (randomly selected) which will appear in place of changed cells.
     */
    protected smoothLevel(level: LevelModel, config: ISmoothLevelConfig): void {
        const {
            cellsToSmooth,
            cellsToChange,
            cellsAfterChange,
        } = config;
        const levelCells: Map<string, Cell> = level.getCells();
        let examinedCellNeighbours;

        if (cellsToSmooth.length && cellsToChange.length && cellsAfterChange.length) {
            levelCells.forEach((examinedCell: Cell) => {
                if (cellsToChange.includes(examinedCell.type)) {
                    examinedCellNeighbours = this.isCertainCellInCellSurroundings(
                        levelCells,
                        examinedCell,
                        cellsToSmooth,
                    );
                    if (examinedCellNeighbours.directions.length) {
                        level.changeCellType(examinedCell.x, examinedCell.y, cellsAfterChange.random());
                    }
                }
            });
        }
    }
    /**
     * Method responsible for smoothing hills cells. It iterates through level cells and looks for grass cells.
     * Then it examines cells to left and right - if any of those cells are hills, it changes grass cell to hill_left
     * or hills_right (or just to hills, if hills cells are on both sides).
     *
     * @param   level      Level model containing level cells.
     */
    protected smoothLevelHills(level: LevelModel): void {
        const levelCells: Map<string, Cell> = level.getCells();
        let examinedCellNeighbours: ISearchCellSurroundingResult;
        let isHillFromLeftSide: boolean;
        let isHillFromRightSide: boolean;

        levelCells.forEach((examinedCell: Cell) => {
            if (examinedCell.type === CellTypes.GRASS) {
                examinedCellNeighbours = this.isCertainCellInCellSurroundings(
                    levelCells,
                    examinedCell,
                    [CellTypes.HILLS],
                );

                if (examinedCellNeighbours.directions.length) {
                    isHillFromLeftSide = examinedCellNeighbours.directions.some((direction: Direction) => {
                        return (direction.x === -1 && direction.y === 0);
                    });
                    isHillFromRightSide = examinedCellNeighbours.directions.some((direction: Direction) => {
                        return (direction.x === 1 && direction.y === 0);
                    });

                    if (isHillFromLeftSide && isHillFromRightSide) {
                        level.changeCellType(examinedCell.x, examinedCell.y, CellTypes.HILLS);
                    } else if (isHillFromLeftSide && !isHillFromRightSide) {
                        level.changeCellType(examinedCell.x, examinedCell.y, CellTypes.RIGHT_HILLS);
                    } else if (!isHillFromLeftSide && isHillFromRightSide) {
                        level.changeCellType(examinedCell.x, examinedCell.y, CellTypes.LEFT_HILLS);
                    }
                }
            }
        });
    }
    /**
     * Method responsible for checking if one of given searched cell types is in certain cell surroundings.
     *
     * @param   levelCells      Map containing level cell models.
     * @param   cell            Cell model which surroundings we want to check.
     * @param   searchedCells   Array of string which are types of searched cells.
     * @returns                 Returns object with information about direction of searched cells in cell surrounding.
     */
    protected isCertainCellInCellSurroundings(
        levelCells: Map<string, Cell>,
        cell: Cell,
        searchedCells: string[] = [],
    ): ISearchCellSurroundingResult {
        const x: number = cell.x;
        const y: number = cell.y;
        const result: ISearchCellSurroundingResult = {
            directions: [],
        };
        let examinedCell: Cell;

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                examinedCell = levelCells.get(`${x + i}x${y + j}`);
                if (examinedCell && examinedCell !== cell && searchedCells.includes(examinedCell.type)) {
                    result.directions.push(new Direction(
                        i as unknown as directionType,
                        j as unknown as directionType,
                    ));
                }
            }
        }

        return result;
    }
    /**
     * Method responsible for generating number of random points such that no two points distance is below given range.
     *
     * @param   pointsQuantity   How many points we want to generate.
     * @param   range            Minimum distance between each two points.
     * @returns                  Returns array of positions of randomly choosen points.
     */
    protected generateRandomPoints(pointsQuantity: number, range: number): Position[] {
        const generatedPoints: Position[] = [];
        let randomPoint: Position;
        let isGeneratedPointValid: boolean;
        let generationAttempt: number = 0;

        while (generatedPoints.length < pointsQuantity && generationAttempt < 1000) {
            randomPoint = new Position(
                Rng.getRandomNumber(1, globalConfig.LEVEL_WIDTH - 1),
                Rng.getRandomNumber(1, globalConfig.LEVEL_HEIGHT - 1),
            );

            isGeneratedPointValid = generatedPoints.every((item: Position) => {
                return Utility.getDistance(randomPoint.x, randomPoint.y, item.x, item.y) > range;
            });

            if (isGeneratedPointValid) {
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
     * @param   level   Level model.
     */
    protected smoothShallowWaterCoastline(level: LevelModel): void {
        const abstractLevelGenerator = this;
        const levelCells = level.getCells();
        let examinedCellWaterNeighbours: string[];

        levelCells.forEach(levelCellsSmoothCallback);

        function levelCellsSmoothCallback(cell: Cell): void {
            /**
             * We smooth only grass tiles, because only grass sprites are suitable for smoothing water.
             */
            if (cell.type === CellTypes.GRASS) {
                examinedCellWaterNeighbours = abstractLevelGenerator.isCertainCellInCellSurroundings(
                    levelCells,
                    cell,
                    [CellTypes.SHALLOW_WATER],
                ).directions.map((item) => {
                    return DIRECTIONS[`${item.x}x${item.y}`];
                });

                if (
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NE, N, NW) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NE, N) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, N, NW) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, N)
                ) {
                    cell.changeDisplay([TerrainSprites.NORTH_COASTLINE]);
                    cell.disableDisplayChange();
                } else if (
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NW, W, SW) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NW, W) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, SW, W) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, W)
                ) {
                    cell.changeDisplay([TerrainSprites.WEST_COASTLINE]);
                    cell.disableDisplayChange();
                } else if (
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NE, E, SE) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NE, E) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, E, SE) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, E)
                ) {
                    cell.changeDisplay([TerrainSprites.EAST_COASTLINE]);
                    cell.disableDisplayChange();
                } else if (
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, SE, S, SW) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, SE, S) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, S, SW) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, S)
                ) {
                    cell.changeDisplay([TerrainSprites.SOUTH_COASTLINE]);
                    cell.disableDisplayChange();
                } else if (
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, SE, E, S) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, SE, E, S, SW) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NE, E, S, SE) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NE, E, S, SE, SW)
                ) {
                    cell.changeDisplay([TerrainSprites.NORTHWEST_COASTLINE]);
                    cell.disableDisplayChange();
                } else if (
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, W, S, SW) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, SE, W, S, SW) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NW, W, SW, S) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NW, W, SW, S, SE)
                ) {
                    cell.changeDisplay([TerrainSprites.NORTHEAST_COASTLINE]);
                    cell.disableDisplayChange();
                } else if (
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NE, E, N) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NE, E, N, NW) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NE, E, N, SE) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NW, NE, E, N, SE)
                ) {
                    cell.changeDisplay([TerrainSprites.SOUTHWEST_COASTLINE]);
                    cell.disableDisplayChange();
                } else if (
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NW, N, W) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NW, N, W, NE) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NW, N, W, SW) ||
                    Utility.isArrayEqualToArguments<string>(examinedCellWaterNeighbours, NE, NW, N, W, SW)
                ) {
                    cell.changeDisplay([TerrainSprites.SOUTHEAST_COASTLINE]);
                    cell.disableDisplayChange();
                } else if (
                    Utility.doesArrayContainsArguments<string>(examinedCellWaterNeighbours, W, N, E) ||
                    Utility.doesArrayContainsArguments<string>(examinedCellWaterNeighbours, N, E, S) ||
                    Utility.doesArrayContainsArguments<string>(examinedCellWaterNeighbours, E, S, W) ||
                    Utility.doesArrayContainsArguments<string>(examinedCellWaterNeighbours, S, W, N)
                ) {
                    /**
                     * Cell is single grass cell surrounded from three sides by water. We can't smooth such cell (lack
                     * of proper grass sprite), so we change it to water.
                     */
                    level.changeCellType(cell.x, cell.y, CellTypes.SHALLOW_WATER);
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
     * @param     level   LevelModel
     */
    protected generateDeepWater(level: LevelModel): void {
        const levelCells: Map<string, Cell> = level.getCells();
        let examinedCellSurrounding: Position[];
        let isCellSurroundedByWaterOnly: boolean;

        levelCells.forEach((cell: Cell) => {
            if (cell.type === CellTypes.SHALLOW_WATER) {
                examinedCellSurrounding = getCircleFromLevelCells(cell.x, cell.y, 2);

                isCellSurroundedByWaterOnly = examinedCellSurrounding.every((neighbour: Position) => {
                    const neighbourCellType = level.getCell(neighbour.x, neighbour.y).type;

                    return (neighbourCellType === CellTypes.SHALLOW_WATER || neighbourCellType === CellTypes.DEEP_WATER);
                });

                if (isCellSurroundedByWaterOnly) {
                    level.changeCellType(cell.x, cell.y, CellTypes.DEEP_WATER);
                }
            }
        });
    }
    /**
     * Function responsible examining every cell in level and changing selected cell types (with given probability)
     * into other cell type randomly selected from target cell types given in array.
     *
     * @param   level                   Level model.
     * @param   config                  Configuration object.
     * @param   config.cellsToChange    Array of cell types to change.
     * @param   config.cellsAfterChange Array of target cell types used as replacement.
     * @param   config.probability      Probability of changing any cell.
     */
    protected changeEveryCellInLevel(level: LevelModel, config: IChangeEveryCellInLevelConfig): void {
        const levelCells = level.getCells();
        const {
            cellsToChange,
            cellsAfterChange,
            probability,
        } = config;
        let shouldChangeCell: boolean;

        levelCells.forEach((cell: Cell) => {
            if (!cell.preventDisplayChange && Rng.getPercentage() <= probability) {
                shouldChangeCell = cellsToChange.some((item: string) => {
                    return cell.type === item;
                });

                if (shouldChangeCell) {
                    // TODO poprawić na opcjonalne wagi dla poszczególnych opcji i nierówne prawdopodobieństwa
                    level.changeCellType(cell.x, cell.y, cellsAfterChange.random());
                }
            }
        });
    }
    /**
     * Function responsible for generating in random placement staircase up.
     *
     * @param   levelModel  Model of level
     */
    protected generateRandomStairsUp(levelModel: LevelModel): void {
        let randomCell: Cell = levelModel.getCell(
            Rng.getRandomNumber(1, globalConfig.LEVEL_WIDTH - 1),
            Rng.getRandomNumber(1, globalConfig.LEVEL_HEIGHT - 1),
        );
        let attemptNumber: number = 0;

        while (!stairsReplaceCells.includes(randomCell.type)) {
            randomCell = levelModel.getCell(
                Rng.getRandomNumber(1, globalConfig.LEVEL_WIDTH - 1),
                Rng.getRandomNumber(1, globalConfig.LEVEL_HEIGHT - 1),
            );

            attemptNumber++;
            if (attemptNumber > 10000) {
                throw new Error('Failed to generate stairs up, too many failed attempts.');
            }
        }

        levelModel.changeCellType(randomCell.x, randomCell.y, CellTypes.STAIRS_UP);
        levelModel.setStairsUp(randomCell.x, randomCell.y);
    }
    protected generateRandomStairsDown(levelModel: LevelModel): void {
        let randomCell: Cell = levelModel.getCell(
            Rng.getRandomNumber(1, globalConfig.LEVEL_WIDTH - 1),
            Rng.getRandomNumber(1, globalConfig.LEVEL_HEIGHT - 1),
        );
        let attemptNumber: number = 0;
        const stairsUp = levelModel.getStairsUpLocation() || {x: Infinity, y: Infinity};
        let distanceFromStairsUp = Utility.getDistance(stairsUp.x, stairsUp.y, randomCell.x, randomCell.y);

        while (!stairsReplaceCells.includes(randomCell.type) && distanceFromStairsUp < 40) {
            randomCell = levelModel.getCell(
                Rng.getRandomNumber(1, globalConfig.LEVEL_WIDTH - 1),
                Rng.getRandomNumber(1, globalConfig.LEVEL_HEIGHT - 1),
            );
            distanceFromStairsUp = Utility.getDistance(stairsUp.x, stairsUp.y, randomCell.x, randomCell.y);
            attemptNumber++;
            if (attemptNumber > 10000) {
                throw new Error('Failed to generate stairs down, too many failed attempts.');
            }
        }

        levelModel.changeCellType(randomCell.x, randomCell.y, CellTypes.STAIRS_DOWN);
        levelModel.setStairsDown(randomCell.x, randomCell.y);
    }
    /**
     * Creates and returns connection between any two points on map.
     *
     * @param   levelModel      Model of level on which we want to create connection
     * @param   direction       Preferred direction in which connection can be made, either horizontal or vertical
     * @param   point1          Starting point
     * @param   point2          Target point
     * @param   newCells        Array of string cell types of cells after change.
     * @param   forbiddenCells  Array of string cell types which are forbidden to change/encounter. If algorithm
     *                          encounters such cell on its path, it stops and returns false, meaning that connection
     *                          was not successful
     * @returns                 Array of position objects of newly created corridor or false if creation wasn't
     *                          successful
     */
    protected createConnectionBetweenTwoPoints(
        levelModel: LevelModel,
        direction: string,
        point1: Position,
        point2: Position,
        newCells: string[],
        forbiddenCells: string[] = [],
    ): boolean | Position[] {
        const firstCell: Cell = levelModel.getCellFromPosition(point1);
        const secondCell: Cell = levelModel.getCellFromPosition(point2);
        const horizontalDirection: directionType = Math.sign(point2.x - point1.x) as directionType;
        const verticalDirection: directionType = Math.sign(point2.y - point1.y) as directionType;
        const cellsToChangeArray: Cell[] = [];
        const createdCorridor: Position[] = [];
        let firstMiddlePoint: Position;
        let secondMiddlePoint: Position;
        let examinedX: number;
        let examinedY: number;
        let examinedCell: Cell;
        let middlePointValue: number;
        let isCreationSuccessful: boolean = true;

        cellsToChangeArray.push(firstCell);

        if (DIRECTION_HORIZONTAL === direction) {
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
            cellsToChangeArray.forEach((room: Cell) => {
                createdCorridor.push(new Position(room.x, room.y));
                levelModel.changeCellType(room.x, room.y, newCells.random());
            });

            return createdCorridor;
        }

        return isCreationSuccessful;
    }
    /**
     * Randomly generates monsters in dungeon.
     *
     * @param levelModel Model of dungeon level
     */
    public generateMonsters(levelModel: LevelModel): void {
        for (let i = 0; i < MONSTERS_LIMIT_PER_LEVEL; i++) {
            const randomCell: Cell = levelModel.getRandomUnoccupiedCell();

            if (randomCell) {
                // const monsterController: MonsterController = monsterFactory.getGiantRatController(levelModel, randomCell);
                // randomCell.setEntity(monsterController.getModel());
                // levelModel.notify(DungeonEvents.NEW_CREATURE_SPAWNED, monsterController);
            }
        }
    }
}
