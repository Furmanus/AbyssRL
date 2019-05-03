import {LevelModel} from '../../model/dungeon/level_model';
import {EngineController} from '../time_engine/engine_controller';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {EntityController} from '../entity/entity_controller';
import {Controller} from '../controller';
import {MonsterController} from '../entity/monster_controller';
import {DungeonEvents} from '../../constants/dungeon_events';
import {IAnyObject} from '../../interfaces/common';

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
    }
    /**
     * Removes actor from engine scheduler.
     *
     * @param  actor   Actor, instance of entity controller (or subclass).
     */
    public removeActorFromTimeEngine(actor: EntityController): void {
        this.engine.removeActor(actor);
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
}
