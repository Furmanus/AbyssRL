import { BaseModel } from '../../core/base_model';
import { ITimeEngine } from '../../controller/time_engine/engine_controller';
import { IActor } from '../../interfaces/entity/entity_interfaces';
import { SpeedTimeEngine } from './speed_time_engine';
import { AllSerializedEngineTypes, IEngine } from './time_engine.interfaces';
import { TimeEngineTypes } from './time_engine.constants';

export interface SerializedTimeEngine {
  engine: AllSerializedEngineTypes;
}

export class TimeEngine extends BaseModel implements ITimeEngine {
  private engine: IEngine = new SpeedTimeEngine();

  public constructor(data?: SerializedTimeEngine) {
    super();

    if (data) {
      const { engine } = data;

      switch (engine.type) {
        case TimeEngineTypes.Speed:
          this.engine = new SpeedTimeEngine(engine);
      }
    }
  }

  public hasActor(actor: IActor): boolean {
    return this.engine.hasActor(actor);
  }

  public addActor(actor: IActor, repeat: boolean): void {
    this.engine.addActor(actor, repeat);
  }

  public removeActor(actor: IActor): void {
    this.engine.removeActor(actor);
  }

  public clearScheduler(): void {
    this.engine.clear();
  }

  public startEngine(): void {
    this.engine.startEngine();
  }

  public lockEngine(): void {
    this.engine.lock();
  }

  public unlockEngine(): void {
    this.engine.unlock();
  }

  public hasEngineBeenStarted(): boolean {
    return this.engine.wasEngineStarted;
  }

  public getDataToSerialization(): SerializedTimeEngine {
    return {
      engine: this.engine.getDataToSerialization(),
    };
  }
}
