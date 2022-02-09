import { IActor } from '../../interfaces/entity/entity_interfaces';

export class QueueMember {
  public nextActionAt: number;
  public actor: IActor;

  public constructor(actor: IActor, nextActionAt: number) {
    this.actor = actor;
    this.nextActionAt = nextActionAt + 1 / actor.getSpeed();
  }

  public takeAction(): void {
    this.actor.act();

    this.nextActionAt += 1 / this.actor.getSpeed();
  }
}
