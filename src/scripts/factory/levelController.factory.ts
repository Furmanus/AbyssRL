import {
  ILevelControllerConstructorConfig,
  LevelController,
} from '../controller/dungeon/level_controller';

export class LevelControllerFactory {
  public static getInstance(
    config: ILevelControllerConstructorConfig,
  ): LevelController {
    return new LevelController(config);
  }
}
