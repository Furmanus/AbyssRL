import { DungeonState } from './dungeon.state';
import { DungeonBranches } from '../dungeon/constants/dungeonTypes.constants';
import type { SerializedDungeonState } from './applicationState.interfaces';

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

// TODO check type
(window as any).dungeonState = dungeonState;

export { dungeonState };
