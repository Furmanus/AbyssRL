import type { DungeonBranches } from '../constants/dungeon_types';
import type { SerializedLevel } from '../model/dungeon/level_model';
import type { SerializedEntityModel } from '../model/entity/entity_model';
import type { LevelController } from '../controller/dungeon/level_controller';
import type { EntityController } from '../controller/entity/entity_controller';
import type {
  DungeonEvent,
  SerializedDungeonEvent,
} from '../model/dungeon_events/dungeon_event';
import { SerializedTimeEngine, TimeEngine } from '../model/time/time_engine';
import { Cell, SerializedCell } from '../model/dungeon/cells/cell_model';

export type DungeonStructure = {
  [branch in DungeonBranches]: DungeonBranchStructure;
};

export type SerializedDungeon = {
  [branch in DungeonBranches]: SerializedDungeonBranchStructure;
};

export type SerializedDungeonBranchStructure = {
  [levelNumber: number]: SerializedDungeonLevelEntryStructure;
};

export type SerializedDungeonLevelEntryStructure = {
  level: SerializedLevel;
  entities: SerializedEntityModel[];
  cells: Record<string, SerializedCell>;
  scheduledDungeonEvents: SerializedDungeonEvent[];
  timeEngine: SerializedTimeEngine;
};

export type DungeonBranchStructure = {
  [levelNumber: number]: DungeonBranchLevelEntryStructure;
};

export type DungeonBranchLevelEntryStructure = {
  level: LevelController;
  entities: Set<EntityController>;
  cells: Map<string, Cell>;
  scheduledDungeonEvents: Set<DungeonEvent>;
  timeEngine: TimeEngine;
};

export type SerializedDungeonState = {
  dungeonStructure: SerializedDungeon;
  currentLevelNumber: number;
  currentBranch: DungeonBranches;
  parentDungeonBranch: DungeonBranches;
};
