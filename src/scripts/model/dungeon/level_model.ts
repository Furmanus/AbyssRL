import { config as globalConfig } from '../../global/config';
import { CellTypes } from '../../constants/cells/cell_types';
import { CellModelFactory } from '../../factory/cell_model_factory';
import { BaseModel } from '../../core/base_model';
import { Position, SerializedPosition } from '../position/position';
import { Cell, SerializedCell } from './cells/cell_model';
import { DungeonAreaModel } from './dungeon_area_model';
import { RoomModel, SerializedRoom } from './room_model';
import {
  RoomConnectionModel,
  SerializedRoomConnection,
} from './room_connection_model';
import {
  DungeonEvents,
  DungeonModelEvents,
} from '../../constants/dungeon_events';
import { MapWithObserver } from '../../core/map_with_observer';
import { EntityModel } from '../entity/entity_model';
import { MonsterController } from '../../controller/entity/monster_controller';
import { EntityController } from '../../controller/entity/entity_controller';
import { DungeonBranches } from '../../constants/dungeon_types';

export type randomCellTest = (cellCandidate: Cell) => boolean;

type LevelModelConstructorOption = {
  branch: DungeonBranches;
  levelNumber: number;
  defaultWallType: CellTypes;
  rooms: RoomModel[];
  roomConnections: RoomConnectionModel[];
  cells: Map<string, Cell>;
};

export interface SerializedLevel {
  branch: DungeonBranches;
  levelNumber: number;
  defaultWallType: CellTypes;
  rooms: SerializedRoom[];
  stairsUp: SerializedPosition;
  stairsDown: SerializedPosition;
  roomConnections: SerializedRoomConnection[];
  cells: SerializedCell[];
}

/**
 * Class representing single dungeon level. Contains level map which consist Cell objects.
 */
export class LevelModel extends BaseModel {
  public branch: DungeonBranches;
  public levelNumber: number;
  private defaultWallType: CellTypes = null;
  private rooms: RoomModel[] = [];
  private stairsUp: Position;
  private stairsDown: Position;
  private roomConnections: Set<RoomConnectionModel> = new Set();
  private cells: Map<string, Cell> = new Map();
  /**
   * @param   branch             Object to which this level belongs
   * @param   levelNumber         Number of this dungeon level
   */
  constructor(
    branch: DungeonBranches,
    levelNumber: number,
    serializedData?: SerializedLevel,
  ) {
    super();

    this.branch = branch;
    this.levelNumber = levelNumber;

    if (serializedData) {
      this.recreateLevelFromSerializedData(serializedData);
    }
  }

  /**
   * Initializes level model data.
   *
   * @param   defaultWallType     Type of default wall of level
   */
  public initialize(defaultWallType: CellTypes = CellTypes.HighPeaks): void {
    this.defaultWallType = defaultWallType;

    this.createCells();
  }

  private recreateLevelFromSerializedData(data: SerializedLevel): void {
    const {
      defaultWallType,
      stairsUp,
      stairsDown,
      cells,
      rooms,
      roomConnections,
    } = data;

    this.defaultWallType = defaultWallType;
    this.stairsUp = new Position(stairsUp.x, stairsUp.y);
    this.stairsDown = new Position(stairsDown.x, stairsDown.y);

    this.cells = cells.reduce((accumulator, examinedCell) => {
      const cell = CellModelFactory.getCellModel(
        examinedCell.x,
        examinedCell.y,
        examinedCell.type,
        examinedCell,
      );

      accumulator.set(
        this.convertPositionToMapCoords(examinedCell.x, examinedCell.y),
        cell,
      );

      return accumulator;
    }, new Map<string, Cell>());
  }

  /**
   * Method responsible for initializing level with {@code Cell} objects. Initially creates level filled with walls.
   */
  private createCells(): void {
    const { defaultWallType } = this;

    for (let i = 0; i < globalConfig.LEVEL_WIDTH; i++) {
      for (let j = 0; j < globalConfig.LEVEL_HEIGHT; j++) {
        this.cells.set(
          this.convertPositionToMapCoords(i, j),
          CellModelFactory.getCellModel(i, j, defaultWallType),
        );
      }
    }
  }

  public changeCellType(x: number, y: number, type: string): void {
    this.cells.set(
      this.convertPositionToMapCoords(x, y),
      CellModelFactory.getCellModel(x, y, type),
    );

    this.notify(DungeonModelEvents.CellTypeChanged, { x, y });
  }

  /**
   * Method responsible for setting stairsUp field of level model.
   * @param   x   Row
   * @param   y   Column
   */
  public setStairsUp(x: number, y: number): void {
    this.stairsUp = new Position(x, y);
  }

  /**
   * Returns stairs up location.
   */
  public getStairsUpLocation(): Position {
    return this.stairsUp;
  }

  /**
   * Checks whether two level models are in fact same level.
   *
   * @param level LevelModel
   */
  public isSame(level: LevelModel): boolean {
    return (
      level.branch === this.branch && level.levelNumber === this.levelNumber
    );
  }

