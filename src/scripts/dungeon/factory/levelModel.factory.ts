import { LevelModel, SerializedLevel } from '../models/level_model';
import type { DungeonBranches } from '../constants/dungeonTypes.constants';

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
