import { Cell } from '../../model/dungeon/cells/cell_model';
import { DungeonState } from '../dungeon.state';
import { Position, SerializedPosition } from '../../model/position/position';
import { DungeonBranches } from '../../constants/dungeon_types';
import { convertCoordsToString } from '../../helper/utility';
import { CellModelFactory } from '../../factory/cell_model_factory';

const constructorSymbol = Symbol('DungeonStateCellsManager');

export class DungeonStateCellsManager {
  public constructor(private dungeonState: DungeonState, token: symbol) {
    if (token !== constructorSymbol) {
      throw new Error('Invalid constructor');
    }
  }

  public static getInstance(
    dungeonState: DungeonState,
  ): DungeonStateCellsManager {
    return new DungeonStateCellsManager(dungeonState, constructorSymbol);
  }

  public addCell(
    branch: DungeonBranches,
    levelNumber: number,
    cell: Cell,
  ): void {
    const { x, y } = cell;

    this.dungeonState.dungeonsStructure[branch][levelNumber].cells.set(
      convertCoordsToString(x, y),
      cell,
    );
  }

  public changeCellType(
    branch: DungeonBranches,
    levelNumber: number,
    x: number,
    y: number,
    cell: Cell,
  ): void {
    this.dungeonState.dungeonsStructure[branch][levelNumber].cells.set(
      convertCoordsToString(x, y),
      cell,
    );
  }

  public getCell(
    branch: DungeonBranches,
    levelNumber: number,
    x: number,
    y: number,
  ): Cell;

  public getCell(
    branch: DungeonBranches,
    levelNumber: number,
    x: Position,
    y?: number,
  ): Cell;

  public getCell(
    branch: DungeonBranches,
    levelNumber: number,
    x: SerializedPosition,
    y?: number,
  ): Cell;

  public getCell(
    branch: DungeonBranches,
    levelNumber: number,
    x: number | Position | SerializedPosition,
    y?: number,
  ): Cell {
    if (typeof x === 'number') {
      return this.dungeonState.dungeonsStructure[branch][levelNumber].cells.get(
        `${x}x${y}`,
      );
    } else if ('x' in x && 'y' in x) {
      const { x: posX, y } = x;

      return this.dungeonState.dungeonsStructure[branch][levelNumber].cells.get(
        `${x}x${y}`,
      );
    }

    throw new Error(`Invalid parameters x: ${x}, y: ${y}`);
  }
}
