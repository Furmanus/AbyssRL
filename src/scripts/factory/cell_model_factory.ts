import { CellTypes } from '../constants/cells/cell_types';
import {
  FloorModel,
  SerializedFloor,
} from '../model/dungeon/cells/floor_model';
import { cellsDescriptions } from '../helper/cells_description';
import { terrain } from '../constants/cells/sprites';
import { SerializedWall, WallModel } from '../model/dungeon/cells/wall_model';
import { WoodenSolidDoorModel } from '../model/dungeon/cells/doors/wooden_solid_door';
import { LavaCellModel } from '../model/dungeon/cells/lava_model';
import { FountainModel } from '../model/dungeon/cells/fountain_model';
import { ShallowWater } from '../model/dungeon/cells/shallow_water';
import { DeepWater } from '../model/dungeon/cells/deep_water';
import { BushModel } from '../model/dungeon/cells/floors/bush_model';
import { TreeModel } from '../model/dungeon/cells/tree_model';
import {
  SerializedStairs,
  StairsModel,
} from '../model/dungeon/cells/floors/stairs';
import { DOWN, UP } from '../constants/cells/stairs_directions';
import { Cell, SerializedCell } from '../model/dungeon/cells/cell_model';
import { BedHead } from '../model/dungeon/cells/special/bed_head';
import { BedFoot } from '../model/dungeon/cells/special/bed_foot';
import { BarrelModel } from '../model/dungeon/cells/special/barrel';
import { ChestOfDrawersModel } from '../model/dungeon/cells/special/chest_of_drawers_model';
import { SerializedDoor } from '../model/dungeon/cells/door_model';

export const CellModelFactory = {
  getCellModel(x: number, y: number, type: string): Cell {
    switch (type) {
      case CellTypes.RedFloor:
        return CellModelFactory.getRedFloorCell(x, y);
      case CellTypes.WoodenFloor:
        return CellModelFactory.getWoodenFloor(x, y);
      case CellTypes.Grass:
        return CellModelFactory.getGrassFloor(x, y);
      case CellTypes.GrayWall:
        return CellModelFactory.getGrayWallModel(x, y);
      case CellTypes.HighPeaks:
        return CellModelFactory.getHighPeaksWallModel(x, y);
      case CellTypes.Mountain:
        return CellModelFactory.getMountainWallModel(x, y);
      case CellTypes.Hills:
        return CellModelFactory.getHillsFloorModel(x, y);
      case CellTypes.LeftHills:
        return CellModelFactory.getLeftHillsFloorModel(x, y);
      case CellTypes.RightHills:
        return CellModelFactory.getRightHillsFloorModel(x, y);
      case CellTypes.WoodenSolidDoors:
        return CellModelFactory.getWoodenSolidDoors(x, y);
      case CellTypes.Lava:
        return CellModelFactory.getLavaFloorModel(x, y);
      case CellTypes.Fountain:
        return CellModelFactory.getFountainModel(x, y);
      case CellTypes.ShallowWater:
        return CellModelFactory.getShallowWater(x, y);
      case CellTypes.DeepWater:
        return CellModelFactory.getDeepWater(x, y);
      case CellTypes.Bush:
        return CellModelFactory.getBush(x, y);
      case CellTypes.Tree:
        return CellModelFactory.getTree(x, y);
      case CellTypes.StairsDown:
        return CellModelFactory.getStairsDown(x, y);
      case CellTypes.StairsUp:
        return CellModelFactory.getStairsUp(x, y);
      case CellTypes.BedHead:
        return CellModelFactory.getBedHead(x, y);
      case CellTypes.BedFoot:
        return CellModelFactory.getBedFoot(x, y);
      case CellTypes.Barrel:
        return CellModelFactory.getBarrelModel(x, y);
      case CellTypes.ChestOfDrawers:
        return CellModelFactory.getChestOfDrawersModel(x, y);
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
