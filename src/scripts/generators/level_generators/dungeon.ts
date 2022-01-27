import { config as globalConfig } from '../../global/config';
import { AbstractLevelGenerator } from './abstract_generator';
import { CellTypes } from '../../constants/cells/cell_types';
import { Position } from '../../model/position/position';
import { RoomModel } from '../../model/dungeon/room_model';
import {
  DIRECTION_HORIZONTAL,
  DIRECTION_VERTICAL,
} from '../../constants/directions';
import * as Rng from '../../helper/rng';
import { DungeonAreaModel } from '../../model/dungeon/dungeon_area_model';
import { RoomConnectionModel } from '../../model/dungeon/room_connection_model';
import { LevelModel } from '../../model/dungeon/level_model';
import { IAnyFunction } from '../../interfaces/common';
import { IDungeonStrategyGenerateLevelConfig } from '../../interfaces/generators';
import { DungeonVaultsGenerator } from './vaults_generators/dungeon_vaults.js';
import { LevelController } from '../../controller/dungeon/level_controller';

interface IBspSplitRegions {
  roomsToReturn: DungeonAreaModel[];
  createdAreas: DungeonAreaModel[];
}
interface IPreparedLevelAreas {
  [prop: number]: {
    [prop: string]: [DungeonAreaModel, DungeonAreaModel];
  };
}

const singletonToken: symbol = Symbol(
  'Dungeon level generator singleton token',
);
let instance: DungeonLevelGenerator;

/**
 * Class representing generator of dungeon type levels. Uses BSP algorithm to randomly generate connected rooms.
 * DungeonLevelGenerator is singleton, only one instance is available. Use DungeonLevelGenerator.getInstance() method to
 * get it.
 */
export class DungeonLevelGenerator extends AbstractLevelGenerator {
  /**
   * @param   token   Unique token used to generate only instance.
   */
  constructor(token: symbol) {
    super();

    if (token !== singletonToken) {
      throw new Error(
        "Can't create instance of singleton class with new keyword. Use getInstance() static method instead",
      );
    }
  }

  /**
   * Generates random dungeon (rooms connected with corridors) from given level cells.
   *
   * @param   levelController    Level controller which models cells will be modified.
   * @param   config             Additional level config info.
   * @param   debugCallback      Optional callback function serving as debug for map generation
   */
  public generateLevel(
    levelController: LevelController,
    config?: IDungeonStrategyGenerateLevelConfig,
    debugCallback?: IAnyFunction,
  ): void {
    const { model: level } = levelController;
    const roomsArray: RoomModel[] = [];
    const bspRegions: IBspSplitRegions = this.createBspSplitRegions(undefined, {
      level,
    });
    const createdRooms: DungeonAreaModel[] = bspRegions.roomsToReturn;
    const { createdAreas } = bspRegions;
    const rooms: RoomModel[] = this.createRoomsFromRegions(createdRooms);

    level.initialize(CellTypes.GrayWall);
    /**
     * Transform rectangles into rooms on level model.
     */
    rooms.forEach((room: RoomModel) => {
      const scalePercentage: number = Rng.getRandomNumber(50, 70) / 100;
      // TODO Think and implement moving each room by random vector
      room.scale(scalePercentage).transform(generatorCallback);
      roomsArray.push(room);
    });

    level.setRooms(roomsArray);

    this.connectAreas(level, this.prepareLevelAreas(createdAreas));

    this.generateDoors(level);
    this.generateRandomStairsUp(level);

    if (config && config.generateStairsDown) {
      this.generateRandomStairsDown(level);
    }

    function generatorCallback(x: number, y: number, value: number): void {
      if (value === 1) {
        level.changeCellType(x, y, CellTypes.GrayWall);
      } else {
        level.changeCellType(x, y, CellTypes.RedFloor);
      }
    }

    rooms.forEach((room: RoomModel) => {
      DungeonVaultsGenerator.generateRandomRoom(room);
    });

    this.generateMonsters(levelController);
  }

  /**
   * Method responsible for generating doors in level model.
   *
   * @param   level   Level model instance
   */
  private generateDoors(level: LevelModel): void {
    const levelRooms: RoomModel[] = level.getRooms();

    if (levelRooms) {
      levelRooms.forEach((room: RoomModel) => {
        const { doorSpots } = room;

        if (doorSpots) {
          doorSpots.forEach((doorSpot: Position) => {
            level.changeCellType(
              doorSpot.x,
              doorSpot.y,
              CellTypes.WoodenSolidDoors,
            );
          });
        }
      });
    }
  }

