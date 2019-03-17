import * as ROT from 'rot-js';
import {EntityController} from '../entity/entity_controller';
import scheduler from 'rot-js/lib/scheduler/scheduler';
import engine from 'rot-js/lib/engine';
import {Controller} from '../controller';

/**
 * Controller of time engine of game. Doesn't have explicit, separate model, models are scheduler and engine
 * fields, provided by rot.js library.
 */
export class EngineController extends Controller {
    private scheduler: scheduler = new ROT.Scheduler.Speed();
    private engine: engine = new ROT.Engine(this.scheduler);
    private wasEngineStarted: boolean = false;

    /**
     * Adds actor to engine scheduler.
     *
     * @param   actor   Actor, instance of entity class (or subclass).
     * @param   repeat  Boolean variable indicating whether actor should act more than once.
     */
    public addActor(actor: EntityController, repeat: boolean = true): void {
        this.scheduler.add(actor, repeat);
    }
    /**
     * Removes actor from engine scheduler.
     *
     * @param  actor   Actor, instance of entity controller (or subclass).
     */
    public removeActor(actor: EntityController): void {
        this.scheduler.remove(actor);
    }
    /**
     * Removes all actors from engine scheduler.
     */
    public clearScheduler(): void {
        this.scheduler.clear();
    }
    /**
     * Picks next actor in engine scheduler.
     */
    public nextActor(): void {
        this.scheduler.next();
    }
    /**
     * Starts time engine.
     */
    public startEngine(): void {
        this.engine.start();
        this.wasEngineStarted = true;
    }
    /**
     * Locks time engine.
     */
    public lockEngine(): void {
        this.engine.lock();
    }
    /**
     * Unlocks time engine.
     */
    public unlockEngine(): void {
        this.engine.unlock();
    }
    /**
     * Boolean variable indicating whether engine was started at some point or not.
     */
    public hasEngineBeenStarted(): boolean {
        return this.wasEngineStarted;
    }
}
