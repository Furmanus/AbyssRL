import { BaseModel, SerializedBaseModel } from '../core/base.model';
import {
  DriedBloodDungeonEvent,
  SerializedDriedBloodDungeonEvent,
} from './events/driedBloodEvent';
import { DungeonBranches } from '../dungeon/constants/dungeonTypes.constants';
import { dungeonState } from '../state/application.state';

export interface SerializedDungeonEvent extends SerializedBaseModel {
  speed: number;
  branch: DungeonBranches;
  levelNumber: number;
}

export type AllDungeonEvents = DriedBloodDungeonEvent;
export type AllSerializedEventTypes = SerializedDriedBloodDungeonEvent;
export enum DungeonEventTypes {
  DryBlood = 'dry_blood',
}

export abstract class DungeonEvent extends BaseModel {
  public abstract type: DungeonEventTypes;
  public branch: DungeonBranches;
  public levelNumber: number;
  private speed: number;

  public constructor(config: SerializedDungeonEvent) {
    const { speed, id, levelNumber, branch } = config;

    super(id ? { id } : undefined);

    this.speed = speed;
    this.branch = branch;
    this.levelNumber = levelNumber;
  }

  public abstract act(): void;

  public getSpeed(): number {
    return this.speed;
  }

  public getId(): string {
    return this.id;
  }

  public destroy(): void {
    dungeonState.eventsManager.removeEvent(this);
  }

  public getDataToSerialization(): SerializedDungeonEvent {
    return {
      ...super.serialize(),
      speed: this.speed,
      branch: this.branch,
      levelNumber: this.levelNumber,
    };
  }
}
