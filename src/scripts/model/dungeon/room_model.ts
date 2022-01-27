import { Rectangle, SerializedRectangle } from '../position/rectangle';
import * as Utility from '../../helper/utility';
import { Position, SerializedPosition } from '../position/position';
import * as Rng from '../../helper/rng';
import { BaseModel } from '../../core/base_model';
import { IAnyFunction } from '../../interfaces/common';
import { LevelModel } from './level_model';
import { Cell } from './cells/cell_model';

export interface IRoomConfig {
  iteration?: number;
  levelModel: LevelModel;
}

type CellsTransformFunction = (
  positionX: number,
  positionY: number,
  isWall: 1 | 0,
) => void;

export type SerializedRoom = {
  rectangle: SerializedRectangle;
  doorSpots: SerializedPosition[];
  cells: SerializedPosition[];
};

export class RoomModel extends BaseModel {
  public rectangle: Rectangle;
  public iteration: number;
  public doorSpots: Set<Position>;
  public cells: Position[];
  private levelModel: LevelModel;

  constructor(
    rectangle: Rectangle,
    roomConfig: IRoomConfig,
    doorSpots: Position[] = [],
  ) {
    super();

    this.rectangle = rectangle;
    this.iteration = roomConfig.iteration;
    this.levelModel = roomConfig.levelModel;
    this.cells = this.createCells();
    /**
     * Set of door positions in room.
     */
    this.doorSpots = new Set<Position>(doorSpots);
  }

  get left(): number {
    return this.rectangle.leftTop.x;
  }

  get top(): number {
    return this.rectangle.leftTop.y;
  }

  get bottom(): number {
    return this.rectangle.leftBottom.y;
  }

  get right(): number {
    return this.rectangle.rightBottom.x;
  }

  get width(): number {
    return this.rectangle.width;
  }

  get height(): number {
    return this.rectangle.height;
  }

  get hasStairsUp(): boolean {
    return !!this.getCellsFromPosition().find((cell: Cell) =>
      cell.type.includes('stairs_up'),
    );
  }

  get hasStairsDown(): boolean {
    return !!this.getCellsFromPosition().find((cell: Cell) =>
      cell.type.includes('stairs_down'),
    );
  }

  public createCells(): Position[] {
    const { left, top, right, bottom } = this;
    const cells: Position[] = [];

    for (let i = left; i < right; i++) {
      for (let j = top; j < bottom; j++) {
        cells.push(new Position(i, j));
      }
    }

    return cells;
  }

  /**
   * Returns randomly chosen cell which passes boolean test provided by callback function given as argument.
   *
   * @param callback  Callback function which returns boolean value indicating whether chosen cell should be returned
   */
  public getRandomCallbackCell(callback: (cell: Cell) => boolean): Cell {
    let cell: Cell;
    let attemptNumber: number = 0;

    while (!cell) {
      if (attemptNumber > 200) {
        break;
      } else {
        const cellCandidate: Cell = this.getCellsFromPosition().random();

        if (callback(cellCandidate)) {
          cell = cellCandidate;
        }

        attemptNumber += 1;
      }
    }

    return cell;
  }

  /**
   * Returns randomly chosen floor type of cell from room.
   */
  public getRandomInteriorCell(): Cell {
    let cell: Cell;

    while (!cell) {
      const cellCandidate: Cell = this.getCellsFromPosition().random();

      if (!cellCandidate.blockMovement) {
        cell = cellCandidate;
      }
    }

    return cell;
  }

  /**
   * Returns randomly chosen wall type of cell from room.
   */
  public getRandomWallCell(): Cell {
    let cell: Cell;

    while (!cell) {
      const cellCandidate: Cell = this.getCellsFromPosition().random();

      if (cellCandidate.blockMovement) {
        cell = cellCandidate;
      }
    }

    return cell;
  }

  public recalculateCells(): void {
    this.cells = this.createCells();
  }

  public getCell(x: number, y: number): Cell {
    return this.levelModel.getCell(x, y);
  }

  public getCellsFromPosition(): Cell[] {
    const cells: Cell[] = [];

    this.cells.forEach((pos: Position) => {
      cells.push(this.getCell(pos.x, pos.y));
    });

    return cells;
  }

  public changeCellType(x: number, y: number, type: string): void {
    const cell: Cell = this.levelModel.getCell(x, y);

    if (cell) {
      this.levelModel.changeCellType(x, y, type);
    }
  }

  public transform(callback: CellsTransformFunction): this {
    this.cells.forEach((pos: Position) => {
      const isWall =
        pos.y === this.top ||
        pos.y === this.bottom ||
        pos.x === this.right ||
        pos.x === this.left;

      callback(pos.x, pos.y, isWall ? 1 : 0);
    });

    return this;
  }

  public scale(ratio: number): this {
    this.rectangle.scale(ratio);
    this.recalculateCells();

    return this;
  }

  public addDoorSpot(position: Position): this {
    this.doorSpots.add(position);

    return this;
  }

  public getDistanceFromRoom(room: RoomModel): number {
    const rect = this.rectangle;
    const thisLeftTop = rect.leftTop;
    const thisLeftBottom = rect.rightBottom;
    const thisRightTop = rect.rightTop;
    const thisRightBottom = rect.rightBottom;
    const examinedRect = room.rectangle;
    const examinedLeftTop = examinedRect.leftTop;
    const examinedLeftBottom = examinedRect.leftBottom;
    const examinedRightTop = examinedRect.rightTop;
    const examinedRightBottom = examinedRect.rightBottom;
    const thisHorizontalBefore = Math.sign(room.left - this.right) < 0;
    const thisVerticalBefore = Math.sign(room.top - this.bottom) < 0;
    let distance;

    if (thisHorizontalBefore && thisVerticalBefore) {
      distance = Utility.getDistanceBetweenPoints(
        thisRightBottom,
        examinedLeftTop,
      );
    } else if (thisHorizontalBefore && !thisVerticalBefore) {
      distance = Utility.getDistanceBetweenPoints(
        thisRightTop,
        examinedLeftBottom,
      );
    } else if (!thisHorizontalBefore && thisVerticalBefore) {
      distance = Utility.getDistanceBetweenPoints(
        thisLeftBottom,
        examinedRightTop,
      );
    } else if (!thisHorizontalBefore && !thisVerticalBefore) {
      distance = Utility.getDistanceBetweenPoints(
        thisLeftTop,
        examinedRightBottom,
      );
    }

    return distance;
  }

  public getRandomRoomCellPosition(): Position {
    return new Position(
      Rng.getRandomNumber(this.left + 1, this.right - 1),
      Rng.getRandomNumber(this.top + 1, this.bottom - 1),
    );
  }

  /**
   * Returns model of level which contains this room.
   */
  public getLevelModel(): LevelModel {
    return this.levelModel;
  }

  public getDataToSerialization(): SerializedRoom {
    return {
      rectangle: this.rectangle.getDataToSerialization(),
      doorSpots: Array.from(this.doorSpots).map((pos) => pos.serialize()),
      cells: this.cells.map((pos) => pos.serialize()),
    };
  }
}
