import {
  DriedBloodDungeonEvent,
  SerializedDriedBloodDungeonEvent,
} from '../model/dungeon_events/events/dried_blood_event';

export class DungeonEventsFactory {
  public static getDryBloodEvent(
    data: SerializedDriedBloodDungeonEvent,
  ): DriedBloodDungeonEvent {
    return new DriedBloodDungeonEvent(data);
  }
}
