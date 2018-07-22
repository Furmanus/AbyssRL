import {AbstractLevelGenerator} from './abstract_generator';
import {config as globalConfig} from '../../global/config';
import {cellTypes} from '../../constants/cell_types';
import {Utility} from '../../helper/utility';
import ROT from 'rot-js';

const singletonToken = Symbol('ArenaLevelGenerator singleton token');
let instance;

export class ArenaLevelGenerator extends AbstractLevelGenerator {
    /**
     * @constructor
     * @typedef {ArenaLevelGenerator}
     * @param {Symbol}  token   Unique symbol token used to create only instance.
     */
    constructor (token) {
        super();

        if(token !== singletonToken){
            throw new Error(`Can't create instance of singleton class with new keyword. Use getInstance() static method instead`);
        }
    }
    /**
     * Generates arena big room from given level cells.
     * @param {LevelModel}       level              Level cells in array.
     * @param {Object}           config             Additional level config info.
     * @param {function}         debugCallback      Optional callback function serving as debug for map generation
     */
    generateLevel (level, config = {}, debugCallback) {
        const generator = new ROT.Map.Arena(globalConfig.LEVEL_WIDTH, globalConfig.LEVEL_HEIGHT);

        generator.create(debugCallback || generatorCallback);

        function generatorCallback(x, y, value){
            if(value === 1){
                level.changeCellType(x, y, cellTypes.HIGH_PEAKS);
            }else{
                level.changeCellType(x, y, cellTypes.GRASS);
            }
        }

        this.fillLevelWithVoronoiPoints(level, {
            targetCellType: cellTypes.SHALLOW_WATER,
            cellsAllowedToChange: cellTypes.GRASS
        });
        this.smoothShallowWaterCoastline(level);
        this.generateDeepWater(level);
        this.changeEveryCellInLevel(level, {
            cellsToChange: [cellTypes.GRASS],
            cellsAfterChange: [cellTypes.BUSH, cellTypes.BUSH, cellTypes.BUSH, cellTypes.TREE],
            probability: 70
        });
        this.generateRandomStairsUp(level);
        this.generateRandomStairsDown(level);
    }
    /**
     * Method responsible for creating voronoi diagrams with given cell types on level map.

     * @param {LevelModel}  level                         Level model containing level cells.
     * @param {Object}      config                        Configuration object.
     * @param {string}      config.targetCellType         Array of cell types which will replace changed cells
     * @param {string}      config.cellAllowedToChange    Array of cell types which can be changed.
     */
    fillLevelWithVoronoiPoints (level, config) {
        const {
            targetCellType,
            cellAllowedToChange
        } = config;
        const levelCells = level.getCells();
        let examinedCellsClosestVoronoiPointType;
        let examinedVoronoiPointDistance;
        /**
         * Create 30 random points on map such that no two each points distance is lower than 8
         */
        const randomPoints = this.generateRandomPoints(120, 30);
        /**
         * Create voronoi points from random points. For each random point we create object with point coordinates
         * and cell type. Half created points are target cell type and other are cells allowed to change.
         */
        const voronoiPoints = randomPoints.map(function(item, index){
            return Object.assign(
                {},
                item,
                {
                    type: index < Math.floor(randomPoints.length / 2) ? targetCellType : cellAllowedToChange
                }
            );
        });
        /**
         * Main part of algorithm: we iterate through level cells. For each examined cell, we calculate its distance
         * to closest voronoi point, and change examined cell type to voronoi point type.
         */
        levelCells.forEach(function(examinedCell){
            /**
             * Closest voronoi point to examined cell.
             */
            examinedCellsClosestVoronoiPointType = undefined;
            let examinedCellX = examinedCell.x;
            let examinedCellY = examinedCell.y;
            let validateBorderX = examinedCellX === 0 || examinedCellX === globalConfig.LEVEL_WIDTH - 1;
            let validateBorderY = examinedCellY === 0 || examinedCellY === globalConfig.LEVEL_HEIGHT - 1;

            if(validateBorderX || validateBorderY){
                return;
            }
            /**
             * Iterate through voronoi points to find closest point to examined cell. Store distance for comparision
             * with further points and its type.
             */
            voronoiPoints.forEach(function(examinedVoronoiPoint){
                examinedVoronoiPointDistance = Utility.getDistance(
                    examinedCellX,
                    examinedCellY,
                    examinedVoronoiPoint.x,
                    examinedVoronoiPoint.y
                );
                /**
                 * For first examined voronoi point we just store its distance from examined cell and type.
                 */
                if(!examinedCellsClosestVoronoiPointType){
                    examinedCellsClosestVoronoiPointType = {
                        distance: examinedVoronoiPointDistance,
                        type: examinedVoronoiPoint.type
                    };
                }else {
                    /**
                     * For further voronoi points we compare distance between each voronoi point and examined cell.
                     * Closest one will be stored as closest voronoi point to examined cell.
                     */
                    examinedCellsClosestVoronoiPointType =
                        examinedVoronoiPointDistance > examinedCellsClosestVoronoiPointType.distance ?
                            examinedCellsClosestVoronoiPointType : {
                                distance: examinedVoronoiPointDistance,
                                type: examinedVoronoiPoint.type
                            };
                }
            });

            if(examinedCellsClosestVoronoiPointType.type){
                level.changeCellType(examinedCellX, examinedCellY, examinedCellsClosestVoronoiPointType.type);
            }
        });
    }
    /**
     * Returns only created instance of arena level generator.
     * @returns {ArenaLevelGenerator}
     */
    static getInstance () {
        if(!instance) {
            instance = new ArenaLevelGenerator(singletonToken);
        }

        return instance;
    }
}