import {CellTypes} from '../constants/cell_types';
import {FloorModel} from '../model/dungeon/cells/floor_model';
import {cellsDescriptions} from '../helper/cells_description';
import {TerrainSprites} from '../constants/sprites';
import {WallModel} from '../model/dungeon/cells/wall_model';
import {WoodenSolidDoorModel} from '../model/dungeon/cells/doors/wooden_solid_door';
import {LavaCellModel} from '../model/dungeon/cells/lava_model';
import {FountainModel} from '../model/dungeon/cells/fountain_model';
import {ShallowWater} from '../model/dungeon/cells/shallow_water';
import {DeepWater} from '../model/dungeon/cells/deep_water';
import {BushModel} from '../model/dungeon/cells/floors/bush_model';
import {TreeModel} from '../model/dungeon/cells/tree_model';
import {StairsModel} from '../model/dungeon/cells/floors/stairs';
import {DOWN, StairDirections, UP} from '../constants/stairs_directions';
import {Cell} from '../model/dungeon/cells/cell_model';
import {BedHead} from '../model/dungeon/cells/special/bed_head';
import {BedFoot} from '../model/dungeon/cells/special/bed_foot';
import {BarrelModel} from '../model/dungeon/cells/special/barrel';
import {ChestOfDrawersModel} from '../model/dungeon/cells/special/chest_of_drawers_model';

