import { IActor } from '../entity/entity_interfaces';
import { QueueMember, SerializedQueueMember } from './queueMember';
import { IEngine } from './timeEngine.interfaces';
import { TimeEngineTypes } from './timeEngine.constants';

export interface SerializedSpeedTimeEngine {
  queue: SerializedQueueMember[];
  currentTimestamp: number;
  isUnlocked: boolean;
  wasEngineStarted: boolean;
  type: TimeEngineTypes.Speed;
}

export class SpeedTimeEngine implements IEngine {
  public type = TimeEngineTypes.Speed;
  private queue: QueueMember[] = [];
  private currentTimestamp = 0;
  private isUnlocked = false;
  public wasEngineStarted = false;

  public constructor(data?: SerializedSpeedTimeEngine) {
    if (data) {
      const { queue, wasEngineStarted, currentTimestamp, isUnlocked } = data;

      this.wasEngineStarted = wasEngineStarted;
      this.isUnlocked = isUnlocked;
      this.currentTimestamp = currentTimestamp;
      this.queue = queue.map(
        (serializedMember) => new QueueMember(serializedMember),
      );
    }
  }

  public addActor(actor: IActor, repeatable: boolean = true): void {
    this.queue.push(
      new QueueMember({
        actorId: actor,
        nextActionAt: this.currentTimestamp,
        isRepeatable: repeatable,
        lastSavedActorSpeed: actor.getSpeed(),
      }),
    );
  }

  public hasActor(actor: IActor): boolean {
    return !!this.queue.find((queueMember) => queueMember.actor === actor);
  }

  public removeActor(actor: IActor): void {
    const memberIndex = this.queue.findIndex(
      (queueMember) => queueMember.actor === actor,
    );

    if (memberIndex !== -1) {
      this.queue.splice(memberIndex, 1);
    }
  }

  public nextActor(): QueueMember {
    const [member] = this.queue.sort((a, b) => a.nextActionAt - b.nextActionAt);

    if (member) {
      this.currentTimestamp = member.nextActionAt;
      member.takeAction();

      return member;
    }
  }

  public startEngine(): void {
    if (this.isUnlocked) {
      throw new Error('Cannot start unlocked engine');
    }

    this.wasEngineStarted = true;
    this.isUnlocked = true;

    while (this.isUnlocked) {
      this.processQueue();
    }
  }

  public clear(): void {
    this.queue = [];
  }

  public lock(): void {
    this.isUnlocked = false;
  }

  public unlock(): void {
    if (this.isUnlocked) {
      throw new Error('Cannot start unlocked engine');
    }

    this.isUnlocked = true;
    this.resume();
  }

  public resume(): void {
    if (this.isUnlocked) {
      while (this.isUnlocked) {
        this.processQueue();
      }
    }
  }

  private processQueue(): void {
    if (this.queue.length) {
      const queueMember = this.nextActor();

      if (!queueMember.isRepeatable) {
        queueMember.actor.destroy();
      }
    } else {
      this.isUnlocked = false;
    }
  }

  public getDataToSerialization(): SerializedSpeedTimeEngine {
    return {
      currentTimestamp: this.currentTimestamp,
      isUnlocked: this.isUnlocked,
      wasEngineStarted: this.wasEngineStarted,
      queue: this.queue.map((member) => member.getDataToSerialization()),
      type: TimeEngineTypes.Speed,
    };
  }
}
