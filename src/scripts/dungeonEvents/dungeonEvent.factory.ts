import {
  DriedBloodDungeonEvent,
  SerializedDriedBloodDungeonEvent,
} from './events/driedBloodEvent';
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
