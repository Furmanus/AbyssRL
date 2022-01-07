import { LevelController } from './level_controller';
import { DungeonBranches } from '../../constants/dungeon_types';
import { getDungeonStrategyInstance } from '../../factory/strategy_factory';
import { MainDungeonLevelGenerationStrategy } from '../../strategy/dungeon_generator/main_dungeon_strategy';
import { Controller } from '../controller';
import { DungeonEvents } from '../../constants/dungeon_events';
import { IActionAttempt } from '../../interfaces/common';
import { globalMessagesController } from '../../global/messages';
import { DevFeaturesModalController } from '../dev_features_modal_controller';
import { DevDungeonModalEvents } from '../../constants/events/devDungeonModalEvents';
import { Monsters } from '../../constants/entity/monsters';
import { PlayerController } from '../entity/player_controller';
import { Cell } from '../../model/dungeon/cells/cell_model';
import { dungeonState } from '../../state/application.state';

/**
 * Controller of single dungeon.
 */
export class DungeonController extends Controller {
  /**
   * Type of dungeon.
   */
  private readonly type: DungeonBranches;
  /**
   * Object with level controllers. Key is equal to level number.
   */
  private readonly levels: Record<string, LevelController>;
  private readonly strategy: MainDungeonLevelGenerationStrategy;

  constructor(
    type: DungeonBranches = DungeonBranches.Main,
    maxLevelNumber: number = 8,
  ) {
    super();

    this.type = type;
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
    const { currentBranchMaxLevel } = dungeonState;

    for (let counter = 1; counter <= currentBranchMaxLevel; counter++) {
      if (!this.levels[counter]) {
        this.levels[counter] = new LevelController({
          branch: this.type,
          levelNumber: counter,
        });

        this.strategy.generateRandomLevel(this.levels[counter], {
          generateStairsDown: !(counter === currentBranchMaxLevel),
        });
      }
    }
  }

  private generateNewLevelAtNumber(num: number): void {
    const { currentBranchMaxLevel } = dungeonState;

    this.levels[num] = new LevelController({
      branch: this.type,
      levelNumber: num,
    });

    this.strategy.generateRandomLevel(this.levels[num], {
      generateStairsDown: !(num === currentBranchMaxLevel),
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
    const canChangeLevel: IActionAttempt = dungeonState.canChangeLevel(num);

    if (canChangeLevel.result) {
      dungeonState.setCurrentLevelNumber(num);
    } else {
      globalMessagesController.showMessageInView(canChangeLevel.message);
    }
  }

  /**
   * Returns type of dungeon.
   */
  public getType(): string {
    return this.type;
  }

  /**
   * Returns controller of level on which player currently is.
   * @private
   */
  private getCurrentLevelController(): LevelController {
    return this.levels[dungeonState.currentLevelNumber];
  }

  /**
   * Generates new level controller with model in place of current level. Current level number is model is changed in this process.
   * @private
   */
  private recreateCurrentLevel(): void {
    const { currentLevelNumber } = dungeonState;

    this.generateNewLevelAtNumber(currentLevelNumber);

    dungeonState.setCurrentLevelNumber(currentLevelNumber);
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
