import type { DungeonBranches } from '../constants/dungeon_types';
import type { SerializedLevel } from '../model/dungeon/level_model';
import type { SerializedEntityModel } from '../model/entity/entity_model';
import type { LevelController } from '../controller/dungeon/level_controller';
import type { EntityController } from '../controller/entity/entity_controller';
import type {
  DungeonEvent,
  SerializedDungeonEvent,
} from '../model/dungeon_events/dungeon_event';

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
  scheduledDungeonEvents: SerializedDungeonEvent[];
};

export type DungeonBranchStructure = {
  [levelNumber: number]: DungeonBranchLevelEntryStructure;
};

export type DungeonBranchLevelEntryStructure = {
  level: LevelController;
  entities: Set<EntityController>;
  scheduledDungeonEvents: Set<DungeonEvent>;
};

export type SerializedDungeonState = {
  dungeonStructure: SerializedDungeon;
  currentLevelNumber: number;
  currentBranch: DungeonBranches;
  parentDungeonBranch: DungeonBranches;
};
