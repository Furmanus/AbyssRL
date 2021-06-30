import { DungeonModel } from '../../model/dungeon/dungeon_model';
import { LevelController } from './level_controller';
import { DungeonBranches, MAIN_DUNGEON } from '../../constants/dungeon_types';
import { getDungeonStrategyInstance } from '../../factory/strategy_factory';
import { MainDungeonLevelGenerationStrategy } from '../../strategy/dungeon_generator/main_dungeon_strategy';
import { Controller } from '../controller';
import { DungeonEvents } from '../../constants/dungeon_events';
import { IActionAttempt } from '../../interfaces/common';
import { globalMessagesController } from '../../global/messages';
import { DevFeaturesModalController } from '../dev_features_modal_controller';
import { DevDungeonModalEvents } from '../../constants/events/devDungeonModalEvents';
import { config } from '../../global/config';
import { Monsters } from '../../constants/monsters';
import { PlayerController } from '../entity/player_controller';
import { Cell } from '../../model/dungeon/cells/cell_model';
import { MonsterFactory } from '../../factory/monster_factory';

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
  private readonly levels: Record<string, LevelController>;
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
    const devFeaturesModalController = DevFeaturesModalController.getInstance();

    this.model.on(
      this,
      DungeonEvents.ChangeCurrentLevel,
      this.onChangeCurrentLevelProperty.bind(this),
    );

    devFeaturesModalController.on(
      this,
      DevDungeonModalEvents.RecreateCurrentLevel,
      this.recreateCurrentLevel,
    );

    devFeaturesModalController.on(
      this,
      DevDungeonModalEvents.SpawnMonster,
      this.onDevModalMonsterSpawn,
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

  private generateNewLevelAtNumber(num: number): void {
    const { maxLevelNumber } = this.model;

    this.levels[num] = new LevelController({
      branch: this.type,
      levelNumber: num,
    });

    this.strategy.generateRandomLevel(this.levels[num].getModel(), {
      generateStairsDown: !(num === maxLevelNumber),
    });
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
      console.error("Can't find dungeon level");
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

  /**
   * Returns controller of level on which player currently is.
   * @private
   */
  private getCurrentLevelController(): LevelController {
    return this.levels[this.model.getCurrentLevelNumber()];
  }

  /**
   * Generates new level controller with model in place of current level. Current level number is model is changed in this process.
   * @private
   */
  private recreateCurrentLevel(): void {
    const currentLevel = this.model.getCurrentLevelNumber();

    this.generateNewLevelAtNumber(currentLevel);
    this.model.setCurrentLevelNumber(currentLevel);
  }

  private onDevModalMonsterSpawn(monster: Monsters): void {
    const currentLevel = this.getCurrentLevelController();
    const playerController = PlayerController.getInstance();
    const playerFov = playerController.getPlayerFov();
    const unOccupiedCell = playerFov.find(
      (cell: Cell) => !cell.blockMovement && !cell.entity,
    );

    currentLevel.spawnMonsterInSpecificCell(unOccupiedCell, monster);
    playerController.endTurn();
  }
}
