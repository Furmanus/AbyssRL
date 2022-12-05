import { Entity } from '../entity/controllers/entity';
import { BaseController } from '../core/base.controller';
import { IAnyObject } from '../interfaces/common';
import { EntityModel } from '../entity/models/entity.model';
import { Monsters, MonstersTypes } from '../entity/constants/monsters';
import { MonsterFactory } from '../entity/factory/monster.factory';
import { IActor } from '../entity/entity_interfaces';
import { DungeonEventsFactory } from '../dungeonEvents/dungeonEvent.factory';
import { EntityFactory } from '../entity/factory/entity.factory';
import { dungeonState } from '../state/application.state';
import { DungeonBranches } from './constants/dungeonTypes.constants';
import { LevelModelFactory } from './factory/levelModel.factory';
import { LevelModel } from './models/level_model';
import { Cell } from './models/cells/cell_model';
import { TimeEngine } from '../timeEngine/timeEngine';
import { rngService } from '../utils/rng.service';
import { DungeonEventTypes } from '../dungeonEvents/dungeonEvent';
import { entityEventBus } from '../eventBus/entityEventBus/entityEventBus';
import { EntityEventBusEventNames } from '../eventBus/entityEventBus/entityEventBus.constants';

export interface ILevelControllerConstructorConfig {
  readonly branch: DungeonBranches;
  readonly levelNumber: number;
  readonly model?: LevelModel;
}

/**
 * Controller of single dungeon level.
 */
export class LevelController extends BaseController {
  public model: LevelModel;
  public get engine(): TimeEngine {
    return dungeonState.getTimeEngine(
      this.model.branch,
      this.model.levelNumber,
    );
  }

  private levelEntitiesControllers =
    EntityFactory.getEntityControllerollection();

  constructor(config: ILevelControllerConstructorConfig) {
    super();

    if (config.model) {
      this.model = config.model;
    } else {
      this.model = LevelModelFactory.getNewLevelModel(
        config.branch,
        config.levelNumber,
      );
    }

    this.initialize();
  }

  /**
   * Initializes level controller.
   *
   * @param config    Optional configuration object
   */
  protected initialize(config?: IAnyObject): void {
    super.initialize(config);

    this.attachEvents();
  }

  public attachEvents(): void {
    entityEventBus.subscribe(EntityEventBusEventNames.EntityDeath, this.onEntityDeath);
    entityEventBus.subscribe(EntityEventBusEventNames.EntityBloodLoss, this.onEntityBloodLoss);
  }

  /**
   * Returns cell at given coordinates.
   *
   * @param   x   Cell horizontal coordinate.
   * @param   y   Cell vertical coordinate.
   * @returns     Cell at position.
   */
  public getCell(x: number, y: number): Cell {
    return this.model.getCell(x, y);
  }

  /**
   * Starts time engine on level.
   */
  public startTimeEngine(): void {
    this.engine.startEngine();
  }

  /**
   * Locks(pauses) time engine on level.
   */
  public lockTimeEngine(): void {
    this.engine.lockEngine();
  }

  /**
   * Unlocks(resumes) time engine on level.
   */
  public unlockTimeEngine(): void {
    this.engine.unlockEngine();
  }

  /**
   * Adds actor to engine scheduler.
   *
   * @param   actor   Actor, instance of entity class (or subclass).
   * @param   repeat  Boolean variable indicating whether actor should act more than once.
   */
  public addActorToTimeEngine(actor: IActor, repeat: boolean = true): void {
    this.engine.addActor(actor, repeat);

    if (actor instanceof Entity) {
      this.levelEntitiesControllers.add(actor);
    }
  }

  public spawnMonsterInSpecificCell(cell: Cell, monster: Monsters): void {
    const monsterController = MonsterFactory.getMonsterControllerByType(
      monster,
      cell,
    );

    dungeonState.entityManager.addEntityToLevel(monsterController);
  }

  /**
   * Removes actor from engine scheduler.
   *
   * @param  actor   Actor, instance of entity controller (or subclass).
   */
  public removeActorFromTimeEngine(actor: IActor | Entity): void {
    this.engine.removeActor(actor);

    if (actor instanceof Entity) {
      this.levelEntitiesControllers.remove(actor);
    }
  }

  /**
   * Returns boolean variable indicating whether time engine of level has been started at some point or not.
   */
  public wasTimeEngineStarted(): boolean {
    return this.engine.hasEngineBeenStarted();
  }

  /**
   * Returns cell model with stairs down.
   *
   * @returns   Returns cell model with stairs down.
   */
  public getStairsDownCell(): Cell {
    const stairsDownLocation = this.model.getStairsDownLocation();

    return this.getCell(stairsDownLocation.x, stairsDownLocation.y);
  }

  /**
   * Returns cell model with stairs up.
   *
   * @returns Returns cell model with stairs up.
   */
  public getStairsUpCell(): Cell {
    const stairsUpLocation = this.model.getStairsUpLocation();

    return this.getCell(stairsUpLocation.x, stairsUpLocation.y);
  }

  /**
   * Returns level model instance.
   *
   * @returns Returns model of instance of level controller.
   */
  public getModel(): LevelModel {
    return this.model;
  }

  /**
   * Method triggered after monster controller notifies about its death.
   *
   * @param data    Data object passed along with event
   */
  private onEntityDeath = (entity: Entity): void => {
    const entityModel = entity.getModel();
    const { branch, level } = entityModel.entityPosition;

    if (entityModel.type === MonstersTypes.Player) {
      this.lockTimeEngine();
    } else {
      dungeonState.entityManager.removeEntityFromLevel(
        entity,
        level,
        branch,
      );
    }
  }

  private onEntityBloodLoss = (entity: Entity): void => {
    const entityModel = entity.getModel();
    const cell = this.getCell(entityModel.position.x, entityModel.position.y);

    if (cell) {
      const { branch, levelNumber } = this.model;

      cell.createPoolOfBlood();

      DungeonEventsFactory.createDryBloodEvent({
        type: DungeonEventTypes.DryBlood,
        speed: rngService.getRandomNumber(12, 15),
        branch,
        levelNumber,
        cell: entityModel.position,
      });
    }
  }

  public getEntityControllerByModel(
    entityModel: EntityModel,
  ): Entity {
    return this.levelEntitiesControllers.getControllerByEntityModel(
      entityModel,
    );
  }
}
