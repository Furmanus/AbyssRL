import { MonstersTypes } from '../../entity/constants/monsters';
import { SerializedEntityModel } from '../../entity/models/entity.model';
import { MonsterModel } from '../../entity/models/monster.model';
import { config } from '../../global/config';
import { ExchangePropertyType } from '../../interfaces/utility.interfaces';
import { ItemTypes } from '../../items/constants/itemTypes.constants';
import { ArmourModelFactory } from '../../items/factory/item/armour_model_factory';
import { WeaponModelFactory } from '../../items/factory/item/weaponModel.factory';
import { ItemsCollection } from '../../items/items_collection';
import { ItemModel } from '../../items/models/item.model';
import { Position, PositionDescription } from '../../position/position';
import { SerializedDungeonLevelEntryStructure } from '../../state/applicationState.interfaces';
import { TimeEngine } from '../../timeEngine/timeEngine';
import { TimeEngineTypes } from '../../timeEngine/timeEngine.constants';
import { CellTypes } from '../constants/cellTypes.constants';
import { DungeonBranches } from '../constants/dungeonTypes.constants';
import { CellModelFactory } from '../factory/cellModel.factory';
import { LevelModelFactory } from '../factory/levelModel.factory';
import type { LevelNumberType } from '../interfaces/level';
import { Cell, SerializedCell } from '../models/cells/cell_model';
import { LevelModel } from '../models/level_model';
import { SerializedRoom } from '../models/room_model';

const constructorToken = Symbol('DungeonLevelBuilder');

type RoomType = Pick<ExchangePropertyType<SerializedRoom, 'doorSpots', PositionDescription[]>, 'doorSpots' | 'rectangle'> & {
  floorType: CellTypes;
  wallType: CellTypes;
  doorType: CellTypes;
};

export interface JSONBuilderLevelData {
    branch: DungeonBranches;
    levelNumber: LevelNumberType;
    defaultWallType: CellTypes;
    cells: Record<PositionDescription, CellTypes>;
    rooms?: RoomType[];
    stairsUp: PositionDescription;
    stairsDown: PositionDescription;
    items: Record<PositionDescription, ItemTypes[]>;
    entities: Record<PositionDescription, MonstersTypes>;
}

export class DungeonLevelBuilder {
    #levelModel: LevelModel;
    #cells: Record<PositionDescription, Cell> = {};
    #entities: SerializedEntityModel[] = [];
    #items: Record<PositionDescription, ItemModel[]> = {};

    public constructor(token: Symbol, data: JSONBuilderLevelData) {
      if (token !== constructorToken) {
        throw new Error('Invalid constructor');
      }

      const { branch, levelNumber } = data;

      this.#levelModel = LevelModelFactory.getNewLevelModel(branch, parseInt(levelNumber));
    }

    public static create(data: JSONBuilderLevelData): DungeonLevelBuilder {
      return new DungeonLevelBuilder(constructorToken, data)
        .prepareLevel()
        .withRooms(data.rooms)
        .withCells(data.cells)
        .withItems(data.items)
        .withStairsDown(data.stairsDown)
        .withStairsUp(data.stairsUp)
        .withEntities(data.entities);
    }