  /**
   * Recursively splits starting rectangle into set of separate regions of given min and max size.
   *
   * @param   iteration           Number of current iteration of algorithm
   * @param   config              Object with config data
   * @param   roomsToAnalyze      Array of rectangles to analyze in next iteration
   * @param   roomsToReturn       Array of rectangles finally returned by algorithm
   * @param   createdAreas        Array of rectangles created during algorithm
   * @returns                     Object with created rooms and created areas
   */
  private createBspSplitRegions(
    iteration: { value: number } = { value: 0 },
    config: {
      level: LevelModel;
      minRoomLength?: number;
      maxRoomLength?: number;
    },
    roomsToAnalyze?: DungeonAreaModel[],
    roomsToReturn?: DungeonAreaModel[],
    createdAreas?: DungeonAreaModel[],
  ): IBspSplitRegions {
    const minRoomLength = config.minRoomLength || 8;
    const maxRoomLength = config.maxRoomLength || 15;

    roomsToReturn = roomsToReturn || [];
    createdAreas = createdAreas || [];

    /**
     * Array of rooms to analyze in next iteration
     */
    let newRoomsToAnalyze: DungeonAreaModel[] = [];

    iteration.value += 1;
    /**
     * If no roomsToAnalyze argument is passed it means it's first iteration of algorithm and we have to initialize
     * starting room
     */
    roomsToAnalyze = roomsToAnalyze || [
      new DungeonAreaModel(
        new Position(0, 0),
        globalConfig.LEVEL_WIDTH,
        globalConfig.LEVEL_HEIGHT,
        null,
        0,
        config.level,
      ),
    ];
    /**
     * We analyze each rectangle in array with rectangles to analyze
     */
    roomsToAnalyze.forEach((area: DungeonAreaModel) => {
      const isWalidWidth: boolean = area.width <= maxRoomLength;
      const isWalidHeight: boolean = area.height <= maxRoomLength;
      let splitRooms;

      if (area.width < minRoomLength || area.height < minRoomLength) {
        return;
      }
      /**
       * If room has valid width and height, add it to rectangles finally returned by method. Otherwise split
       * it into to separate rectangles and add it to analyze in next iteration.
       */
      if (isWalidHeight && isWalidWidth) {
        roomsToReturn.push(area);
      } else if (isWalidWidth && !isWalidHeight) {
        splitRooms = area.splitVertical(iteration.value);
        if (splitRooms.length === 2) {
          newRoomsToAnalyze = newRoomsToAnalyze.concat(splitRooms);
          createdAreas.push(...splitRooms);
        }
      } else if (!isWalidWidth && isWalidHeight) {
        splitRooms = area.splitHorizontal(iteration.value);
        if (splitRooms.length === 2) {
          newRoomsToAnalyze = newRoomsToAnalyze.concat(splitRooms);
          createdAreas.push(...splitRooms);
        }
      } else {
        splitRooms =
          area.width > area.height
            ? area.splitHorizontal(iteration.value)
            : area.splitVertical(iteration.value);
        if (splitRooms.length === 2) {
          newRoomsToAnalyze = newRoomsToAnalyze.concat(splitRooms);
          createdAreas.push(...splitRooms);
        }
      }
    });
    /**
     * If there are any rectangles to analyze, trigger next iteration. Because last parameter, roomsToReturn array
     * is always a referrence to the same array, it can be finally returned when all iterations except for starting
     * one are completed.
     */
    if (newRoomsToAnalyze.length) {
      this.createBspSplitRegions(
        iteration,
        config,
        newRoomsToAnalyze,
        roomsToReturn,
        createdAreas,
      );
    }

    return {
      roomsToReturn,
      createdAreas,
    };
  }

  /**
   * Method responsible for connecting adjacent areas with each other. createdAreasObject contains keys which are
   * equal to iteration of areas. Each key contains object which keys are generated uids of two adjacent regions.
   * {
   *     1: {
   *             'uniqueUid1': Array.<DungeonAreaModel>
   *        },
   *     2: {
   *             'uniqueUid2': Array.<DungeonAreaModel>
   *        }
   * }
   * Each array always has only two dungeon area models. Method iterates from highest iteration to lowest and connects
   * adjacent regions with each others.
   *
   * @param   level                   Level model
   * @param   createdAreasObject      Level areas object data
   */
  private connectAreas(
    level: LevelModel,
    createdAreasObject: IPreparedLevelAreas,
  ): void {
    const iterationsKeys = Object.keys(createdAreasObject);
    const iterationsLength = iterationsKeys.length;

    for (let iteration = iterationsLength; iteration >= 1; iteration--) {
      const iterationUids = createdAreasObject[iteration];

      for (const uid of Object.keys(iterationUids)) {
        this.connectTwoRegions(level, ...iterationUids[uid]);
      }
    }
  }

