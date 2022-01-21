import { DungeonState } from './dungeon.state';
import { DungeonBranches } from '../constants/dungeon_types';

const dungeonState = new DungeonState(1, DungeonBranches.Main);

// TODO check type
(window as any).dungeonState = dungeonState;

export { dungeonState };