    public prepareLevel(): this {
      for (let i = 0; i < config.LEVEL_WIDTH; i++) {
        for (let j = 0; j < config.LEVEL_HEIGHT; j++) {
          const cell = CellModelFactory.getCellModel(i, j, CellTypes.GrayWall);

          this.#cells[`${i}x${j}`] = cell;
          (this.#levelModel as any).setCell(i, j, cell.id);
        }
      }

      return this;
    }

    public withCells(cellData: JSONBuilderLevelData['cells']): this {
      if (cellData) {
        for (const [coord, cellType] of Object.entries(cellData) as Array<[PositionDescription, CellTypes]>) {
          const { x, y } = Position.fromString(coord);
          const cell = CellModelFactory.getCellModel(x, y, cellType);

          this.#cells[coord] = cell;
          (this.#levelModel as any).setCell(x, y, cell.id);
        }
      }

      return this;
    }

    public withRooms(roomData?: JSONBuilderLevelData['rooms']): this {
      if (Array.isArray(roomData) && roomData.length) {
        roomData.forEach((room) => {
          const { doorSpots, doorType, floorType, rectangle, wallType } = room;
          const { height, leftTop, width } = rectangle;
          const { x, y } = leftTop;

          for (let i = x; i < width; i++) {
            for (let j = y; j < height; j++) {
              const isEdge = i === x || i === width - 1 || y === 0 || j === height - 1;
              const cell = CellModelFactory.getCellModel(i, j, isEdge ? wallType : floorType);

              this.#cells[`${i}x${j}`] = cell;
              (this.#levelModel as any).setCell(i, j, cell.id);
            }
          }

          for (const doorSpot of doorSpots) {
            const { x, y } = Position.fromString(doorSpot);
            const cell = CellModelFactory.getCellModel(x, y, doorType);

            this.#cells[`${x}x${y}`] = cell;
            (this.#levelModel as any).setCell(x, y, cell.id);
          }
        });
      }

      return this;
    }

    public withStairsDown(position: PositionDescription): this {
      const { x, y } = Position.fromString(position);
      const cell = CellModelFactory.getCellModel(x, y, CellTypes.StairsDown);

      this.#levelModel.setStairsDown(x, y);
      this.#cells[`${x}x${y}`] = cell;
      (this.#levelModel as any).setCell(x, y, cell.id);

      return this;
    }

    public withStairsUp(position: PositionDescription): this {
      const { x, y } = Position.fromString(position);
      const cell = CellModelFactory.getCellModel(x, y, CellTypes.StairsUp);

      this.#levelModel.setStairsUp(x, y);
      this.#cells[`${x}x${y}`] = cell;
      (this.#levelModel as any).setCell(x, y, cell.id);

      return this;
    }

    public withItems(itemData: JSONBuilderLevelData['items']): this {
      for (const [coord, itemTypes] of Object.entries(itemData) as Array<[PositionDescription, ItemTypes[]]>) {
        const { x, y } = Position.fromString(coord);
        const position: PositionDescription = `${x}x${y}`;

        for (const itemType of itemTypes) {
          let item: ItemModel;

          switch (itemType) {
            case ItemTypes.Armour:
              item = ArmourModelFactory.getRandomArmourModel();
              break;
            case ItemTypes.Weapon:
              item = WeaponModelFactory.getRandomWeaponModel();
              break;
            default:
              throw new Error('Invalid weapon type');
          }

          this.#items[position] = [...(this.#items[position] || []), item];
        }
      }

      return this;
    }

    public withEntities(entitiesData: JSONBuilderLevelData['entities']): this {
      for (const [coord, monsterType] of Object.entries(entitiesData)) {
        const { x, y } = Position.fromString(coord as PositionDescription);
        const entityModel = new MonsterModel({
          type: monsterType,
          position: {
            branch: this.#levelModel.branch,
            level: this.#levelModel.levelNumber,
            position: new Position(x, y),
          }
        } as SerializedEntityModel);

        this.#entities.push(entityModel.serialize());
      }

      return this;
    }

    public build(): SerializedDungeonLevelEntryStructure {
      return {
        cells: this.#prepareCells(),
        entities: this.#entities,
        level: this.#levelModel.getDataToSerialization(),
        scheduledDungeonEvents: [],
        timeEngine: {
          engine: {
            type: TimeEngineTypes.Speed,
            queue: this.#entities.map((entity) => ({
              actorId: entity.id,
              isRepeatable: true,
              lastSavedActorSpeed: entity.speed,
              nextActionAt: 1 / entity.speed,
            })),
            wasEngineStarted: false,
            currentTimestamp: 0,
            isUnlocked: false,
          },
        },
      };
    }

    #prepareCells(): Record<PositionDescription, SerializedCell> {
      return Object.entries(this.#cells).reduce((result, [position, cell]: [PositionDescription, Cell]) => {
        if (this.#items[position]?.length) {
          if (cell.isContainer) {
            cell.containerInventory = ItemsCollection.getInstance(this.#items[position]);
          } else {
            cell.inventory = ItemsCollection.getInstance(this.#items[position]);
          }
        }

        result[position] = cell.getDataToSerialization();

        return result;
      }, {} as Record<PositionDescription, SerializedCell>)
    }
}
