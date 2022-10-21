import { ExcludeFunctionProperties } from '../interfaces/utility.interfaces';
import { Cell } from '../dungeon/models/cells/cell_model';

export type SerializedPosition = ExcludeFunctionProperties<Position>;
export type PositionDescription = `${number}x${number}`;

/**
 * Class which instances represents position on two dimensional grid.
 */
export class Position {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  public static fromCoords(x: number, y: number): Position {
    return new Position(x, y);
  }

  public static fromCell(cell: Cell): Position {
    return new Position(cell.x, cell.y);
  }

  public static fromString(pos: PositionDescription): Position {
    const coords = pos.split('x');
    const x = parseInt(coords[0]);
    const y = parseInt(coords[1]);

    if (
      coords.length === 2 &&
      Number.isInteger(x) &&
      Number.isInteger(y)
    ) {
      return new Position(x, y);
    }

    throw new Error('Invalid constuctor parameter');
  }

  /**
   * Method responsible for checking if position instance is adjacent to given coordinates.
   *
   * @param   x   Horizontal coordinate of cell
   * @param   y   Vertical coordinate of examined cell
   */
  public checkIfIsAdjacent(x: number | Position, y: number): boolean {
    if (typeof x === 'number') {
      return Math.abs(this.x - x) <= 1 && Math.abs(this.y - y) <= 1;
    }

    return Math.abs(this.x - x.x) <= 1 && Math.abs(this.y - x.y) <= 1;
  }

  public getDistanceFromPosition(position: Position): number {
    return Math.sqrt(
      Math.pow(position.x - this.x, 2) + Math.pow(position.y - this.y, 2),
    );
  }

  public serialize(): SerializedPosition {
    return { ...this };
  }
}
