import { DungeonModel } from '../../model/dungeon/dungeon_model';
import { LevelController } from './level_controller';
import { DungeonBranches, MAIN_DUNGEON } from '../../constants/dungeon_types';
import { getDungeonStrategyInstance } from '../../factory/strategy_factory';
import { MainDungeonLevelGenerationStrategy } from '../../strategy/dungeon_generator/main_dungeon_strategy';
import { Controller } from '../controller';
import { DungeonEvents } from '../../constants/dungeon_events';
import { IActionAttempt } from '../../interfaces/common';
import { globalMessagesController } from '../../global/messages';

export interface ILevelControllersMap {
  [prop: string]: LevelController;
}

/**
 * Controller of single dungeon.
 */
export class DungeonController extends Controller {
  /**
   * Type of dungeon.
   */
  private readonly type: DungeonBranches;
  /**
   * Model of dungeon.
   */
  private readonly model: DungeonModel;
  /**
   * Object with level controllers. Key is equal to level number.
   */
  private readonly levels: ILevelControllersMap;
  private readonly strategy: MainDungeonLevelGenerationStrategy;

  constructor(
    type: DungeonBranches = MAIN_DUNGEON,
    maxLevelNumber: number = 8,
  ) {
    super();

    this.type = type;
    this.model = new DungeonModel(type, maxLevelNumber);
    this.levels = {};
    this.strategy = getDungeonStrategyInstance(this.type);

    this.initialize();
    this.attachEvents();
  }

  /**
   * Initialization of dungeon controller instance.
   */
  protected initialize(): void {
    this.generateNewLevel();
  }

  protected attachEvents(): void {
    this.model.on(
      this,
      DungeonEvents.ChangeCurrentLevel,
      this.onChangeCurrentLevelProperty.bind(this),
    );
  }

  private generateNewLevel(): void {
    const { maxLevelNumber } = this.model;

    for (let counter = 1; counter <= maxLevelNumber; counter++) {
      if (!this.levels[counter]) {
        this.levels[counter] = new LevelController({
          branch: this.type,
          levelNumber: counter,
        });

        this.strategy.generateRandomLevel(this.levels[counter].getModel(), {
          generateStairsDown: !(counter === maxLevelNumber),
        });
      }
    }
  }

  /**
   * Returns certain level controller from dungeon.
   *
   * @param   levelNumber     Number of level in dungeon
   * @returns                 Returns level controller of given level number
   */
  public getLevel(levelNumber: number): LevelController {
    try {
      return this.levels[levelNumber];
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.error("Can't find dungeon level");
      // tslint:disable-next-line:no-console
      console.error(e.stack);
    }
  }

  /**
   * Changes level number on which player currently is in model.
   *
   * @param num   Level number
   */
  public changeLevel(num: number): void {
    const canChangeLevel: IActionAttempt = this.model.canChangeLevel(num);

    if (canChangeLevel.result) {
      this.model.setCurrentLevelNumber(num);
    } else {
      globalMessagesController.showMessageInView(canChangeLevel.message);
    }
  }

  /**
   * Method triggered when currentLevelNumber property in model has changed.
   *
   * @param data  Data passed along with event
   */
  private onChangeCurrentLevelProperty(data: {
    levelNumber: number;
    direction: string;
  }): void {
    const newLevelController: LevelController = this.getLevel(data.levelNumber);

    this.notify(DungeonEvents.ChangeCurrentLevel, {
      newLevelController,
      direction: data.direction,
    });
  }

  /**
   * Returns model of dungeon.
   */
  public getDungeonModel(): DungeonModel {
    return this.model;
  }

  /**
   * Returns type of dungeon.
   */
  public getType(): string {
    return this.type;
  }

  /**
   * Returns number of level on which player currently is.
   */
  public getCurrentLevelNumber(): number {
    return this.model.getCurrentLevelNumber();
  }
}
