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
}
