import {cellTypes} from '../../constants/cell_types';
import {config as globalConfig} from '../../global/config';

/**
 * @class
 * @abstract
 * @typedef {AbstractLevelGenerator}
 */
export class AbstractLevelGenerator{

    constructor(){
        if(new.target){
            throw new Error(`Can't make instance of abstract generator class.`);
        }
    }
    //TODO nie działa
    generateTestLevel(levelCells, config){
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
     * @param {Map}             levelCells                  Map containing level cell models.
     * @param {Object}          config                      Configuration object.
     * @param {Array.<string>}  config.cellsToSmooth        Cells which we are looking for in surrounding of examined
     *                                                      cell.
     * @param {Array.<string>}  config.cellsToChange        Cells to change if cell to smooth is detected in its
     *                                                      surrounding.
     * @param {Array.<string>}  config.cellsAfterChange     Cells (randomly selected) which will appear in place of
     *                                                      changed cells.
     */
    smoothLevel(levelCells, config = {}){
        const cellsToSmooth = config.cellsToSmooth || [];
        const cellsToChange = config.cellsToChange || [];
        const cellsAfterChange = config.cellsAfterChange || [];
        let examinedCellNeighbours;

        if(cellsToSmooth.length && cellsToChange.length && cellsAfterChange.length){
            levelCells.forEach(function(examinedCell){
                if(cellsToChange.includes(examinedCell.type)) {
                    examinedCellNeighbours = AbstractLevelGenerator.isCertainCellInCellSurroundings(
                        levelCells,
                        examinedCell,
                        cellsToSmooth
                    );
                    if (examinedCellNeighbours.directions.length) {
                        examinedCell.changeCellType(cellsAfterChange.random());
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
     * @param {Map}     levelCells      Map containing level cell models.
     */
    smoothLevelHills(levelCells){
        let examinedCellNeighbours;
        let isHillFromLeftSide;
        let isHillFromRightSide;

        levelCells.forEach(function(examinedCell){
            if(examinedCell.type === cellTypes.GRASS){
                examinedCellNeighbours = AbstractLevelGenerator.isCertainCellInCellSurroundings(
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
                        examinedCell.changeCellType(cellTypes.HILLS);
                    }else if(isHillFromLeftSide && !isHillFromRightSide){
                        examinedCell.changeCellType(cellTypes.RIGHT_HILLS);
                    }else if(!isHillFromLeftSide && isHillFromRightSide){
                        examinedCell.changeCellType(cellTypes.LEFT_HILLS);
                    }
                }
            }
        });
    }
    /**
     * Method responsible for checking if one of given searched cell types is in certain cell surroundings.
     *
     * @param {Map}             levelCells      Map containing level cell models.
     * @param {Cell}            cell            Cell model which surroundings we want to check.
     * @param {Array.<string>}  searchedCells   Array of string which are types of searched cells.
     * @returns {Object}
     */
    static isCertainCellInCellSurroundings(levelCells, cell, searchedCells = []){
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
}