import { DungeonState } from './dungeon.state';
import { DungeonBranches } from '../constants/dungeon_types';
import type { SerializedDungeonState } from './applicationState.interfaces';

export type PartialDungeonState = Pick<
  DungeonState,
  'currentLevelNumber' | 'currentBranch' | 'parentDungeonBranch'
>;

let dungeonState: DungeonState;
let hasStateBeenLoaded = false;
const defaultDungeonState: PartialDungeonState = {
  currentLevelNumber: 1,
  currentBranch: DungeonBranches.Main,
  parentDungeonBranch: null,
};

function initState(
  state: PartialDungeonState | SerializedDungeonState = defaultDungeonState,
): void {
  dungeonState = new DungeonState(state);
  (window as any).dungeonState = dungeonState;
  hasStateBeenLoaded = true;
}

// TODO check type
(window as any).dungeonState = dungeonState;

export { dungeonState, initState, hasStateBeenLoaded };
