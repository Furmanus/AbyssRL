import { AbstractLevelGenerator } from './abstract_generator';
import { config as globalConfig } from '../../global/config';
import { CellTypes } from '../../constants/cells/cell_types';
import * as Utility from '../../helper/utility';
import { Map } from 'rot-js';
import { LevelModel } from '../../model/dungeon/level_model';
import { IAnyFunction } from '../../interfaces/common';
import Arena from 'rot-js/lib/map/arena';
import {
  IDungeonStrategyGenerateLevelConfig,
  IExaminedCellsClosestVoronoiPointType,
  IFillLevelWithVoronoiPointConfig,
} from '../../interfaces/generators';
import { Cell } from '../../model/dungeon/cells/cell_model';
import { Position } from '../../model/position/position';
import { MapWithObserver } from '../../core/map_with_observer';
import { LevelController } from '../../controller/dungeon/level_controller';

const singletonToken: symbol = Symbol('ArenaLevelGenerator singleton token');
let instance: ArenaLevelGenerator;

/**
 * Class representing generator of arena type levels. Creates initially empty rectangular room with size of whole map
 * and changes it in various way. ArenaLevelGenerator is singleton, only one instance is available. Use
 * ArenaLevelGenerator.getInstance() method to get it.
 */
export class ArenaLevelGenerator extends AbstractLevelGenerator {
  /**
   * @param    token   Unique symbol token used to create only instance.
   */
  constructor(token: symbol) {
    super();

    if (token !== singletonToken) {
      throw new Error(
        "Can't create instance of singleton class with new keyword. Use getInstance() static method instead",
      );
    }
  }

  /**
   * Generates arena big room from given level cells.
   *
   * @param   levelController    Level controller which models cells will be modified.
   * @param   config             Additional level config info.
   * @param   debugCallback      Optional callback function serving as debug for map generation
   */
  public generateLevel(
    levelController: LevelController,
    config?: IDungeonStrategyGenerateLevelConfig,
    debugCallback?: IAnyFunction,
  ): void {
    const { model: level } = levelController;
    const generator: Arena = new Map.Arena(
      globalConfig.LEVEL_WIDTH,
      globalConfig.LEVEL_HEIGHT,
    );

    level.initialize();
    generator.create(debugCallback || generatorCallback);

    this.fillLevelWithVoronoiPoints(level, {
      targetCellType: CellTypes.ShallowWater,
      cellAllowedToChange: CellTypes.Grass,
    });
    this.smoothShallowWaterCoastline(level);
    this.generateDeepWater(level);
    this.changeEveryCellInLevel(level, {
      cellsToChange: [CellTypes.Grass],
      cellsAfterChange: [
        CellTypes.Bush,
        CellTypes.Bush,
        CellTypes.Bush,
        CellTypes.Tree,
      ],
      probability: 70,
    });
    this.generateRandomStairsUp(level);
    if (config && config.generateStairsDown) {
      this.generateRandomStairsDown(level);
    }

    this.generateMonsters(levelController);

    function generatorCallback(x: number, y: number, value: number): void {
      if (value === 1) {
        level.changeCellType(x, y, CellTypes.HighPeaks);
      } else {
        level.changeCellType(x, y, CellTypes.Grass);
      }
    }
  }

  /**
   * Method responsible for creating voronoi diagrams with given cell types on level map.
   *
   * @param   level                         Level model containing level cells.
   * @param   config                        Configuration object.
   * @param   config.targetCellType         Array of cell types which will replace changed cells
   * @param   config.cellAllowedToChange    Array of cell types which can be changed.
   */
  public fillLevelWithVoronoiPoints(
    level: LevelModel,
    config: IFillLevelWithVoronoiPointConfig,
  ): void {
    const { targetCellType, cellAllowedToChange } = config;
    const levelCells = level.getCells();
    let examinedCellsClosestVoronoiPointType: IExaminedCellsClosestVoronoiPointType;
    let examinedVoronoiPointDistance: number;
    /**
     * Create 30 random points on map such that no two each points distance is lower than 8
     */
    const randomPoints: Position[] = this.generateRandomPoints(120, 30);
    /**
     * Create voronoi points from random points. For each random point we create object with point coordinates
     * and cell type. Half created points are target cell type and other are cells allowed to change.
     */
    const voronoiPoints: Array<Position & { type: string }> = randomPoints.map(
      (item: Position, index: number) => {
        return Object.assign({}, item, {
          type:
            index < Math.floor(randomPoints.length / 2)
              ? targetCellType
              : cellAllowedToChange,
        });
      },
    );
    /**
     * Main part of algorithm: we iterate through level cells. For each examined cell, we calculate its distance
     * to closest voronoi point, and change examined cell type to voronoi point type.
     */
    levelCells.forEach((examinedCell: Cell) => {
      /**
       * Closest voronoi point to examined cell.
       */
      examinedCellsClosestVoronoiPointType = undefined;
      const examinedCellX: number = examinedCell.x;
      const examinedCellY: number = examinedCell.y;
      const validateBorderX: boolean =
        examinedCellX === 0 || examinedCellX === globalConfig.LEVEL_WIDTH - 1;
      const validateBorderY: boolean =
        examinedCellY === 0 || examinedCellY === globalConfig.LEVEL_HEIGHT - 1;

      if (validateBorderX || validateBorderY) {
        return;
      }
      /**
       * Iterate through voronoi points to find closest point to examined cell. Store distance for comparision
       * with further points and its type.
       */
      voronoiPoints.forEach(
        (examinedVoronoiPoint: Position & { type: string }) => {
          examinedVoronoiPointDistance = Utility.getDistance(
            examinedCellX,
            examinedCellY,
            examinedVoronoiPoint.x,
            examinedVoronoiPoint.y,
          );
          /**
           * For first examined voronoi point we just store its distance from examined cell and type.
           */
          if (!examinedCellsClosestVoronoiPointType) {
            examinedCellsClosestVoronoiPointType = {
              distance: examinedVoronoiPointDistance,
              type: examinedVoronoiPoint.type,
            };
          } else {
            /**
             * For further voronoi points we compare distance between each voronoi point and examined cell.
             * Closest one will be stored as closest voronoi point to examined cell.
             */
            examinedCellsClosestVoronoiPointType =
              examinedVoronoiPointDistance >
              examinedCellsClosestVoronoiPointType.distance
                ? examinedCellsClosestVoronoiPointType
                : {
                    distance: examinedVoronoiPointDistance,
                    type: examinedVoronoiPoint.type,
                  };
          }
        },
      );

      if (examinedCellsClosestVoronoiPointType.type) {
        level.changeCellType(
          examinedCellX,
          examinedCellY,
          examinedCellsClosestVoronoiPointType.type,
        );
      }
    });
  }

  /**
   * Returns only created instance of arena level generator.
   *
   * @returns     Returns only instance of ArenaLevelGenerator
   */
  public static getInstance(): ArenaLevelGenerator {
    if (!instance) {
      instance = new ArenaLevelGenerator(singletonToken);
    }

    return instance;
  }
}
