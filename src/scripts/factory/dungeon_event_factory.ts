import { getRandomNumber } from '../helper/rng';
import { DriedBloodDungeonEvent } from '../dungeon_events/events/dried_blood_event';
import { Cell } from '../model/dungeon/cells/cell_model';

export class DungeonEventsFactory {
  public static getDryBloodEvent(
    cell: Cell,
    timeout: number = getRandomNumber(12, 15),
  ): DriedBloodDungeonEvent {
    return new DriedBloodDungeonEvent(Math.round(100 / timeout), cell);
  }
}
