import { EntityController } from '../entity/controllers/entity.controller';
import { BaseController } from '../core/base.controller';
import { IAnyObject } from '../interfaces/common';
import { EntityEvents } from '../constants/entity_events';
import { boundMethod } from 'autobind-decorator';
import { EntityModel } from '../entity/models/entity.model';
import { Monsters, MonstersTypes } from '../entity/constants/monsters';
import { PLAYER_DEATH } from '../entity/constants/player_actions';
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

  /**
   * Enables listening on various events.
   */
  protected attachEvents(): void {
    this.levelEntitiesControllers.on(
      this,
      EntityEvents.EntityMove,
      this.onEntityCollectionEntityMove,
    );
  }

  /**
   * Method responsible for attaching events to newly created monster controller.
   *
   * @param controller    Newly created monster controller.
   */
  private attachEventsToMonsterController(controller: EntityController): void {
    controller.on(this, EntityEvents.EntityDeath, this.onMonsterDeath);
    controller.on(this, EntityEvents.EntityHit, this.onEntityHit);
    controller.on(this, EntityEvents.EntityBloodLoss, this.onEntityBloodLoss);
  }

  /**
   * Method responsible for detaching events from monster controller. Used for example in situation when entity
   * changes level - old level should not react on entity events.
   *
   * @param controller    Entity controller
   */
  private detachEventsFromMonsterController(
    controller: EntityController,
  ): void {
    controller.off(this, EntityEvents.EntityDeath);
    controller.off(this, EntityEvents.EntityHit);
    controller.off(this, EntityEvents.EntityBloodLoss);
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

    if (actor instanceof EntityController) {
      this.attachEventsToMonsterController(actor);
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
  public removeActorFromTimeEngine(actor: IActor | EntityController): void {
    this.engine.removeActor(actor);

    if (actor instanceof EntityController) {
      this.detachEventsFromMonsterController(actor);
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
  @boundMethod
  private onMonsterDeath(data: { entityController: EntityController }): void {
    const { entityController } = data;
    const entityModel = entityController.getModel();
    const { branch, level } = entityModel.entityPosition;

    if (entityController.getModel().type === MonstersTypes.Player) {
      this.lockTimeEngine();
      this.notify(PLAYER_DEATH);
    } else {
      dungeonState.entityManager.removeEntityFromLevel(
        entityController,
        level,
        branch,
      );
      entityController.off(this, EntityEvents.EntityDeath);
    }
  }

  /**
   * Method triggered after notification from Entity Controller about entity taking damage.
   *
   * @param entity    EntityModel
   */
  @boundMethod
  private onEntityHit(entity: EntityModel): void {
    this.notify(EntityEvents.EntityHit, entity);
  }

  private onEntityBloodLoss(entity: EntityModel): void {
    const cell = this.getCell(entity.position.x, entity.position.y);

    if (cell) {
      const { branch, levelNumber } = this.model;

      cell.createPoolOfBlood();

      DungeonEventsFactory.createDryBloodEvent({
        type: DungeonEventTypes.DryBlood,
        speed: rngService.getRandomNumber(12, 15),
        branch,
        levelNumber,
        cell: entity.position,
      });
    }
  }

  public getEntityControllerByModel(
    entityModel: EntityModel,
  ): EntityController {
    return this.levelEntitiesControllers.getControllerByEntityModel(
      entityModel,
    );
  }

  private onEntityCollectionEntityMove(entity: EntityController): void {
    const entityModel = entity.getModel();

    if (entityModel.type !== MonstersTypes.Player) {
      this.notify(EntityEvents.EntityMove, entity.getModel());
    }
  }
}
