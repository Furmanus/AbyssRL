import {
  ILevelConstructorConfig,
  Level,
} from '../level';

export class LevelFactory {
  public static getInstance(
    config: ILevelConstructorConfig,
  ): Level {
    return new Level(config);
  }
}
