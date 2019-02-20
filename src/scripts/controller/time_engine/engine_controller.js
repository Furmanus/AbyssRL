/**
 * Controller of time engine of game. Doesn't have explicit, separate model, models are scheduler and engine fields, provided by rot.js library.
 */
import {Observer} from '../../core/observer';
import * as ROT from 'rot-js';

export class EngineController extends Observer{
    /**
     * @constructor
     */
    constructor(){
        super();

        this.scheduler = new ROT.Scheduler.Speed();
        this.engine = new ROT.Engine(this.scheduler);
    }
    /**
     * Adds actor to engine scheduler.
     * @param {EntityController}  actor   Actor, instance of entity class (or subclass).
     * @param {boolean} repeat  Boolean variable indicating whether actor should act more than once.
     */
    addActor(actor, repeat = true){
        this.scheduler.add(actor, repeat);
    }
    /**
     * Removes actor from engine scheduler.
     * @param {EntityController}    actor   Actor, instance of entity class (or subclass).
     */
    removeActor(actor){
        this.scheduler.remove(actor);
    }
    /**
     * Removes all actors from engine scheduler.
     */
    clearScheduler(){
        this.scheduler.clear();
    }
    /**
     * Picks next actor in engine scheduler.
     */
    nextActor(){
        this.scheduler.next();
    }
    /**
     * Starts time engine.
     */
    startEngine(){
        this.engine.start();
    }
    /**
     * Locks time engine.
     */
    lockEngine(){
        this.engine.lock();
    }
    /**
     * Unlocks time engine.
     */
    unlockEngine(){
        this.engine.unlock();
    }
}