import type { DungeonBranches } from '../dungeon/constants/dungeonTypes.constants';
import type { SerializedLevel } from '../dungeon/models/level_model';
import type { SerializedEntityModel } from '../entity/models/entity.model';
import type { Level } from '../dungeon/level';
import type { Entity } from '../entity/entities/entity';
import type {
  DungeonEvent,
  SerializedDungeonEvent,
} from '../dungeonEvents/dungeonEvent';
import { SerializedTimeEngine, TimeEngine } from '../timeEngine/timeEngine';
import { Cell, SerializedCell } from '../dungeon/models/cells/cell_model';

export type DungeonStructure = {
  [branch in DungeonBranches]: DungeonBranchStructure;
};

export type SerializedDungeon = Record<DungeonBranches, SerializedDungeonBranchStructure>;

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
  level: Level;
  entities: Set<Entity>;
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
