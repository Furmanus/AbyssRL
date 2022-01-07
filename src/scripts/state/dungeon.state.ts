import { DungeonBranches } from '../constants/dungeon_types';
import { action, makeObservable, observable } from 'mobx';
import { ASCEND, DESCEND } from '../constants/directions';
import { IActionAttempt } from '../interfaces/common';
import { BaseState } from './baseState';
import { ExcludeFunctionProperties } from '../interfaces/utility.interfaces';

const dungeonBranchToMaxLevel = {
  [DungeonBranches.Main]: 8,
};

export class DungeonState extends BaseState {
  public get currentBranchMaxLevel(): number {
    return dungeonBranchToMaxLevel[this.currentDungeonBranch];
  }

  public constructor(
    public currentDungeonBranch: DungeonBranches = DungeonBranches.Main,
    public currentLevelNumber: number,
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

    if (num <= this.currentBranchMaxLevel) {
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

  public serialize(): ExcludeFunctionProperties<this> {
    return {
      ...this,
    };
  }
}
