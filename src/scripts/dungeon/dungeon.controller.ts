import { LevelController } from './level.controller';
import { DungeonBranches } from './constants/dungeonTypes.constants';
import { getDungeonStrategyInstance } from './factory/dungeonStrategy.factory';
import { MainDungeonLevelGenerationStrategy } from './strategy/mainDungeon.strategy';
import { BaseController } from '../core/base.controller';
import { DungeonEvents } from '../constants/dungeon_events';
import { IActionAttempt } from '../interfaces/common';
import { globalMessagesController } from '../messages/messages.controller';
import { DevFeaturesModalController } from '../modal/developmentFeatures/devFeaturesModal.controller';
import { DevDungeonModalEvents } from '../constants/events/devDungeonModalEvents';
import { Monsters } from '../entity/constants/monsters';
import { PlayerController } from '../entity/controllers/player.controller';
import { Cell } from './models/cells/cell_model';
import { dungeonState } from '../state/application.state';
import { LevelControllerFactory } from './factory/levelController.factory';

/**
 * Controller of single dungeon.
 */
export class DungeonController extends BaseController {
  private get strategy(): MainDungeonLevelGenerationStrategy {
    return getDungeonStrategyInstance(dungeonState.currentBranch);
  }

  constructor() {
    super();

    this.initialize();
    this.attachEvents();
  }

  /**
   * Initialization of dungeon controller instance.
   */
  protected initialize(): void {
    if (!dungeonState.hasStateBeenLoadedFromData) {
      this.generateNewLevel();
    }
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

  public generateNewLevel(num?: number): void {
    const { currentBranchMaxLevelNumber, currentBranch } = dungeonState;
    const nextLevelNumberToGenerateInCurrentBranch =
      num ?? dungeonState.getCurrentBranchNextLevelNumber();

    if (nextLevelNumberToGenerateInCurrentBranch) {
      const newLevelController = LevelControllerFactory.getInstance({
        branch: currentBranch,
        levelNumber: nextLevelNumberToGenerateInCurrentBranch,
      });

      dungeonState.addNewLevelControllerToCurrentBranch(
        newLevelController,
        nextLevelNumberToGenerateInCurrentBranch,
      );

      this.strategy.generateRandomLevel(newLevelController, {
        generateStairsDown:
          nextLevelNumberToGenerateInCurrentBranch !==
          currentBranchMaxLevelNumber,
      });
    }
  }

  public generateNewLevelAtNumber(num: number): void {
    this.generateNewLevel(num);
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
   * Generates new level controller with model in place of current level. Current level number is model is changed in this process.
   * @private
   */
  private recreateCurrentLevel(): void {
    const { currentLevelNumber } = dungeonState;

    this.generateNewLevelAtNumber(currentLevelNumber);

    dungeonState.setCurrentLevelNumber(currentLevelNumber);
  }

  private onDevModalMonsterSpawn(monster: Monsters): void {
    const currentLevel = dungeonState.getCurrentLevelController();
    const playerController = PlayerController.getInstance();
    const playerFov = playerController.getPlayerFov();
    const unOccupiedCell = playerFov.find(
      (cell: Cell) => !cell.blockMovement && !cell.entity,
    );

    currentLevel.spawnMonsterInSpecificCell(unOccupiedCell, monster);
    playerController.endTurn();
  }
}