export const CellModelFactory = {
    getCellModel(x: number, y: number, type: string): Cell {
        switch (type) {
            case CellTypes.RED_FLOOR:
                return CellModelFactory.getRedFloorCell(x, y);
            case CellTypes.WOODEN_FLOOR:
                return CellModelFactory.getWoodenFloor(x, y);
            case CellTypes.GRASS:
                return CellModelFactory.getGrassFloor(x, y);
            case CellTypes.GRAY_WALL:
                return CellModelFactory.getGrayWallModel(x, y);
            case CellTypes.HIGH_PEAKS:
                return CellModelFactory.getHighPeaksWallModel(x, y);
            case CellTypes.MOUNTAIN:
                return CellModelFactory.getMountainWallModel(x, y);
            case CellTypes.HILLS:
                return CellModelFactory.getHillsFloorModel(x, y);
            case CellTypes.LEFT_HILLS:
                return CellModelFactory.getLefttHillsFloorModel(x, y);
            case CellTypes.RIGHT_HILLS:
                return CellModelFactory.getRightHillsFloorModel(x, y);
            case CellTypes.WOODEN_SOLID_DOORS:
                return CellModelFactory.getWoodenSolidDoors(x, y);
            case CellTypes.LAVA:
                return CellModelFactory.getLavaFloorModel(x, y);
            case CellTypes.FOUNTAIN:
                return CellModelFactory.getFountainModel(x, y);
            case CellTypes.SHALLOW_WATER:
                return CellModelFactory.getShallowWater(x, y);
            case CellTypes.DEEP_WATER:
                return CellModelFactory.getDeepWater(x, y);
            case CellTypes.BUSH:
                return CellModelFactory.getBush(x, y);
            case CellTypes.TREE:
                return CellModelFactory.getTree(x, y);
            case CellTypes.STAIRS_DOWN:
                return CellModelFactory.getStairsDown(x, y);
            case CellTypes.STAIRS_UP:
                return CellModelFactory.getStairsUp(x, y);
            case CellTypes.BED_HEAD:
                return CellModelFactory.getBedHead(x, y);
            case CellTypes.BED_FOOT:
                return CellModelFactory.getBedFoot(x, y);
            case CellTypes.BARREL:
                return CellModelFactory.getBarrelModel(x, y);
            case CellTypes.CHEST_OF_DRAWERS:
                return CellModelFactory.getChestOfDrawersModel(x, y);
            default:
                throw new Error('Unknown cell type in cell model factory.');
        }
    },
    getRedFloorCell(x: number, y: number): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                type: CellTypes.RED_FLOOR,
                description: cellsDescriptions[CellTypes.RED_FLOOR],
                display: [TerrainSprites.RED_FLOOR],
            },
        );
    },
    getWoodenFloor(x: number, y: number): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                type: CellTypes.WOODEN_FLOOR,
                description: cellsDescriptions[CellTypes.WOODEN_FLOOR],
                display: [TerrainSprites.WOODEN_FLOOR_1, TerrainSprites.WOODEN_FLOOR_2],
            },
        );
    },
    getGrassFloor(x: number, y: number): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                type: CellTypes.GRASS,
                description: cellsDescriptions[CellTypes.GRASS],
                display: [TerrainSprites.GRASS_2],
            },
        );
    },
    getGrayWallModel(x: number, y: number): WallModel {
        return new WallModel(
            x,
            y,
            {
                type: CellTypes.GRAY_WALL,
                description: cellsDescriptions[CellTypes.GRAY_WALL],
                display: [TerrainSprites.GRAY_WALL],
            },
        );
    },
    getHighPeaksWallModel(x: number, y: number): WallModel {
        return new WallModel(
            x,
            y,
            {
                type: CellTypes.HIGH_PEAKS,
                description: cellsDescriptions[CellTypes.HIGH_PEAKS],
                display: [TerrainSprites.HIGH_PEAKS],
            },
        );
    },
    getMountainWallModel(x: number, y: number): WallModel {
        return new WallModel(
            x,
            y,
            {
                type: CellTypes.MOUNTAIN,
                description: cellsDescriptions[CellTypes.MOUNTAIN],
                display: [TerrainSprites.MOUNTAIN],
            },
        );
    },
    getHillsFloorModel(x: number, y: number): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                type: CellTypes.HILLS,
                description: cellsDescriptions[CellTypes.HILLS],
                display: [TerrainSprites.HILLS],
            },
        );
    },
    getRightHillsFloorModel(x: number, y: number): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                type: CellTypes.RIGHT_HILLS,
                description: cellsDescriptions[CellTypes.HILLS],
                display: [TerrainSprites.RIGHT_HILLS],
            },
        );
    },
    getLefttHillsFloorModel(x: number, y: number): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                type: CellTypes.LEFT_HILLS,
                description: cellsDescriptions[CellTypes.HILLS],
                display: [TerrainSprites.LEFT_HILLS],
            },
        );
    },
    getWoodenSolidDoors(x: number, y: number): WoodenSolidDoorModel {
        return new WoodenSolidDoorModel(x, y);
    },
    getLavaFloorModel(x: number, y: number): LavaCellModel {
        return new LavaCellModel(x, y);
    },
    getFountainModel(x: number, y: number): FountainModel {
        return new FountainModel(x, y);
    },
    getShallowWater(x: number, y: number): ShallowWater {
        return new ShallowWater(x, y);
    },
    getDeepWater(x: number, y: number): DeepWater {
        return new DeepWater(x, y);
    },
    getBush(x: number, y: number): BushModel {
        return new BushModel(x, y);
    },
    getTree(x: number, y: number): TreeModel {
        return new TreeModel(x, y);
    },
    getStairsUp(x: number, y: number): StairsModel {
        return new StairsModel(x, y, {direction: StairDirections.UP});
    },
    getStairsDown(x: number, y: number): StairsModel {
        return new StairsModel(x, y, {direction: StairDirections.DOWN});
    },
    getBedHead(x: number, y: number): BedHead {
        return new BedHead(x, y);
    },
    getBedFoot(x: number, y: number): BedFoot {
        return new BedFoot(x, y);
    },
    getBarrelModel(x: number, y: number): BarrelModel {
        return new BarrelModel(x, y);
    },
    getChestOfDrawersModel(x: number, y: number): ChestOfDrawersModel {
        return new ChestOfDrawersModel(x, y);
    },
};
