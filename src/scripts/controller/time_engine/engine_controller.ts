import { Scheduler, Engine } from 'rot-js';
import scheduler from 'rot-js/lib/scheduler/scheduler';
import engine from 'rot-js/lib/engine';
import { Controller } from '../controller';
import { IActor } from '../../interfaces/entity/entity_interfaces';

export interface ITimeEngine {
  hasActor(actor: IActor): boolean;
  addActor(actor: IActor, repeat: boolean): void;
  removeActor(actor: IActor): void;
  clearScheduler(): void;
  startEngine(): void;
  lockEngine(): void;
  unlockEngine(): void;
  hasEngineBeenStarted(): boolean;
}

/**
 * Controller of time engine of game. Doesn't have explicit, separate model, models are scheduler and engine
 * fields, provided by rot.js library.
 */
export class EngineController extends Controller implements ITimeEngine {
  private actors: IActor[] = [];
  private scheduler: scheduler = new Scheduler.Speed();
  private engine: engine = new Engine(this.scheduler);
  private wasEngineStarted: boolean = false;

  public hasActor(actor: IActor): boolean {
    return this.actors.includes(actor);
  }

  public setCurrentActor(actor: IActor): void {
    this.scheduler._current = actor;
  }

  /**
   * Adds actor to engine scheduler.
   *
   * @param   actor   Actor, instance of entity class (or subclass).
   * @param   repeat  Boolean variable indicating whether actor should act more than once.
   */
  public addActor(actor: IActor, repeat: boolean = true): void {
    this.scheduler.add(actor, repeat);
    this.actors.push(actor);
  }

  /**
   * Removes actor from engine scheduler.
   *
   * @param  actor   Actor, instance of entity controller (or subclass).
   */
  public removeActor(actor: IActor): void {
    this.scheduler.remove(actor);
    this.actors.splice(this.actors.indexOf(actor), 1);
  }

  /**
   * Removes all actors from engine scheduler.
   */
  public clearScheduler(): void {
    this.scheduler.clear();
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