  /**
   * Sets stairs down field location in level model.
   * @param   x   Row
   * @param   y   Column
   */
  public setStairsDown(x: number, y: number): void {
    this.stairsDown = new Position(x, y);
  }

  /**
   * Returns location of stairs down.
   */
  public getStairsDownLocation(): Position {
    return this.stairsDown;
  }

  /**
   * Returns cell at given coordinates.
   */
  public getCell(x: number, y: number): Cell {
    return this.cells.get(this.convertPositionToMapCoords(x, y));
  }

  /**
   * Returns cell from given position object.
   */
  public getCellFromPosition(position: Position): Cell {
    return this.cells.get(
      this.convertPositionToMapCoords(position.x, position.y),
    );
  }

  /**
   * Returns map object containing level cells.
   */
  public getCells(): Map<string, Cell> {
    return this.cells;
  }

  /**
   * Returns array of room model present in level.
   */
  public getRooms(): RoomModel[] {
    return this.rooms.length ? this.rooms : null;
  }

  /**
   * Sets array of level rooms.
   *
   * @param   rooms   Array of room models
   */
  public setRooms(rooms: RoomModel[]): void {
    this.rooms = rooms;
  }

  /**
   * Adds model of room connection to roomConnections set.
   *
   * @param   roomConnectionModel     Model of connection between rooms
   */
  public addConnectionBetweenRooms(
    roomConnectionModel: RoomConnectionModel,
  ): void {
    this.roomConnections.add(roomConnectionModel);
  }

  /**
   * Returns array of rooms which are in certain dungeon area.
   *
   * @param   region      Region in which we are looking for rooms
   */
  public getRoomsFromRegion(region: DungeonAreaModel): RoomModel[] {
    const regionLeftTop = region.leftTop;
    const regionRightBottom = region.rightBottom;

    return this.rooms.filter((room: RoomModel) => {
      const xValid =
        room.left >= regionLeftTop.x && room.right <= regionRightBottom.x;
      const yValid =
        room.top >= regionLeftTop.y && room.bottom <= regionRightBottom.y;

      return xValid && yValid;
    });
  }

  public getNearestRoomFromRoom(sourceRoom: RoomModel): RoomModel {
    const { rooms } = this;
    let distance = Infinity;
    let choosenRoom;

    for (const room of rooms) {
      if (room !== sourceRoom) {
        const dist = room.getDistanceFromRoom(sourceRoom);

        if (dist < distance) {
          distance = dist;
          choosenRoom = room;
        }
      }
    }

    return choosenRoom;
  }

  public getCellNeighbours(cell: Cell): Cell[] {
    const result: Cell[] = [];

    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        const examinedCell: Cell = this.getCell(cell.x + i, cell.y + j);

        if (examinedCell && examinedCell !== cell) {
          result.push(examinedCell);
        }
      }
    }

    return result;
  }

  public isCellAdjacentToCell(cell: Cell, callback: randomCellTest): boolean {
    let result: boolean = false;
    const neighbours = this.getCellNeighbours(cell);

    neighbours.forEach((examinedCell: Cell) => {
      if (result) {
        return;
      }
      if (callback(examinedCell)) {
        result = true;
      }
    });

    return result;
  }

  /**
   * Returns random cell without any entity and without blocked movement.
   */
  public getRandomUnoccupiedCell(): Cell {
    let cell: Cell = Array.from(this.cells.values()).random();
    let attempt: number = 0;

    while (cell.blockMovement || cell.entity) {
      if (attempt > 100) {
        cell = undefined;
        break;
      }
      cell = Array.from(this.cells.values()).random();
      attempt += 1;
    }

    return cell;
  }

  public getRandomNeighbourCallback(
    cell: Cell,
    callback: randomCellTest,
  ): Cell {
    const neighbours: Cell[] = this.getCellNeighbours(cell);
    let result: Cell = neighbours.random();
    let attempt: number = 0;

    while (!callback(result)) {
      result = neighbours.random();
      attempt += 1;

      if (attempt > 15) {
        return null;
      }
    }

    return result;
  }

  public getDataToSerialization(): SerializedLevel {
    const serializedCells: SerializedCell[] = [];

    for (const cell of this.cells.values()) {
      serializedCells.push(cell.getDataToSerialization());
    }

    return {
      branch: this.branch,
      levelNumber: this.levelNumber,
      defaultWallType: this.defaultWallType,
      stairsUp: this.stairsUp.serialize(),
      stairsDown: this.stairsDown.serialize(),
      rooms: this.rooms.map((room) => room.getDataToSerialization()),
      roomConnections: Array.from(this.roomConnections).map((connection) =>
        connection.getDataToSerialization(),
      ),
      cells: serializedCells,
    };
  }

  private convertPositionToMapCoords(x: number, y: number): string {
    return `${x}x${y}`;
  }
}
