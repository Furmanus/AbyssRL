import { applicationConfigService, config as globalConfig } from '../../global/config';
import { CellTypes } from '../constants/cellTypes.constants';
import { CellModelFactory } from '../factory/cellModel.factory';
import { BaseModel } from '../../core/base.model';
import { Position, SerializedPosition } from '../../position/position';
import { Cell } from './cells/cell_model';
import { DungeonAreaModel } from './dungeon_area_model';
import { RoomModel, SerializedRoom } from './room_model';
import {
  RoomConnectionModel,
  SerializedRoomConnection,
} from './room_connection_model';
import {
  DungeonModelEvents,
} from '../../constants/dungeon_events';
import { DungeonBranches } from '../constants/dungeonTypes.constants';
import { dungeonState } from '../../state/application.state';
import { convertCoordsToString } from '../../utils/utility';

export type randomCellTest = (cellCandidate: Cell) => boolean;

type LevelModelConstructorOption = {
  branch: DungeonBranches;
  levelNumber: number;
  defaultWallType: CellTypes;
  rooms: RoomModel[];
  roomConnections: RoomConnectionModel[];
  cells: Record<string, string>;
};

export interface SerializedLevel {
  id: string;
  branch: DungeonBranches;
  levelNumber: number;
  defaultWallType: CellTypes;
  rooms: SerializedRoom[];
  stairsUp: SerializedPosition;
  stairsDown: SerializedPosition;
  roomConnections: SerializedRoomConnection[];
  cells: Record<string, string>; // cell coordinate to cell id
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
  private cells: Record<string, string> = {};
  /**
   * @param   branch             Object to which this level belongs
   * @param   levelNumber         Number of this dungeon level
   */
  constructor(
    branch: DungeonBranches,
    levelNumber: number,
    serializedData?: SerializedLevel,
  ) {
    super(serializedData);

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
      id,
    } = data;

    this.defaultWallType = defaultWallType;
    this.stairsUp = new Position(stairsUp.x, stairsUp.y);
    this.stairsDown = new Position(stairsDown.x, stairsDown.y);
    this.id = id;
  }

  /**
   * ONLY USED IN TEST CODE IN LEVEL BUILDER, DO NOT USE OTHERWISE
   * @deprecated
   * @param x
   * @param y
   * @param id
   */
  public setCell(x: number, y: number, id: string): void {
    if (!applicationConfigService.isDevMode && !applicationConfigService.isTestMode) {
      throw new Error('Invalid invocation');
    }

    this.cells[convertCoordsToString(x, y)] = id;
  }

  /**
   * Method responsible for initializing level with {@code Cell} objects. Initially creates level filled with walls.
   */
  private createCells(): void {
    const { defaultWallType } = this;

    for (let i = 0; i < globalConfig.LEVEL_WIDTH; i++) {
      for (let j = 0; j < globalConfig.LEVEL_HEIGHT; j++) {
        const cell = CellModelFactory.getCellModel(i, j, defaultWallType);

        this.cells[convertCoordsToString(i, j)] = cell.id;

        dungeonState.cellsManager.addCell(this.branch, this.levelNumber, cell);
      }
    }
  }

  public changeCellType(x: number, y: number, type: string): void {
    const newCell = CellModelFactory.getCellModel(x, y, type);

    this.cells[convertCoordsToString(x, y)] = newCell.id;

    dungeonState.cellsManager.changeCellType(
      this.branch,
      this.levelNumber,
      x,
      y,
      newCell,
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
    return dungeonState.cellsManager.getCell(
      this.branch,
      this.levelNumber,
      x,
      y,
    );
  }

  /**
   * Returns cell from given position object.
   */
  public getCellFromPosition(position: Position): Cell {
    return this.getCell(position.x, position.y);
  }

  /**
   * Returns map object containing level cells.
   */
  public getCells(): Map<string, Cell> {
    return dungeonState.dungeonsStructure[this.branch][this.levelNumber].cells;
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
    let cell: Cell = Array.from(this.getCells().values()).random();
    let attempt: number = 0;

    while (cell.blockMovement || cell.entity) {
      if (attempt > 100) {
        cell = undefined;
        break;
      }
      cell = Array.from(this.getCells().values()).random();
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
    return {
      ...super.serialize(),
      branch: this.branch,
      levelNumber: this.levelNumber,
      defaultWallType: this.defaultWallType,
      stairsUp: this.stairsUp.serialize(),
      stairsDown: this.stairsDown.serialize(),
      rooms: this.rooms.map((room) => room.getDataToSerialization()),
      roomConnections: Array.from(this.roomConnections).map((connection) =>
        connection.getDataToSerialization(),
      ),
      cells: this.cells,
    };
  }
}
