import { DungeonBranches, MAIN_DUNGEON } from '../constants/dungeon_types';
import { MainDungeonLevelGenerationStrategy } from '../strategy/dungeon_generator/main_dungeon_strategy';
import { IAnyObject } from '../interfaces/common';

type AllDungeonStrategies = MainDungeonLevelGenerationStrategy;

const dungeonTypeToStrategy: Record<DungeonBranches, any> = {
  [DungeonBranches.Main]: MainDungeonLevelGenerationStrategy.getInstance(),
};

export function getDungeonStrategyInstance<
  M = MainDungeonLevelGenerationStrategy,
>(dungeonType: DungeonBranches): M {
  return dungeonTypeToStrategy[dungeonType];
}
