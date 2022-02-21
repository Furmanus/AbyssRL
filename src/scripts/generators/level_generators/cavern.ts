import { config as globalConfig } from '../../global/config';
import { AbstractLevelGenerator } from './abstract_generator';
import { CellTypes } from '../../constants/cells/cell_types';
import { Map } from 'rot-js';
import { LevelModel } from '../../model/dungeon/level_model';
import { IAnyFunction } from '../../interfaces/common';
import { ICavernGenerateLevelConfig } from '../../interfaces/generators';
import Cellular from 'rot-js/lib/map/cellular';
import { LevelController } from '../../controller/dungeon/level_controller';

const singletonToken: symbol = Symbol('Cavern level generator singleton token');
let instance: CavernLevelGenerator;

/**
 * Class representing generator of cavern type levels. Uses cellular automata's algorithm to generate caverns and
 * afterwards it connects stairs down and up, so it is guaranteed that always there is a clear passage between stairs.
 * ArenaLevelGenerator is singleton, only one instance is available. Use CavernLevelGenerator.getInstance() method to
 * get it.
 */
export class CavernLevelGenerator extends AbstractLevelGenerator {
  /**
   * @param   token   Unique symbol used to generate only instance of class.
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
   * Method responsible for generating cavern level.
   *
   * @param   levelController    Level controller which models cells will be modified.
   * @param   config          Object with configuration parameters.
   * @param   debugCallback   Optional: callback for rot.js generator for debugging purpose.
   */
  public generateLevel(
    levelController: LevelController,
    config?: ICavernGenerateLevelConfig,
    debugCallback?: IAnyFunction,
  ): void {
    const { model: level } = levelController;
    const solidCellProbability = (config && config.solidCellProbability) || 0.5;
    const born = (config && config.born) || [5, 6, 7, 8];
    const survive = (config && config.survive) || [4, 5, 6, 7, 8];

    const generator: Cellular = new Map.Cellular(
      globalConfig.LEVEL_WIDTH - 2,
      globalConfig.LEVEL_HEIGHT - 2,
      {
        born,
        survive,
      },
    );

    level.initialize();

    generator.randomize(solidCellProbability);
    for (let i = 0; i < 4; i++) {
      generator.create();
    }
    generator.create(debugCallback || generatorCallback);

    function generatorCallback(x: number, y: number, value: number): void {
      if (value === 1) {
        level.changeCellType(x + 1, y + 1, CellTypes.Mountain);
      } else {
        level.changeCellType(x + 1, y + 1, CellTypes.Grass);
      }
      if (x === 1 && y === 1) {
        level.changeCellType(1, 1, CellTypes.WoodenSolidDoors);
      }
    }

    generator.connect((x: number, y: number, value: number) => {
      if (value === 0) {
        level.changeCellType(x + 1, y + 1, CellTypes.Grass);
      }
    }, 0);
    this.smoothLevel(level, {
      cellsToSmooth: [CellTypes.HighPeaks, CellTypes.Mountain],
      cellsToChange: [CellTypes.Grass],
      cellsAfterChange: [CellTypes.Hills],
    });
    this.smoothLevelHills(level);
    this.generateRandomStairsUp(level);
    if (config && config.generateStairsDown) {
      this.generateRandomStairsDown(level);
    }

    this.generateMonsters(levelController);
  }

  /**
   * Returns only created instance of cavern level generator.
   *
   * @returns   Returns only available instance of CavernLevelGenerator
   */
  public static getInstance(): CavernLevelGenerator {
    if (!instance) {
      instance = new CavernLevelGenerator(singletonToken);
    }

    return instance;
  }
}
