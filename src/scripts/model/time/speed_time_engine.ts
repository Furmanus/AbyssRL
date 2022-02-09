import { IActor } from '../../interfaces/entity/entity_interfaces';
import { QueueMember } from './queue_member';

export class SpeedTimeEngine {
  private queue: QueueMember[] = [];
  private repeatableActors: Set<IActor> = new Set<IActor>();
  private currentTimestamp = 0;
  private isUnlocked = false;
  public wasEngineStarted = false;

  public addActor(actor: IActor, repeatable: boolean = true): void {
    this.queue.push(new QueueMember(actor, this.currentTimestamp));

    if (repeatable) {
      this.repeatableActors.add(actor);
    }
  }

  public hasActor(actor: IActor): boolean {
    return !!this.queue.find((queueMember) => queueMember.actor === actor);
  }

  public removeActor(actor: IActor): void {
    const queueMember = this.queue.find(
      (queueMember) => queueMember.actor === actor,
    );
    const memberIndex = this.queue.indexOf(queueMember);

    if (memberIndex) {
      this.queue.splice(memberIndex, 1);
      this.repeatableActors.delete(actor);
    }
  }

  public nextActor(): IActor {
    const [member] = this.queue.sort((a, b) => a.nextActionAt - b.nextActionAt);

    if (member) {
      this.currentTimestamp = member.nextActionAt;
      member.takeAction();

      return member.actor;
    }
  }

  public startEngine(): void {
    if (this.isUnlocked || this.wasEngineStarted) {
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
    this.repeatableActors.clear();
  }

  public lock(): void {
    this.isUnlocked = false;
  }

  public unlock(): void {
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
      const currentActor = this.nextActor();

      if (!this.repeatableActors.has(currentActor)) {
        this.queue.splice(
          this.queue.indexOf(
            this.queue.find((entry) => entry.actor === currentActor),
          ),
          1,
        );
      }
    } else {
      this.isUnlocked = false;
    }
  }
}
