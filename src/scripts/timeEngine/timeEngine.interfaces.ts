import { IActor } from '../entity/entity_interfaces';
import { SerializedSpeedTimeEngine, SpeedTimeEngine } from './speedTimeEngine';
import { TimeEngineTypes } from './timeEngine.constants';
import { QueueMember } from './queueMember';

export interface IEngine {
  type: TimeEngineTypes;
  wasEngineStarted: boolean;
  addActor(actor: IActor, repeatable: boolean): void;
  hasActor(actor: IActor): boolean;
  removeActor(actor: IActor): void;
  nextActor(): QueueMember;
  startEngine(): void;
  clear(): void;
  lock(): void;
  unlock(): void;
  resume(): void;
  getDataToSerialization(): AllSerializedEngineTypes;
}

export type AllTimeEngineTypes = SpeedTimeEngine;
export type AllSerializedEngineTypes = SerializedSpeedTimeEngine;
