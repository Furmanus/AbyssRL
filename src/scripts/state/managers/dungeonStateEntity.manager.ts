import { dungeonBranchToMaxLevel, DungeonState } from '../dungeon.state';
import { DungeonBranches } from '../../dungeon/constants/dungeonTypes.constants';
import { EntityModel } from '../../entity/models/entity.model';
import { EntityController } from '../../entity/controllers/entity.controller';
import { Cell } from '../../dungeon/models/cells/cell_model';
import { DungeonEvent } from '../../dungeonEvents/dungeonEvent';
import { TimeEngine } from '../../timeEngine/timeEngine';

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
    if (
      !this.dungeonState.hasStateBeenLoadedFromData &&
      !this.dungeonState.dungeonsStructure[dungeonBranch][levelNumber]
    ) {
      this.dungeonState.dungeonsStructure[dungeonBranch] = {
        [levelNumber]: {
          level: null,
          entities: new Set<EntityController>(),
          scheduledDungeonEvents: new Set<DungeonEvent>(),
          timeEngine: new TimeEngine(),
          cells: new Map<string, Cell>(),
        },
      };
    }

    const { level, entities } =
      this.dungeonState.dungeonsStructure[dungeonBranch][levelNumber];

    entities.add(entity);
    // level controller might have not been initialized yet, happens in case of loading game from saved data
    if (level) {
      level.addActorToTimeEngine(entity);
    }

    return this;
  }

  public removeEntityFromLevel(
    entity: EntityController,
    levelNumber: number,
    dungeonBranch: DungeonBranches = this.dungeonState.currentBranch,
  ): this {
    const { level, entities } =
      this.dungeonState.dungeonsStructure[dungeonBranch][levelNumber];

    level.removeActorFromTimeEngine(entity);
    entities.delete(entity);

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

  public getEntityControllerById(entityId: string): EntityController {
    const { dungeonsStructure } = this.dungeonState;

    for (const branchStructure of Object.values(dungeonsStructure)) {
      for (const levelStructure of Object.values(branchStructure)) {
        const entityController = Array.from(levelStructure.entities).find(
          (entity) => entity.getModel().id === entityId,
        );

        if (entityController) {
          return entityController;
        }
      }
    }
  }

  public getActorById(id: string): EntityController | DungeonEvent {
    const entityController = this.getEntityControllerById(id);
    const { dungeonsStructure } = this.dungeonState;

    if (entityController) {
      return entityController;
    }

    for (const branchStructure of Object.values(dungeonsStructure)) {
      for (const levelStructure of Object.values(branchStructure)) {
        const entityController = Array.from(
          levelStructure.scheduledDungeonEvents,
        ).find((entity) => entity.id === id);

        if (entityController) {
          return entityController;
        }
      }
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
