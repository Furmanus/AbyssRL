import { DungeonState } from './dungeon.state';
import { DungeonBranches } from '../dungeon/constants/dungeonTypes.constants';
import { applicationConfigService } from '../global/config';

export type PartialDungeonState = Pick<
  DungeonState,
  'currentLevelNumber' | 'currentBranch' | 'parentDungeonBranch'
>;
const defaultDungeonState: PartialDungeonState = {
  currentLevelNumber: 1,
  currentBranch: DungeonBranches.Main,
  parentDungeonBranch: null,
};

const dungeonState = new DungeonState();

if (applicationConfigService.isTestMode || applicationConfigService.isDevMode) {
  window.dungeonState = dungeonState;
}

export { dungeonState };
