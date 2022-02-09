import { DungeonEvent } from '../dungeon_event';
import { Cell } from '../../dungeon/cells/cell_model';
import { FloorModel } from '../../dungeon/cells/floor_model';
import { StairsModel } from '../../dungeon/cells/floors/stairs';

export class DriedBloodDungeonEvent extends DungeonEvent {
  public constructor(speed: number, private cell: Cell) {
    super(speed);
  }

  public act(): void {
    this.cell.dryPoolOfBlood();
  }
}
