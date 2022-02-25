import { DungeonBranches } from '../constants/dungeonTypes.constants';
import { MainDungeonLevelGenerationStrategy } from '../strategy/mainDungeon.strategy';

type AllDungeonStrategies = MainDungeonLevelGenerationStrategy;

const dungeonTypeToStrategy: Record<DungeonBranches, any> = {
  [DungeonBranches.Main]: MainDungeonLevelGenerationStrategy.getInstance(),
};

export function getDungeonStrategyInstance<
  M = MainDungeonLevelGenerationStrategy,
>(dungeonType: DungeonBranches): M {
  return dungeonTypeToStrategy[dungeonType];
}
