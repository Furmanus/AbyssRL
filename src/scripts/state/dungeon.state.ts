import { DungeonBranches } from '../dungeon/constants/dungeonTypes.constants';
import { action, makeObservable, observable } from 'mobx';
import { ASCEND, DESCEND } from '../constants/directions';
import { IActionAttempt } from '../interfaces/common';
import { BaseState } from './baseState';
import { LevelModel } from '../dungeon/models/level_model';
import { DungeonStateEntityManager } from './managers/dungeonStateEntity.manager';
import type { Level } from '../dungeon/level';
import { Entity } from '../entity/entities/entity';
import { PartialDungeonState } from './application.state';
import {
  DungeonBranchLevelEntryStructure,
  DungeonBranchStructure,
  DungeonStructure,
  SerializedDungeon,
  SerializedDungeonBranchStructure,
  SerializedDungeonState,
} from './applicationState.interfaces';
import { LevelModelFactory } from '../dungeon/factory/levelModel.factory';
import { LevelFactory } from '../dungeon/factory/level.factory';
import { EntityDungeonPosition, SerializedEntityModel } from '../entity/models/entity.model';
import { MonstersTypes } from '../entity/constants/monsters';
import { EntityFactory } from '../entity/factory/entity.factory';
import {
  AllSerializedEventTypes,
  DungeonEvent,
  DungeonEventTypes,
} from '../dungeonEvents/dungeonEvent';
import { DungeonEventsFactory } from '../dungeonEvents/dungeonEvent.factory';
import { Cell, SerializedCell } from '../dungeon/models/cells/cell_model';
import { TimeEngine } from '../timeEngine/timeEngine';
import { DungeonStateCellsManager } from './managers/dungeonStateCells.manager';
import { CellModelFactory } from '../dungeon/factory/cellModel.factory';
import { DungeonStateEventsManager } from './managers/dungeonStateEvents.manager';

export const dungeonBranchToMaxLevel = {
  [DungeonBranches.Main]: 8,
};

export class DungeonState extends BaseState {
  public hasStateBeenLoadedFromData = false;
  public currentLevelNumber: number;
  public currentBranch: DungeonBranches;
  public parentDungeonBranch: DungeonBranches = null;
  public entityManager = DungeonStateEntityManager.getInstance(this);
  public cellsManager = DungeonStateCellsManager.getInstance(this);
  public eventsManager = DungeonStateEventsManager.getInstance(this);
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

  public getCurrentLevelController(): Level {
    return this.dungeonsStructure[this.currentBranch][this.currentLevelNumber]
      .level;
  }

  public getLevelController(
    dungeonBranch: DungeonBranches,
    levelNumber: number,
  ): Level {
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

  public getTimeEngine(
    branch: DungeonBranches,
    levelNumber: number,
  ): TimeEngine {
    return this.dungeonsStructure[branch][levelNumber].timeEngine;
  }

  public addNewLevelControllerToCurrentBranch(
    levelController: Level,
    levelNumber: number,
  ): void {
    if (!this.dungeonsStructure[this.currentBranch][levelNumber]) {
      this.dungeonsStructure[this.currentBranch][levelNumber] = {
        level: null,
        entities: new Set<Entity>(),
        scheduledDungeonEvents: new Set<DungeonEvent>(),
        timeEngine: new TimeEngine(),
        cells: new Map<string, Cell>(),
      };
    }

    this.dungeonsStructure[this.currentBranch][levelNumber].level =
      levelController;
  }

  public doesLevelExist(
    levelNumber: number,
    branch: DungeonBranches = DungeonBranches.Main,
  ): boolean {
    return !!this.dungeonsStructure[branch]?.[levelNumber]?.level;
  }

  /**
   * Checks if entity dungeon position is in current level where playe currently is.
   *
   * @param entityPosition Entity dungeon position
   * @returns Boolean value indicating whether condition is true
   */
  public isPositionInCurrentLevel(entityPosition: EntityDungeonPosition): boolean {
    return entityPosition.branch === this.currentBranch && entityPosition.level === this.currentLevelNumber;
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
          scheduledDungeonEvents: Array.from(
            levelNumberEntry.scheduledDungeonEvents,
          ).map((event) => event.getDataToSerialization()),
          timeEngine: levelNumberEntry.timeEngine.getDataToSerialization(),
          cells: Array.from(levelNumberEntry.cells.entries()).reduce(
            (accumulator, [coords, cell]) => {
              accumulator[coords] = cell.getDataToSerialization();

              return accumulator;
            },
            {} as Record<string, SerializedCell>,
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

      dungeonBranchStructure[lvlNumber] =
        {} as DungeonBranchLevelEntryStructure;

      const level = LevelFactory.getInstance({
        branch: branchName,
        levelNumber: lvlNumber,
        model: LevelModelFactory.getLevelModelFromSerializedData(
          stateLevelStructure.level,
        ),
      });

      dungeonBranchStructure[lvlNumber].level = level;

      const cells = new Map<string, Cell>(
        Object.entries(stateLevelStructure.cells).map(
          ([coord, serializedCell]) => [
            coord,
            CellModelFactory.getCellModel(
              serializedCell.x,
              serializedCell.y,
              serializedCell.type,
              serializedCell,
            ),
          ],
        ),
      );

      dungeonBranchStructure[lvlNumber].cells = cells;

      const entities = new Set<Entity>(
        stateLevelStructure.entities.map(this.createEntityFromSerializedData),
      );

      dungeonBranchStructure[lvlNumber].entities = entities;

      const scheduledDungeonEvents = new Set<DungeonEvent>(
        stateLevelStructure.scheduledDungeonEvents.map(
          this.createDungeonEventFromSerializedData,
        ),
      );

      dungeonBranchStructure[lvlNumber].scheduledDungeonEvents =
        scheduledDungeonEvents;

      const timeEngine = new TimeEngine(stateLevelStructure.timeEngine);

      dungeonBranchStructure[lvlNumber].timeEngine = timeEngine;

      setTimeout(() => {
        for (const entity of entities) {
          this.entityManager.addEntityToLevel(entity);
        }
      }, 0); // TODO Refactor and remove this async call
    }

    return dungeonBranchStructure;
  }

  private createEntityFromSerializedData(
    serializedEntity: SerializedEntityModel,
  ): Entity {
    if (serializedEntity.type === MonstersTypes.Player) {
      return EntityFactory.getPlayerEntity(serializedEntity);
    } else {
      return EntityFactory.getMonsterEntity(serializedEntity);
    }
  }

  private createDungeonEventFromSerializedData(
    data: AllSerializedEventTypes,
  ): DungeonEvent {
    switch (data.type) {
      case DungeonEventTypes.DryBlood:
        return DungeonEventsFactory.createDryBloodEvent(data);
    }
  }
}
