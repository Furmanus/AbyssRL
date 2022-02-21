import { DungeonState } from '../dungeon.state';
import { DungeonEvent } from '../../model/dungeon_events/dungeon_event';

const constructorToken = Symbol('DungeonStateEventManager');
let instance: DungeonStateEventsManager;

export class DungeonStateEventsManager {
  public constructor(
    token: symbol,
    private readonly dungeonState: DungeonState,
  ) {
    if (token !== constructorToken) {
      throw new Error('Invalid constructor');
    }
  }

  public static getInstance(
    dungeonState: DungeonState,
  ): DungeonStateEventsManager {
    if (!instance) {
      instance = new DungeonStateEventsManager(constructorToken, dungeonState);
    }

    return instance;
  }

  public addEvent(event: DungeonEvent): void {
    const { levelNumber, branch } = event;
    const { scheduledDungeonEvents, timeEngine } =
      this.dungeonState.dungeonsStructure[branch][levelNumber];

    if (scheduledDungeonEvents && timeEngine) {
      scheduledDungeonEvents.add(event);
      timeEngine.addActor(event, false);
    } else {
      throw new Error(`Dungeon data for event ${event.id} not found`);
    }
  }

  public removeEvent(event: DungeonEvent): void {
    const { levelNumber, branch } = event;
    const { scheduledDungeonEvents, timeEngine } =
      this.dungeonState.dungeonsStructure[branch][levelNumber];

    if (scheduledDungeonEvents && timeEngine) {
      timeEngine.removeActor(event);
      scheduledDungeonEvents.delete(event);
    } else {
      throw new Error(`Dungeon data for event ${event.id} not found`);
    }
  }
}
