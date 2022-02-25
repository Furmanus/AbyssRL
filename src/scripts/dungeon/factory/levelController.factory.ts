import {
  ILevelControllerConstructorConfig,
  LevelController,
} from '../level.controller';

export class LevelControllerFactory {
  public static getInstance(
    config: ILevelControllerConstructorConfig,
  ): LevelController {
    return new LevelController(config);
  }
}
