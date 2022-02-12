import { IActor } from '../../interfaces/entity/entity_interfaces';
import {
  SerializedSpeedTimeEngine,
  SpeedTimeEngine,
} from './speed_time_engine';
import { TimeEngineTypes } from './time_engine.constants';

export interface IEngine {
  type: TimeEngineTypes;
  wasEngineStarted: boolean;
  addActor(actor: IActor, repeatable: boolean): void;
  hasActor(actor: IActor): boolean;
  removeActor(actor: IActor): void;
  nextActor(): IActor;
  startEngine(): void;
  clear(): void;
  lock(): void;
  unlock(): void;
  resume(): void;
  getDataToSerialization(): AllSerializedEngineTypes;
}

export type AllTimeEngineTypes = SpeedTimeEngine;
export type AllSerializedEngineTypes = SerializedSpeedTimeEngine;