  /**
   * Method responsible for creating object described in connectAreas method.
   */
  private prepareLevelAreas(
    createdAreas: DungeonAreaModel[],
  ): IPreparedLevelAreas {
    const result: IPreparedLevelAreas = {};

    createdAreas.forEach((area: DungeonAreaModel) => {
      const areaUid = area.uid;
      const areaIteration = area.iteration;

      if (!result[areaIteration]) {
        result[areaIteration] = {};
      }

      const examinedResultIteration = result[areaIteration];

      if (!examinedResultIteration[areaUid]) {
        // @ts-ignore
        examinedResultIteration[areaUid] = [];
      }

      examinedResultIteration[areaUid].push(area);
    });

    return result;
  }

  /**
   * Method responsible for connecting two separate, preferably adjacent regions.
   *
   * @param   level           Level model in which both areas are present
   * @param   firstRegion     Model of first dungeon area
   * @param   secondRegion    Model of second dungeon area
   */
  private connectTwoRegions(
    level: LevelModel,
    firstRegion: DungeonAreaModel,
    secondRegion: DungeonAreaModel,
  ): void {
    const firstRegionRooms: RoomModel[] = level.getRoomsFromRegion(firstRegion);
    const secondRegionRooms: RoomModel[] =
      level.getRoomsFromRegion(secondRegion);
    let distance: number = Infinity;
    let chosenRooms: [RoomModel, RoomModel];
    /**
     * We take rooms from each of areas and compare distance of each room from first area with each room from second
     * area. We take two rooms with lowest distance and connect them.
     */
    firstRegionRooms.forEach((firstRoom: RoomModel) => {
      secondRegionRooms.forEach((secondRoom: RoomModel) => {
        const roomsDistance: number = firstRoom.getDistanceFromRoom(secondRoom);

        if (roomsDistance < distance) {
          distance = roomsDistance;
          chosenRooms = [firstRoom, secondRoom];
        }
      });
    });

    if (chosenRooms) {
      this.connectTwoRooms(level, chosenRooms[0], chosenRooms[1], [
        CellTypes.RedFloor,
      ]);
    }
  }

  /**
   * Creates array of RoomModels from array of rectangles.
   *
   * @param   regionArray     Array of rectangles in which level map was split
   * @returns                 Returns array of created room models.
   */
  private createRoomsFromRegions(regionArray: DungeonAreaModel[]): RoomModel[] {
    return regionArray
      .map((item: DungeonAreaModel) => {
        if (item.area >= 16) {
          const roomModel = new RoomModel(item.rectangle, {
            iteration: item.iteration,
            levelModel: item.levelModel,
          });
          item.roomModel = roomModel;
          return roomModel;
        }
        return null;
      })
      .filter((item: RoomModel) => {
        return !!item;
      });
  }

