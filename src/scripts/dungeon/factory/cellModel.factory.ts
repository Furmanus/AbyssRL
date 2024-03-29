import { CellTypes } from '../constants/cellTypes.constants';
import { FloorModel, SerializedFloor } from '../models/cells/floor_model';
import { cellsDescriptions } from '../constants/cellsDescriptions.constants';
import { terrain } from '../constants/sprites.constants';
import { SerializedWall, WallModel } from '../models/cells/wall_model';
import { WoodenSolidDoorModel } from '../models/cells/doors/wooden_solid_door';
import { LavaCellModel } from '../models/cells/lava_model';
import { FountainModel } from '../models/cells/fountain_model';
import { ShallowWater } from '../models/cells/shallow_water';
import { DeepWater } from '../models/cells/deep_water';
import { BushModel } from '../models/cells/floors/bush_model';
import { TreeModel } from '../models/cells/tree_model';
import { SerializedStairs, StairsModel } from '../models/cells/floors/stairs';
import { DOWN, UP } from '../constants/stairsDirections.constants';
import { Cell, SerializedCell } from '../models/cells/cell_model';
import { BedHead } from '../models/cells/special/bed_head';
import { BedFoot } from '../models/cells/special/bed_foot';
import { BarrelModel } from '../models/cells/special/barrel';
import { ChestOfDrawersModel } from '../models/cells/special/chest_of_drawers_model';
import { SerializedDoor } from '../models/cells/door_model';

type AllSerializedCells =
  | SerializedCell
  | SerializedStairs
  | SerializedWall
  | SerializedFloor
  | SerializedDoor;

