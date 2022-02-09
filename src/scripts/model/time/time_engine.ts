import { BaseModel } from '../../core/base_model';
import { ITimeEngine } from '../../controller/time_engine/engine_controller';
import { IActor } from '../../interfaces/entity/entity_interfaces';
import { SpeedTimeEngine } from './speed_time_engine';

export class TimeEngine extends BaseModel implements ITimeEngine {
  private engine = new SpeedTimeEngine();

  hasActor(actor: IActor): boolean {
    return this.engine.hasActor(actor);
  }

  addActor(actor: IActor, repeat: boolean): void {
    this.engine.addActor(actor, repeat);
  }

  removeActor(actor: IActor): void {
    this.engine.removeActor(actor);
  }

  clearScheduler(): void {
    this.engine.clear();
  }

  startEngine(): void {
    this.engine.startEngine();
  }

  lockEngine(): void {
    this.engine.lock();
  }

  unlockEngine(): void {
    this.engine.unlock();
  }

  hasEngineBeenStarted(): boolean {
    return this.engine.wasEngineStarted;
  }
}
