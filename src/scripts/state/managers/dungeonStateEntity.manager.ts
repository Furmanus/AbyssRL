import { dungeonBranchToMaxLevel, DungeonState } from '../dungeon.state';
import { DungeonBranches } from '../../constants/dungeon_types';
import { EntityModel } from '../../model/entity/entity_model';
import { EntityController } from '../../controller/entity/entity_controller';
import { Cell } from '../../model/dungeon/cells/cell_model';

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
  ): Set<EntityController> {
    return this.dungeonState.dungeonsStructure[dungeonBranch][levelNumber]
      .entities;
  }

  public addEntityToLevel(
    entity: EntityController,
    levelNumber: number = this.dungeonState.currentLevelNumber,
    dungeonBranch: DungeonBranches = this.dungeonState.currentBranch,
  ): this {
    this.dungeonState.dungeonsStructure[dungeonBranch][
      levelNumber
    ].entities.add(entity);

    return this;
  }

  public removeEntityFromLevel(
    entity: EntityController,
    levelNumber: number,
    dungeonBranch: DungeonBranches = this.dungeonState.currentBranch,
  ): this {
    this.dungeonState.dungeonsStructure[dungeonBranch][
      levelNumber
    ].entities.delete(entity);

    return this;
  }

  public moveEntityFromLevelToLevel(
    entity: EntityController,
    oldLevelNumber: number,
    newLevelNumber: number,
    oldDungeonBranch = this.dungeonState.currentBranch,
    newDungeonBranch = this.dungeonState.currentBranch,
  ): void {
    if (this.isEntityOnLevel(entity, oldLevelNumber)) {
      this.removeEntityFromLevel(
        entity,
        oldLevelNumber,
        oldDungeonBranch,
      ).addEntityToLevel(entity, newLevelNumber, newDungeonBranch);
    }
  }

  public findEntityByCell(cell: Cell): EntityController {
    for (const [branchName, dungeonBranchEntry] of Object.entries(
      this.dungeonState.dungeonsStructure,
    )) {
      // TODO to jest chujowe rozwiązanie, przy każdym przerysowaniu ekranu sprawdzana jest ta wlasnosc, duzo zbednych iteracji
      for (const dungeonLevelEntry of Object.values(dungeonBranchEntry)) {
        for (const entity of dungeonLevelEntry.entities) {
          const entityModel = entity.getModel();

          if (entityModel.position === cell) {
            return entity;
          }
        }
      }
    }

    return null;
  }

  public findEntityControllerByModel(
    entityModel: EntityModel,
    branch: DungeonBranches = this.dungeonState.currentBranch,
    levelNumber: number = this.dungeonState.currentLevelNumber,
  ): EntityController {
    const entities = this.getEntitiesFromLevel(branch, levelNumber);

    if (entities) {
      return Array.from(entities).find(
        (entityController) => entityController.getModel() === entityModel,
      );
    }
  }

  private getEntitiesFromLevel(
    branch: DungeonBranches,
    levelNumber: number,
  ): Set<EntityController> {
    return this.dungeonState.dungeonsStructure[branch]?.[levelNumber]?.entities;
  }

  private isEntityOnLevel(
    entityController: EntityController,
    levelNumber: number,
    dungeonBranch = this.dungeonState.currentBranch,
  ): boolean {
    return this.dungeonState.dungeonsStructure[dungeonBranch][
      levelNumber
    ].entities.has(entityController);
  }
}
