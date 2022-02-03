import { DungeonBranches } from '../constants/dungeon_types';
import { action, makeObservable, observable } from 'mobx';
import { ASCEND, DESCEND } from '../constants/directions';
import { IActionAttempt } from '../interfaces/common';
import { BaseState } from './baseState';
import { LevelModel } from '../model/dungeon/level_model';
import { DungeonStateEntityManager } from './managers/dungeonStateEntity.manager';
import type { LevelController } from '../controller/dungeon/level_controller';
import { EntityController } from '../controller/entity/entity_controller';
import { PartialDungeonState } from './application.state';
import {
  DungeonBranchStructure,
  DungeonStructure,
  SerializedDungeon,
  SerializedDungeonBranchStructure,
  SerializedDungeonState,
} from './applicationState.interfaces';
import { LevelModelFactory } from '../factory/levelModel.factory';
import { LevelControllerFactory } from '../factory/levelController.factory';
import {
  EntityModel,
  SerializedEntityModel,
} from '../model/entity/entity_model';
import { MonstersTypes } from '../constants/entity/monsters';
import { EntityFactory } from '../factory/entity/entity_factory';
import { sleep } from '../helper/utility';
import engine from 'rot-js/lib/engine';

export const dungeonBranchToMaxLevel = {
  [DungeonBranches.Main]: 8,
};

export class DungeonState extends BaseState {
  public hasStateBeenLoadedFromData = false;
  public currentLevelNumber: number;
  public currentBranch: DungeonBranches;
  public parentDungeonBranch: DungeonBranches = null;
  public entityManager = DungeonStateEntityManager.getInstance(this);
  public dungeonsStructure: DungeonStructure = {
    [DungeonBranches.Main]: {},
  };

  public get currentBranchMaxLevelNumber(): number {
    return dungeonBranchToMaxLevel[this.currentBranch];
  }

  public constructor() {
    super();

    this.currentLevelNumber = 1;
    this.currentBranch = DungeonBranches.Main;
    this.parentDungeonBranch = null;

    makeObservable(this, {
      currentLevelNumber: observable,
      setCurrentLevelNumber: action,
    });
  }

  public loadDungeonStateFromData(
    config: PartialDungeonState | SerializedDungeonState,
  ): void {
    const { currentBranch, currentLevelNumber, parentDungeonBranch } = config;

    this.currentLevelNumber = currentLevelNumber || 1;
    this.currentBranch = currentBranch || DungeonBranches.Main;
    this.parentDungeonBranch = parentDungeonBranch ?? null;

    if (
      'dungeonStructure' in config &&
      typeof config.dungeonStructure === 'object' &&
      config.dungeonStructure !== null
    ) {
      this.dungeonsStructure = this.recreateDungeonStructureFromSerializedState(
        config.dungeonStructure,
      );

      this.hasStateBeenLoadedFromData = true;
    }
  }

  public setCurrentLevelNumber(num: number): void {
    const oldLevelNumber: number = this.currentLevelNumber;
    let direction: string;

    if (num <= this.currentBranchMaxLevelNumber) {
      direction = Math.sign(oldLevelNumber - num) > 0 ? ASCEND : DESCEND;

      this.currentLevelNumber = num;
    }
  }

  public canChangeLevel(num: number): IActionAttempt {
    let result: boolean;
    let message: string;

    if (num < 1 && !this.parentDungeonBranch) {
      result = false;
      message = "Passage is blocked, you can't go up here.";
    } else if (num >= 1) {
      result = true;
    }

    return {
      result,
      message,
    };
  }

  public getLevelModel(
    dungeonBranch: DungeonBranches,
    levelNumber: number,
  ): LevelModel {
    return this.dungeonsStructure[dungeonBranch][levelNumber]?.level?.model;
  }

  public getCurrentLevelController(): LevelController {
    return this.dungeonsStructure[this.currentBranch][this.currentLevelNumber]
      .level;
  }

  public getLevelController(
    dungeonBranch: DungeonBranches,
    levelNumber: number,
  ): LevelController {
    return this.dungeonsStructure[dungeonBranch][levelNumber]?.level;
  }

