import { IActor } from '../../interfaces/entity/entity_interfaces';
import { dungeonState } from '../../state/application.state';

export interface SerializedQueueMember {
  nextActionAt: number;
  actorId: string | IActor;
}

export class QueueMember {
  public nextActionAt: number;
  public actor: IActor;

  public constructor(data: SerializedQueueMember) {
    const { nextActionAt, actorId } = data;

    if (typeof actorId === 'string') {
      this.actor = dungeonState.entityManager.getActorById(actorId);
    } else {
      this.actor = actorId;
    }
    this.nextActionAt = nextActionAt + 1 / this.actor.getSpeed();
  }

  public takeAction(): void {
    this.actor.act();

    this.nextActionAt += 1 / this.actor.getSpeed();
  }

  public getDataToSerialization(): SerializedQueueMember {
    return {
      nextActionAt: this.nextActionAt,
      actorId: this.actor.getId(),
    };
  }
}
