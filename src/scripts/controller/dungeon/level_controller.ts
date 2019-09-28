import {LevelModel} from '../../model/dungeon/level_model';
import {EngineController} from '../time_engine/engine_controller';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {EntityController} from '../entity/entity_controller';
import {Controller} from '../controller';
import {MonsterController} from '../entity/monster_controller';
import {DungeonEvents} from '../../constants/dungeon_events';
import {IAnyObject} from '../../interfaces/common';
import {EntityEvents} from '../../constants/entity_events';
import {boundMethod} from 'autobind-decorator';
import {EntityModel} from '../../model/entity/entity_model';
import {MonstersTypes} from '../../constants/monsters';
import {PLAYER_DEATH} from '../../constants/player_actions';

interface ILevelControllerConstructorConfig {
    readonly branch: string;
    readonly levelNumber: number;
}

/**
 * Controller of single dungeon level.
 */
export class LevelController extends Controller {
    public model: LevelModel;
    public engine: EngineController;

    constructor(config: ILevelControllerConstructorConfig) {
        super();

        this.model = new LevelModel(config.branch, config.levelNumber);
        this.engine = new EngineController();

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
        this.model.on(this, DungeonEvents.NEW_CREATURE_SPAWNED, this.onNewMonsterSpawned.bind(this));
    }
    /**
     * Method responsible for attaching events to newly created monster controller.
     *
     * @param controller    Newly created monster controller.
     */
    private attachEventsToMonsterController(controller: EntityController): void {
        controller.on(this, EntityEvents.ENTITY_DEATH, this.onMonsterDeath);
        controller.on(this, EntityEvents.ENTITY_HIT, this.onEntityHit);
    }
    /**
     * Method responsible for detaching events from monster controller. Used for example in situation when entity
     * changes level - old level should not react on entity events.
     *
     * @param controller    Entity controller
     */
    private detachEventsFromMonsterController(controller: EntityController): void {
        controller.off(this, EntityEvents.ENTITY_DEATH);
        controller.off(this, EntityEvents.ENTITY_HIT);
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
    public addActorToTimeEngine(actor: EntityController, repeat: boolean = true): void {
        this.engine.addActor(actor, repeat);
        this.attachEventsToMonsterController(actor);
    }
    /**
     * Removes actor from engine scheduler.
     *
     * @param  actor   Actor, instance of entity controller (or subclass).
     */
    public removeActorFromTimeEngine(actor: EntityController): void {
        this.engine.removeActor(actor);
        this.detachEventsFromMonsterController(actor);
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
     * Method triggered after level model notifies that new monster has been spawned.
     *
     * @param monster   Newly spawned monster controller
     */
    private onNewMonsterSpawned(monster: MonsterController): void {
        this.addActorToTimeEngine(monster);
    }
    /**
     * Method triggered after monster controller notifies about its death.
     *
     * @param data    Data object passed along with event
     */
    @boundMethod
    private onMonsterDeath(data: {entityController: EntityController}): void {
        const {
            entityController,
        } = data;

        if (entityController.getModel().type !== MonstersTypes.PLAYER) {
            this.removeActorFromTimeEngine(entityController);
            this.removeEntityFromLevel(entityController.getModel());
            entityController.off(this, EntityEvents.ENTITY_DEATH);
        } else {
            this.lockTimeEngine();
            this.notify(PLAYER_DEATH);
        }
    }
    /**
     * Method triggered after notification from Entity Controller about entity taking damage.
     *
     * @param entity    EntityModel
     */
    @boundMethod
    private onEntityHit(entity: EntityModel): void {
        this.notify(EntityEvents.ENTITY_HIT, entity);
    }
    /**
     * Method responsible for removing entity model from level cells (if its present in any).
     *
     * @param entity    Entity model
     */
    private removeEntityFromLevel(entity: EntityModel): void {
        this.model.removeEntity(entity);
    }
}
