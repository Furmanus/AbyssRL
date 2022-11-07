import { DungeonBranches } from '../constants/dungeonTypes.constants';

export interface ILevelInfo {
  branch: DungeonBranches;
  levelNumber: number;
}

export type LevelNumberType = '1' | '2' |'3' | '4' |'5' | '6' |'7' | '8';
