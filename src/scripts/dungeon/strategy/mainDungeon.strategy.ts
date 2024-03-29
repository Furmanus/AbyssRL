import { ArenaLevelGenerator } from '../generators/arena.generator';
import { CavernLevelGenerator } from '../generators/cavern.generator';
import { DungeonLevelGenerator } from '../generators/dungeon.generator';
import { rngService } from '../../utils/rng.service';
import { config } from '../../global/config';
import { LevelModel } from '../models/level_model';
import { IDungeonStrategyGenerateLevelConfig } from '../generators/generators.interfaces';
import { Cell } from '../models/cells/cell_model';
import { WeaponModelFactory } from '../../items/factory/item/weaponModel.factory';
import { WeaponModel } from '../../items/models/weapons/weapon.model';
import { ArmourModelFactory } from '../../items/factory/item/armour_model_factory';
import { Level } from '../level';
import { Coin } from '../../position/coin';

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
    levelController: Level,
    generateConfig: IDungeonStrategyGenerateLevelConfig,
  ): void {
    const { model: levelModel } = levelController;
    const { levelNumber } = levelModel;
    const defaultLevelTypeGenerator =
      config.defaultLevelType && typeToGenerator[config.defaultLevelType];

    if (config.defaultLevelType && defaultLevelTypeGenerator) {
      defaultLevelTypeGenerator.generateLevel(levelController, generateConfig);
    } else {
      let percentDieRoll: number;

      switch (levelNumber) {
        default:
          percentDieRoll = rngService.getPercentage();

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
        WeaponModelFactory.getRandomWeaponModel();
      const armourModel = ArmourModelFactory.getRandomArmourModel();

      randomCell.inventory.add(Coin.toss() ? weaponModel : armourModel);
    }
  }
}
