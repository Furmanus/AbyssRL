import { DungeonState } from '../dungeon.state';
import { DungeonBranches } from '../../constants/dungeon_types';
import { EntityModel } from '../../model/entity/entity_model';

const constructorSymbol = Symbol('EntityStateManager');
const instance: DungeonStateEntityManager = null;

export class DungeonStateEntityManager {
  public constructor(
    token: symbol,
    private readonly dungeonState: DungeonState,
  ) {
    if (token !== constructorSymbol) {
      throw new Error('Invalid constructor invocation');
    }
  }

  public static getInstance(
    dungeonState: DungeonState,
  ): DungeonStateEntityManager {
    if (instance) {
      return instance;
    }

    return new DungeonStateEntityManager(constructorSymbol, dungeonState);
  }

  public getLevelEntities(
    dungeonBranch: DungeonBranches,
    levelNumber: number,
  ): Set<EntityModel> {
    return this.dungeonState.dungeonsStructure[dungeonBranch][levelNumber]
      .entities;
  }

  public addEntityToLevel(
    entity: EntityModel,
    dungeonBranch: DungeonBranches,
    levelNumber: number,
  ): this {
    this.dungeonState.dungeonsStructure[dungeonBranch][
      levelNumber
    ].entities.add(entity);

    return this;
  }

  public removeEntityFromLevel(
    entity: EntityModel,
    dungeonBranch: DungeonBranches,
    levelNumber: number,
  ): this {
    this.dungeonState.dungeonsStructure[dungeonBranch][
      levelNumber
    ].entities.delete(entity);

    return this;
  }
}
