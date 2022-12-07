import { getDungeonStrategyInstance } from './factory/dungeonStrategy.factory';
import { MainDungeonLevelGenerationStrategy } from './strategy/mainDungeon.strategy';
import { IActionAttempt } from '../interfaces/common';
import { globalMessagesController } from '../messages/messages.service';
import { Monsters } from '../entity/constants/monsters';
import { PlayerEntity } from '../entity/entities/player.entity';
import { Cell } from './models/cells/cell_model';
import { dungeonState } from '../state/application.state';
import { LevelFactory } from './factory/level.factory';
import { gameEventBus } from '../eventBus/gameEventBus/gameEventBus';
import { GameEventBusEventNames } from '../eventBus/gameEventBus/gameEventBus.constants';

/**
 * Controller of single dungeon.
 */
export class Dungeon {
  private get strategy(): MainDungeonLevelGenerationStrategy {
    return getDungeonStrategyInstance(dungeonState.currentBranch);
  }

  constructor() {
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
    gameEventBus.subscribe(GameEventBusEventNames.RecreateCurrentLevel, this.recreateCurrentLevel);
    gameEventBus.subscribe(GameEventBusEventNames.SpawnMonster, this.onDevModalMonsterSpawn);
  }

  public generateNewLevel(num?: number): void {
    const { currentBranchMaxLevelNumber, currentBranch } = dungeonState;
    const nextLevelNumberToGenerateInCurrentBranch =
      num ?? dungeonState.getCurrentBranchNextLevelNumber();

    if (nextLevelNumberToGenerateInCurrentBranch) {
      const newLevelController = LevelFactory.getInstance({
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
  private recreateCurrentLevel = (): void => {
    const { currentLevelNumber } = dungeonState;

    this.generateNewLevelAtNumber(currentLevelNumber);

    dungeonState.setCurrentLevelNumber(currentLevelNumber);
  }

  private onDevModalMonsterSpawn = (monster: Monsters): void => {
    const currentLevel = dungeonState.getCurrentLevelController();
    const playerController = PlayerEntity.getInstance();
    const playerFov = playerController.getPlayerFov();
    const unOccupiedCell = playerFov.find(
      (cell: Cell) => !cell.blockMovement && !cell.entity,
    );

    currentLevel.spawnMonsterInSpecificCell(unOccupiedCell, monster);
    playerController.endTurn();
  }
}
