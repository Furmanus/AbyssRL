import { ArenaLevelGenerator } from '../../generators/level_generators/arena';
import { CavernLevelGenerator } from '../../generators/level_generators/cavern';
import { DungeonLevelGenerator } from '../../generators/level_generators/dungeon';
import * as Rng from '../../helper/rng';
import { config } from '../../global/config';
import { LevelModel } from '../../model/dungeon/level_model';
import { IDungeonStrategyGenerateLevelConfig } from '../../interfaces/generators';
import { Cell } from '../../model/dungeon/cells/cell_model';
import { weaponModelFactory } from '../../factory/item/weapon_model_factory';
import { WeaponModel } from '../../model/items/weapons/weapon_model';
import { ArmourModelFactory } from '../../factory/item/armour_model_factory';
import { LevelController } from '../../controller/dungeon/level_controller';

type AllGeneratorsTypes =
  | ArenaLevelGenerator
  | CavernLevelGenerator
  | DungeonLevelGenerator;

interface ITypeToGenerator {
  [prop: string]: AllGeneratorsTypes;
}

const arenaLevelGenerator: ArenaLevelGenerator =
  ArenaLevelGenerator.getInstance();
const cavernLevelGenerator: CavernLevelGenerator =
  CavernLevelGenerator.getInstance();
const dungeonLevelGenerator: DungeonLevelGenerator =
  DungeonLevelGenerator.getInstance();

const typeToGenerator: ITypeToGenerator = {
  dungeon: dungeonLevelGenerator,
  arena: arenaLevelGenerator,
  cavern: cavernLevelGenerator,
};

const constructorToken = Symbol('MainDungeonLevelGeneratorStrategy');
let instance: MainDungeonLevelGenerationStrategy = null;

export class MainDungeonLevelGenerationStrategy {
  public constructor(token: symbol) {
    if (token !== constructorToken) {
      throw new Error('Invalid constructor invocation');
    }
  }

  public static getInstance(): MainDungeonLevelGenerationStrategy {
    if (!instance) {
      instance = new MainDungeonLevelGenerationStrategy(constructorToken);
    }

    return instance;
  }

  public generateRandomLevel(
    levelController: LevelController,
    generateConfig: IDungeonStrategyGenerateLevelConfig,
  ): void {
    const { model: levelModel } = levelController;
    const { levelNumber } = levelModel;
    const defaultLevelTypeGenerator =
      config.defaultLevelType && typeToGenerator[config.defaultLevelType];

    if (config.defaultLevelType && defaultLevelTypeGenerator) {
      defaultLevelTypeGenerator.generateLevel(levelController, generateConfig);
    } else {
      switch (levelNumber) {
        default:
          const percentDieRoll: number = Rng.getPercentage();

          if (percentDieRoll < 33) {
            arenaLevelGenerator.generateLevel(levelController, generateConfig);
          } else if (percentDieRoll < 66) {
            cavernLevelGenerator.generateLevel(levelController, generateConfig);
          } else {
            dungeonLevelGenerator.generateLevel(
              levelController,
              generateConfig,
            );
          }
      }
    }

    this.fillLevelWithItems(levelModel);
  }

  public fillLevelWithItems(levelModel: LevelModel): void {
    for (let i = 0; i < 10; i++) {
      const randomCell: Cell = levelModel.getRandomUnoccupiedCell();
      const weaponModel: WeaponModel =
        weaponModelFactory.getRandomWeaponModel();
      const armourModel = ArmourModelFactory.getRandomArmourModel();

      randomCell.inventory.add(Math.random() < 0.5 ? weaponModel : armourModel);
    }
  }
}