  public getCurrentBranchNextLevelNumber(): number {
    const { currentBranch } = this;
    const currentBranchStructure = this.dungeonsStructure[currentBranch];

    if (currentBranchStructure) {
      const existingLevels = Object.keys(currentBranchStructure).map(Number);

      for (let i = 1; i <= this.currentBranchMaxLevelNumber; i++) {
        if (!existingLevels.includes(i)) {
          return i;
        }
      }

      return null;
    }
  }

  public addNewLevelControllerToCurrentBranch(
    levelController: LevelController,
    levelNumber: number,
  ): void {
    if (!this.dungeonsStructure[this.currentBranch][levelNumber]) {
      this.dungeonsStructure[this.currentBranch][levelNumber] = {
        level: null,
        entities: new Set<EntityController>(),
      };
    }

    this.dungeonsStructure[this.currentBranch][levelNumber].level =
      levelController;
  }

  public serialize(): SerializedDungeonState {
    const serializedDungeon: Partial<SerializedDungeonState> = {
      currentBranch: this.currentBranch,
      currentLevelNumber: this.currentLevelNumber,
      parentDungeonBranch: this.parentDungeonBranch,
      dungeonStructure: {} as SerializedDungeon,
    };

    for (const [dungeonBranch, dungeonBranchEntry] of Object.entries(
      this.dungeonsStructure,
    )) {
      serializedDungeon.dungeonStructure[dungeonBranch as DungeonBranches] = {};

      for (const [levelNumber, levelNumberEntry] of Object.entries(
        dungeonBranchEntry,
      )) {
        serializedDungeon.dungeonStructure[dungeonBranch as DungeonBranches][
          levelNumber as any
        ] = {
          level: levelNumberEntry.level.model.getDataToSerialization(),
          entities: Array.from(levelNumberEntry.entities).map(
            (entityController) => entityController.getModel().serialize(),
          ),
        };
      }
    }

    return serializedDungeon as SerializedDungeonState;
  }

  private recreateDungeonStructureFromSerializedState(
    dungeonStructure: SerializedDungeon,
  ): DungeonStructure {
    const recreatedDungeonStructure: Partial<DungeonStructure> = {};

    for (const [branchName, branchStructure] of Object.entries(
      dungeonStructure,
    )) {
      recreatedDungeonStructure[branchName as DungeonBranches] =
        this.recreateBranchDungeonStructure(
          branchName as DungeonBranches,
          branchStructure,
        );
    }

    return recreatedDungeonStructure as DungeonStructure;
  }

  private recreateBranchDungeonStructure(
    branchName: DungeonBranches,
    branchStructure: SerializedDungeonBranchStructure,
  ): DungeonBranchStructure {
    const dungeonBranchStructure: Partial<DungeonBranchStructure> = {};

    for (const [levelNumber, stateLevelStructure] of Object.entries(
      branchStructure,
    )) {
      const lvlNumber = parseInt(levelNumber, 10);

      dungeonBranchStructure[lvlNumber] = {
        level: LevelControllerFactory.getInstance({
          branch: branchName,
          levelNumber: lvlNumber,
          model: LevelModelFactory.getLevelModelFromSerializedData(
            stateLevelStructure.level,
          ),
        }),
        entities: new Set<EntityController>(
          stateLevelStructure.entities
            .reverse()
            .map(this.createEntityFromSerializedData),
        ),
      };

      dungeonBranchStructure[lvlNumber].entities.forEach((entityController) => {
        dungeonBranchStructure[lvlNumber].level.addActorToTimeEngine(
          entityController,
        );
      });
    }

    return dungeonBranchStructure;
  }

  private createEntityFromSerializedData(
    serializedEntity: SerializedEntityModel,
  ): EntityController {
    if (serializedEntity.type === MonstersTypes.Player) {
      return EntityFactory.getPlayerController(serializedEntity);
    } else {
      return EntityFactory.getMonsterController(serializedEntity);
    }
  }
}