export const CellModelFactory = {
  getCellModel(
    x: number,
    y: number,
    type: string,
    serializedData?: AllSerializedCells,
  ): Cell {
    switch (type) {
      case CellTypes.RedFloor:
        return CellModelFactory.getRedFloorCell(
          x,
          y,
          serializedData as SerializedFloor,
        );
      case CellTypes.WoodenFloor:
        return CellModelFactory.getWoodenFloor(
          x,
          y,
          serializedData as SerializedFloor,
        );
      case CellTypes.Grass:
        return CellModelFactory.getGrassFloor(
          x,
          y,
          serializedData as SerializedFloor,
        );
      case CellTypes.GrayWall:
        return CellModelFactory.getGrayWallModel(
          x,
          y,
          serializedData as SerializedWall,
        );
      case CellTypes.HighPeaks:
        return CellModelFactory.getHighPeaksWallModel(
          x,
          y,
          serializedData as SerializedWall,
        );
      case CellTypes.Mountain:
        return CellModelFactory.getMountainWallModel(
          x,
          y,
          serializedData as SerializedWall,
        );
      case CellTypes.Hills:
        return CellModelFactory.getHillsFloorModel(
          x,
          y,
          serializedData as SerializedWall,
        );
      case CellTypes.LeftHills:
        return CellModelFactory.getLeftHillsFloorModel(
          x,
          y,
          serializedData as SerializedFloor,
        );
      case CellTypes.RightHills:
        return CellModelFactory.getRightHillsFloorModel(
          x,
          y,
          serializedData as SerializedFloor,
        );
      case CellTypes.WoodenSolidDoors:
        return CellModelFactory.getWoodenSolidDoors(
          x,
          y,
          serializedData as SerializedDoor,
        );
      case CellTypes.Lava:
        return CellModelFactory.getLavaFloorModel(
          x,
          y,
          serializedData as SerializedFloor,
        );
      case CellTypes.Fountain:
        return CellModelFactory.getFountainModel(x, y, serializedData);
      case CellTypes.ShallowWater:
        return CellModelFactory.getShallowWater(x, y, serializedData);
      case CellTypes.DeepWater:
        return CellModelFactory.getDeepWater(x, y, serializedData);
      case CellTypes.Bush:
        return CellModelFactory.getBush(x, y, serializedData);
      case CellTypes.Tree:
        return CellModelFactory.getTree(x, y, serializedData);
      case CellTypes.StairsDown:
        return CellModelFactory.getStairsDown(
          x,
          y,
          serializedData as SerializedStairs,
        );
      case CellTypes.StairsUp:
        return CellModelFactory.getStairsUp(
          x,
          y,
          serializedData as SerializedStairs,
        );
      case CellTypes.BedHead:
        return CellModelFactory.getBedHead(x, y, serializedData);
      case CellTypes.BedFoot:
        return CellModelFactory.getBedFoot(x, y, serializedData);
      case CellTypes.Barrel:
        return CellModelFactory.getBarrelModel(x, y, serializedData);
      case CellTypes.ChestOfDrawers:
        return CellModelFactory.getChestOfDrawersModel(x, y, serializedData);
      default:
        throw new Error('Unknown cell type in cell model factory.');
    }
  },
  getRedFloorCell(
    x: number,
    y: number,
    serializedData?: SerializedFloor,
  ): FloorModel {
    return new FloorModel({
      x,
      y,
      type: CellTypes.RedFloor,
      description:
        serializedData?.description ?? cellsDescriptions[CellTypes.RedFloor],
      display: serializedData?.display ?? [terrain.RED_FLOOR],
      ...(serializedData && serializedData),
    });
  },
  getWoodenFloor(
    x: number,
    y: number,
    serializedData?: SerializedFloor,
  ): FloorModel {
    return new FloorModel({
      x,
      y,
      type: CellTypes.WoodenFloor,
      description: cellsDescriptions[CellTypes.WoodenFloor],
      display: [terrain.WOODEN_FLOOR_1, terrain.WOODEN_FLOOR_2],
      ...(serializedData && serializedData),
    });
  },
  getGrassFloor(
    x: number,
    y: number,
    serializedData?: SerializedFloor,
  ): FloorModel {
    return new FloorModel({
      x,
      y,
      type: CellTypes.Grass,
      description: cellsDescriptions[CellTypes.Grass],
      display: [terrain.GRASS_2],
      ...(serializedData && serializedData),
    });
  },
  getGrayWallModel(
    x: number,
    y: number,
    serializedData?: SerializedWall,
  ): WallModel {
    return new WallModel({
      x,
      y,
      type: CellTypes.GrayWall,
      description: cellsDescriptions[CellTypes.GrayWall],
      display: [terrain.GRAY_WALL],
      ...(serializedData && serializedData),
    });
  },
  getHighPeaksWallModel(
    x: number,
    y: number,
    serializedData?: SerializedWall,
  ): WallModel {
    return new WallModel({
      x,
      y,
      type: CellTypes.HighPeaks,
      description: cellsDescriptions[CellTypes.HighPeaks],
      display: [terrain.HIGH_PEAKS],
      ...(serializedData && serializedData),
    });
  },
  getMountainWallModel(
    x: number,
    y: number,
    serializedData?: SerializedWall,
  ): WallModel {
    return new WallModel({
      x,
      y,
      type: CellTypes.Mountain,
      description: cellsDescriptions[CellTypes.Mountain],
      display: [terrain.MOUNTAIN],
      ...(serializedData && serializedData),
    });
  },
  getHillsFloorModel(
    x: number,
    y: number,
    serializedData?: SerializedWall,
  ): FloorModel {
    return new FloorModel({
      x,
      y,
      type: CellTypes.Hills,
      description: cellsDescriptions[CellTypes.Hills],
      display: [terrain.HILLS],
      ...(serializedData && serializedData),
    });
  },
  getRightHillsFloorModel(
    x: number,
    y: number,
    serializedData?: SerializedFloor,
  ): FloorModel {
    return new FloorModel({
      x,
      y,
      type: CellTypes.RightHills,
      description: cellsDescriptions[CellTypes.Hills],
      display: [terrain.RIGHT_HILLS],
      ...(serializedData && serializedData),
    });
  },
  getLeftHillsFloorModel(
    x: number,
    y: number,
    serializedData?: SerializedFloor,
  ): FloorModel {
    return new FloorModel({
      x,
      y,
      type: CellTypes.LeftHills,
      description: cellsDescriptions[CellTypes.Hills],
      display: [terrain.LEFT_HILLS],
      ...(serializedData && serializedData),
    });
  },
  getWoodenSolidDoors(
    x: number,
    y: number,
    serializedData?: SerializedDoor,
  ): WoodenSolidDoorModel {
    return new WoodenSolidDoorModel({
      x,
      y,
      ...(serializedData && serializedData),
    });
  },
  getLavaFloorModel(
    x: number,
    y: number,
    serializedData?: SerializedFloor,
  ): LavaCellModel {
    return new LavaCellModel({ x, y, ...(serializedData && serializedData) });
  },
  getFountainModel(
    x: number,
    y: number,
    serializedData?: SerializedCell,
  ): FountainModel {
    return new FountainModel({ x, y, ...(serializedData && serializedData) });
  },
  getShallowWater(
    x: number,
    y: number,
    serializedData?: SerializedCell,
  ): ShallowWater {
    return new ShallowWater({ x, y, ...(serializedData && serializedData) });
  },
  getDeepWater(
    x: number,
    y: number,
    serializedData?: SerializedCell,
  ): DeepWater {
    return new DeepWater({ x, y, ...(serializedData && serializedData) });
  },
  getBush(x: number, y: number, serializedData?: SerializedCell): BushModel {
    return new BushModel({ x, y, ...(serializedData && serializedData) });
  },
  getTree(x: number, y: number, serializedData?: SerializedCell): TreeModel {
    return new TreeModel({ x, y, ...(serializedData && serializedData) });
  },
  getStairsUp(
    x: number,
    y: number,
    serializedData?: SerializedStairs,
  ): StairsModel {
    return new StairsModel({
      x,
      y,
      direction: UP,
      ...(serializedData && serializedData),
    });
  },
  getStairsDown(
    x: number,
    y: number,
    serializedData?: SerializedStairs,
  ): StairsModel {
    return new StairsModel({
      x,
      y,
      direction: DOWN,
      ...(serializedData && serializedData),
    });
  },
  getBedHead(x: number, y: number, serializedData?: SerializedCell): BedHead {
    return new BedHead({ x, y, ...(serializedData && serializedData) });
  },
  getBedFoot(x: number, y: number, serializedData?: SerializedCell): BedFoot {
    return new BedFoot({ x, y, ...(serializedData && serializedData) });
  },
  getBarrelModel(
    x: number,
    y: number,
    serializedData?: SerializedCell,
  ): BarrelModel {
    return new BarrelModel({ x, y, ...(serializedData && serializedData) });
  },
  getChestOfDrawersModel(
    x: number,
    y: number,
    serializedData?: SerializedCell,
  ): ChestOfDrawersModel {
    return new ChestOfDrawersModel({
      x,
      y,
      ...(serializedData && serializedData),
    });
  },
};
