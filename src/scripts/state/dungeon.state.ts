import { DungeonBranches } from '../constants/dungeon_types';
import { action, makeObservable, observable } from 'mobx';
import { ASCEND, DESCEND } from '../constants/directions';
import { IActionAttempt } from '../interfaces/common';
import { BaseState } from './baseState';
import { ExcludeFunctionProperties } from '../interfaces/utility.interfaces';
import { LevelModel } from '../model/dungeon/level_model';
import { EntityModel } from '../model/entity/entity_model';
import { DungeonStateEntityManager } from './managers/dungeonStateEntity.manager';
import { LevelController } from '../controller/dungeon/level_controller';

const dungeonBranchToMaxLevel = {
  [DungeonBranches.Main]: 8,
};

type DungeonStructure = {
  [branch in DungeonBranches]: {
    [levelNumber: number]: {
      level: LevelController;
      entities: Set<EntityModel>;
    };
  };
};

export class DungeonState extends BaseState {
  public entityManager = DungeonStateEntityManager.getInstance(this);
  public dungeonsStructure: DungeonStructure = {
    [DungeonBranches.Main]: {},
  };

  public get currentBranchMaxLevelNumber(): number {
    return dungeonBranchToMaxLevel[this.currentBranch];
  }

  public constructor(
    public currentLevelNumber: number,
    public currentBranch: DungeonBranches = DungeonBranches.Main,
    public parentDungeonBranch: DungeonBranches = null,
  ) {
    super();

    makeObservable(this, {
      currentLevelNumber: observable,
      setCurrentLevelNumber: action,
    });
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
        entities: new Set<EntityModel>(),
      };
    }

    this.dungeonsStructure[this.currentBranch][levelNumber].level =
      levelController;
  }

  public serialize(): ExcludeFunctionProperties<this> {
    return {
      ...this,
    };
  }
}
