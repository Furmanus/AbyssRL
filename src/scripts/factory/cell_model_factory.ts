import {cellTypes} from '../constants/cell_types';
import {FloorModel} from '../model/dungeon/cells/floor_model';
import {cellsDescriptions} from '../helper/cells_description';
import {terrain} from '../constants/sprites';
import {WallModel} from '../model/dungeon/cells/wall_model';
import {WoodenSolidDoorModel} from '../model/dungeon/cells/doors/wooden_solid_door';
import {LavaCellModel} from '../model/dungeon/cells/lava_model';
import {FountainModel} from '../model/dungeon/cells/fountain_model';
import {ShallowWater} from '../model/dungeon/cells/shallow_water';
import {DeepWater} from '../model/dungeon/cells/deep_water';
import {BushModel} from '../model/dungeon/cells/floors/bush_model';
import {TreeModel} from '../model/dungeon/cells/tree_model';
import {StairsModel} from '../model/dungeon/cells/floors/stairs';
import {DOWN, UP} from '../constants/stairs_directions';
import {Cell} from '../model/dungeon/cells/cell_model';

export const CellModelFactory = {
    getCellModel(x: number, y: number, type: string): Cell {
        switch (type) {
            case cellTypes.RED_FLOOR:
                return CellModelFactory.getRedFloorCell(x, y);
            case cellTypes.WOODEN_FLOOR:
                return CellModelFactory.getWoodenFloor(x, y);
            case cellTypes.GRASS:
                return CellModelFactory.getGrassFloor(x, y);
            case cellTypes.GRAY_WALL:
                return CellModelFactory.getGrayWallModel(x, y);
            case cellTypes.HIGH_PEAKS:
                return CellModelFactory.getHighPeaksWallModel(x, y);
            case cellTypes.MOUNTAIN:
                return CellModelFactory.getMountainWallModel(x, y);
            case cellTypes.HILLS:
                return CellModelFactory.getHillsFloorModel(x, y);
            case cellTypes.LEFT_HILLS:
                return CellModelFactory.getLefttHillsFloorModel(x, y);
            case cellTypes.RIGHT_HILLS:
                return CellModelFactory.getRightHillsFloorModel(x, y);
            case cellTypes.WOODEN_SOLID_DOORS:
                return CellModelFactory.getWoodenSolidDoors(x, y);
            case cellTypes.LAVA:
                return CellModelFactory.getLavaFloorModel(x, y);
            case cellTypes.FOUNTAIN:
                return CellModelFactory.getFountainModel(x, y);
            case cellTypes.SHALLOW_WATER:
                return CellModelFactory.getShallowWater(x, y);
            case cellTypes.DEEP_WATER:
                return CellModelFactory.getDeepWater(x, y);
            case cellTypes.BUSH:
                return CellModelFactory.getBush(x, y);
            case cellTypes.TREE:
                return CellModelFactory.getTree(x, y);
            case cellTypes.STAIRS_DOWN:
                return CellModelFactory.getStairsDown(x, y);
            case cellTypes.STAIRS_UP:
                return CellModelFactory.getStairsUp(x, y);
            default:
                throw new Error('Unknown cell type in cell model factory.');
        }
    },
    getRedFloorCell(x: number, y: number): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                type: cellTypes.RED_FLOOR,
                description: cellsDescriptions[cellTypes.RED_FLOOR],
                display: [terrain.RED_FLOOR],
            },
        );
    },
    getWoodenFloor(x: number, y: number): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                type: cellTypes.WOODEN_FLOOR,
                description: cellsDescriptions[cellTypes.WOODEN_FLOOR],
                display: [terrain.WOODEN_FLOOR_1, terrain.WOODEN_FLOOR_2],
            },
        );
    },
    getGrassFloor(x: number, y: number): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                type: cellTypes.GRASS,
                description: cellsDescriptions[cellTypes.GRASS],
                display: [terrain.GRASS_2],
            },
        );
    },
    getGrayWallModel(x: number, y: number): WallModel {
        return new WallModel(
            x,
            y,
            {
                type: cellTypes.GRAY_WALL,
                description: cellsDescriptions[cellTypes.GRAY_WALL],
                display: [terrain.GRAY_WALL],
            },
        );
    },
    getHighPeaksWallModel(x: number, y: number): WallModel {
        return new WallModel(
            x,
            y,
            {
                type: cellTypes.HIGH_PEAKS,
                description: cellsDescriptions[cellTypes.HIGH_PEAKS],
                display: [terrain.HIGH_PEAKS],
            },
        );
    },
    getMountainWallModel(x: number, y: number): WallModel {
        return new WallModel(
            x,
            y,
            {
                type: cellTypes.MOUNTAIN,
                description: cellsDescriptions[cellTypes.MOUNTAIN],
                display: [terrain.MOUNTAIN],
            },
        );
    },
    getHillsFloorModel(x: number, y: number): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                type: cellTypes.HILLS,
                description: cellsDescriptions[cellTypes.HILLS],
                display: [terrain.HILLS],
            },
        );
    },
    getRightHillsFloorModel(x: number, y: number): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                type: cellTypes.RIGHT_HILLS,
                description: cellsDescriptions[cellTypes.HILLS],
                display: [terrain.RIGHT_HILLS],
            },
        );
    },
    getLefttHillsFloorModel(x: number, y: number): FloorModel {
        return new FloorModel(
            x,
            y,
            {
                type: cellTypes.LEFT_HILLS,
                description: cellsDescriptions[cellTypes.HILLS],
                display: [terrain.LEFT_HILLS],
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
        return new StairsModel(x, y, {direction: UP});
    },
    getStairsDown(x: number, y: number): StairsModel {
        return new StairsModel(x, y, {direction: DOWN});
    },
};
