import {Observer} from '../../core/observer';
import {LevelModel} from '../../model/dungeon/level_model';
import {EngineController} from '../time_engine/engine_controller';

export class LevelController extends Observer{

    constructor(config){
        super();
        /**@type {LevelModel}*/
        this.model = new LevelModel(config.branch, config.levelNumber);
        /**@type {EngineController}*/
        this.engine = new EngineController();
    }
    /**
     * Returns cell at given coordinates.
     * @param {number}  x   Cell horizontal coordinate.
     * @param {number}  y   Cell vertical coordinate.
     * @returns {Cell}
     */
    getCell(x, y){
        return this.model.getCell(x, y);
    }
    /**
     * Adds actor to time engine.
     * @param {EntityController}    actor   Actor added to time engine.
     */
    addActorToScheduler(actor){
        this.engine.addActor(actor);
    }
    /**
     * Starts time engine on level.
     */
    startTimeEngine(){
        this.engine.startEngine();
    }
    /**
     * Locks(pauses) time engine on level.
     */
    lockTimeEngine(){
        this.engine.lockEngine();
    }
    /**
     * Unlocks(resumes) time engine on level.
     */
    unlockTimeEngine(){
        this.engine.unlockEngine();
    }
    /**
     * Returns cell model with stairs down.
     * @returns {Cell}
     */
    getStairsDownCell(){
        const stairsDownLocation = this.model.getStairsDownLocation();

        return this.getCell(stairsDownLocation.x, stairsDownLocation.y);
    }
    /**
     * Returns cell model with stairs up.
     * @returns {Cell}
     */
    getStairsUpCell(){
        const stairsUpLocation = this.model.getStairsUpLocation();

        return this.getCell(stairsUpLocation.x, stairsUpLocation.y);
    }
    /**
     * Returns level model instance.
     * @returns {LevelModel}
     */
    getModel(){
        return this.model;
    }
}