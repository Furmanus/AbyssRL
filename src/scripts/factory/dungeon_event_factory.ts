import {
  DriedBloodDungeonEvent,
  SerializedDriedBloodDungeonEvent,
} from '../model/dungeon_events/events/dried_blood_event';
import { dungeonState } from '../state/application.state';

export class DungeonEventsFactory {
  public static createDryBloodEvent(
    data: SerializedDriedBloodDungeonEvent,
  ): DriedBloodDungeonEvent {
    const event = new DriedBloodDungeonEvent(data);

    dungeonState.eventsManager.addEvent(event);

    return event;
  }
}