  /**
   * Creates connection between two rooms.
   *
   * @param   level               Level model which contains both rooms
   * @param   room1               First room to connect
   * @param   room2               Second room to connect
   * @param   cellsToChange       Array of cell types on which corridor cells will be changed
   * @param   forbidenCells       Array of cell types which can't be changed, algorithm should stop when first
   *                              forbidden cell is encountered
   * @returns                     Return false if creating connection was not successful.
   */
  private connectTwoRooms(
    level: LevelModel,
    room1: RoomModel,
    room2: RoomModel,
    cellsToChange: string[],
    forbidenCells: string[] = [],
  ): boolean {
    const x1: number = room1.left;
    const y1: number = room1.top;
    const w1: number = room1.width;
    const h1: number = room1.height;
    const x2: number = room2.left;
    const y2: number = room2.top;
    const w2: number = room2.width;
    const h2: number = room2.height;
    const firstRoomBeforeHorizontal: boolean = x1 + w1 < x2;
    const firstRoomAfterHorizontal: boolean = x2 + w2 < x1;
    const horizontal: boolean =
      firstRoomBeforeHorizontal || firstRoomAfterHorizontal;
    const firstRoomBeforeVertical: boolean = y1 + h1 < y2;
    const firstRoomAfterVertical: boolean = y2 + h2 < y1;
    const horizontalDistance: number =
      room1.rectangle.getHorizontalDistanceFromRect(room2.rectangle);
    const verticalDistance: number =
      room1.rectangle.getVerticalDistanceFromRect(room2.rectangle);
    const vertical: boolean = firstRoomBeforeVertical || firstRoomAfterVertical;
    let pointA: Position;
    let pointB: Position;
    let direction: string;

    if (horizontal && !vertical) {
      direction = DIRECTION_HORIZONTAL;
    } else if (!horizontal && vertical) {
      direction = DIRECTION_VERTICAL;
    } else if (horizontal && vertical) {
      direction =
        verticalDistance > horizontalDistance
          ? DIRECTION_VERTICAL
          : DIRECTION_HORIZONTAL;
    } else {
      // tslint:disable-next-line:no-console
      console.warn(
        'Connection of two rooms in method connectTwoRooms returned false.',
      );
      return false;
    }

    if (DIRECTION_HORIZONTAL === direction) {
      const room1X = firstRoomBeforeHorizontal ? room1.right : room1.left;
      const room2X = firstRoomBeforeHorizontal ? room2.left : room2.right;
      const room1DeltaY =
        Rng.getRandomNumber(-1, 1) * Rng.getRandomNumber(0, Math.floor(h1 / 3));
      const room2DeltaY =
        Rng.getRandomNumber(-1, 1) * Rng.getRandomNumber(0, Math.floor(h2 / 3));
      const room1Y = Math.floor(room1.top + room1.height / 2) + room1DeltaY;
      const room2Y = Math.floor(room2.top + room2.height / 2) + room2DeltaY;

      pointA = new Position(room1X, room1Y);
      pointB = new Position(room2X, room2Y);
    } else if (DIRECTION_VERTICAL === direction) {
      const room1Y = firstRoomBeforeVertical ? room1.bottom : room1.top;
      const room2Y = firstRoomBeforeVertical ? room2.top : room2.bottom;
      const room1DeltaX =
        Rng.getRandomNumber(-1, 1) * Rng.getRandomNumber(0, Math.floor(w1 / 3));
      const room2DeltaX =
        Rng.getRandomNumber(-1, 1) * Rng.getRandomNumber(0, Math.floor(w2 / 3));
      const room1X = Math.floor(room1.left + room1.width / 2) + room1DeltaX;
      const room2X = Math.floor(room2.left + room2.width / 2) + room2DeltaX;

      pointA = new Position(room1X, room1Y);
      pointB = new Position(room2X, room2Y);
    } else {
      throw new Error('Uknown direction type in connectTwoRooms method');
    }

    const connectionResult = this.createConnectionBetweenTwoPoints(
      level,
      direction,
      pointA,
      pointB,
      cellsToChange,
      forbidenCells,
    );

    if (connectionResult) {
      room1.addDoorSpot(pointA);
      room2.addDoorSpot(pointB);
      // typescript compiler bug, not recognizing connection result as Array<Position>
      // @ts-ignore
      level.addConnectionBetweenRooms(
        new RoomConnectionModel(room1, room2, connectionResult as Position[]),
      );
    }
  }

  /**
   * Generates stairs up in randomly choosen room.
   *
   * @param   level   Level model
   */
  protected generateRandomStairsUp(level: LevelModel): void {
    const rooms: RoomModel[] = level.getRooms();
    const randomRoom: RoomModel = rooms.random();
    const randomCellPosition: Position = randomRoom.getRandomRoomCellPosition();

    level.changeCellType(
      randomCellPosition.x,
      randomCellPosition.y,
      CellTypes.StairsUp,
    );
    level.setStairsUp(randomCellPosition.x, randomCellPosition.y);
  }

  /**
   * Generates stairsDown in randomly choosen room, but not in the room with stairs up.
   *
   * @param   level   Level model
   */
  protected generateRandomStairsDown(level: LevelModel): void {
    const rooms: RoomModel[] = level.getRooms();
    let randomRoom: RoomModel = rooms.random();

    while (randomRoom.hasStairsUp) {
      randomRoom = rooms.random();
    }

    const randomCellPosition = randomRoom.getRandomRoomCellPosition();

    level.changeCellType(
      randomCellPosition.x,
      randomCellPosition.y,
      CellTypes.StairsDown,
    );
    level.setStairsDown(randomCellPosition.x, randomCellPosition.y);
  }

  /**
   * Returns only created instance of cavern level generator.
   */
  public static getInstance(): DungeonLevelGenerator {
    if (!instance) {
      instance = new DungeonLevelGenerator(singletonToken);
    }

    return instance;
  }
}
