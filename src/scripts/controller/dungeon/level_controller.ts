import {Observer} from '../../core/observer';
import {LevelModel} from '../../model/dungeon/level_model';
import {EngineController} from '../time_engine/engine_controller';
import {DungeonModel} from '../../model/dungeon/dungeon_model';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {EntityController} from '../entity/entity_controller';

interface ILevelControllerConstructorConfig {
    readonly branch: string;
    readonly levelNumber: number;
}

/**
 * Controller of single dungeon level.
 */
export class LevelController extends Observer {
    public model: LevelModel;
    public engine: EngineController;

    constructor(config: ILevelControllerConstructorConfig) {
        super();

        this.model = new LevelModel(config.branch, config.levelNumber);
        this.engine = new EngineController();
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
     * Adds actor to time engine.
     *
     * @param   actor   Actor added to time engine.
     */
    public addActorToScheduler(actor: EntityController): void {
        this.engine.addActor(actor);
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
}
