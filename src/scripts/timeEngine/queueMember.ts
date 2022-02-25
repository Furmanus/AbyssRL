import { IActor } from '../entity/entity_interfaces';
import { dungeonState } from '../state/application.state';

export interface SerializedQueueMember {
  nextActionAt: number;
  actorId: string | IActor;
  isRepeatable: boolean;
  lastSavedActorSpeed: number;
}

export class QueueMember {
  public nextActionAt: number;
  public isRepeatable: boolean;
  private actorId: string;
  public get actor(): IActor {
    return dungeonState.entityManager.getActorById(this.actorId);
  }

  public constructor(data: SerializedQueueMember) {
    const { nextActionAt, actorId, isRepeatable, lastSavedActorSpeed } = data;

    if (typeof actorId === 'string') {
      this.actorId = actorId;
    } else {
      this.actorId = actorId.getId();
    }
    this.nextActionAt = nextActionAt + 1 / lastSavedActorSpeed;
    this.isRepeatable = isRepeatable;
  }

  public takeAction(): void {
    this.actor.act();

    if (this.actor) {
      this.nextActionAt += 1 / this.actor.getSpeed();
    }
  }

  public getDataToSerialization(): SerializedQueueMember {
    return {
      nextActionAt: this.nextActionAt,
      actorId: this.actorId,
      isRepeatable: this.isRepeatable,
      lastSavedActorSpeed: this.actor.getSpeed(),
    };
  }
}
