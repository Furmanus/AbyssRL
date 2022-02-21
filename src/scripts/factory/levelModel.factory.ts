import { LevelModel, SerializedLevel } from '../model/dungeon/level_model';
import type { DungeonBranches } from '../constants/dungeon_types';

export class LevelModelFactory {
  public static getNewLevelModel(
    branch: DungeonBranches,
    levelNumber: number,
  ): LevelModel {
    return new LevelModel(branch, levelNumber);
  }

  public static getLevelModelFromSerializedData(
    serializedData: SerializedLevel,
  ): LevelModel {
    const { branch, levelNumber } = serializedData;

    return new LevelModel(branch, levelNumber, serializedData);
  }
}
