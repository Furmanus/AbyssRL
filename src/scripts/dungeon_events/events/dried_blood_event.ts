import { DungeonEvent } from '../dungeon_event';
import { Cell } from '../../model/dungeon/cells/cell_model';
import { FloorModel } from '../../model/dungeon/cells/floor_model';
import { StairsModel } from '../../model/dungeon/cells/floors/stairs';

export class DriedBloodDungeonEvent extends DungeonEvent {
  public constructor(speed: number, private cell: Cell) {
    super(speed);
  }

  public act(): void {
    this.cell.dryPoolOfBlood();
  }
}
