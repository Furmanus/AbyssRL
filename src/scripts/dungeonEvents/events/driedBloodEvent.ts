import {
  DungeonEvent,
  DungeonEventTypes,
  SerializedDungeonEvent,
} from '../dungeonEvent';
import type { DungeonBranches } from '../../dungeon/constants/dungeonTypes.constants';
import { Position, SerializedPosition } from '../../position/position';
import { dungeonState } from '../../state/application.state';

export interface SerializedDriedBloodDungeonEvent
  extends SerializedDungeonEvent,
    SerializedDungeonEvent {
  cell: SerializedPosition;
  type: DungeonEventTypes.DryBlood;
}

export class DriedBloodDungeonEvent extends DungeonEvent {
  private cell: Position;
  public type = DungeonEventTypes.DryBlood;

  public constructor(data: SerializedDriedBloodDungeonEvent) {
    const { cell } = data;

    super(data);

    this.cell = Position.fromCoords(cell.x, cell.y);
  }

  public act(): void {
    const cell = dungeonState.dungeonsStructure[this.branch][
      this.levelNumber
    ].level.getCell(this.cell.x, this.cell.y);

    if (cell) {
      return cell.dryPoolOfBlood();
    }

    throw new Error('Cell not found');
  }

  public getDataToSerialization(): SerializedDriedBloodDungeonEvent {
    return {
      ...super.getDataToSerialization(),
      branch: this.branch,
      levelNumber: this.levelNumber,
      cell: this.cell.serialize(),
      type: DungeonEventTypes.DryBlood,
    };
  }
}
