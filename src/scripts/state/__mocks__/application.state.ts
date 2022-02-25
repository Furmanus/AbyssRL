import { IActor } from '../../entity/entity_interfaces';

class FakeDungeonState {
  public actors: IActor[] = [];
  public get entityManager() {
    const self = this;

    return {
      getActorById(actorId: string): IActor {
        return self.actors.find((actor: IActor) => actor.getId() === actorId);
      },
      addEntityToLevel(actor: IActor): void {
        self.actors.push(actor);
      },
    };
  }
}

export const dungeonState = new FakeDungeonState();
