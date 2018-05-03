import {cellTypes} from '../constants/cell_types';
import {FloorModel} from '../model/dungeon/cells/floor_model';
import {cellsDescriptions} from '../helper/cells_description';
import {terrain} from '../constants/sprites';
import {WallModel} from '../model/dungeon/cells/wall_model';
import {WoodenSolidDoorModel} from '../model/dungeon/cells/doors/wooden_solid_door';
import {LavaCellModel} from '../model/dungeon/cells/lava_model';
import {FountainModel} from '../model/dungeon/cells/fountain_model';

export class CellModelFactory{
    static getCellModel(x, y, type){
        switch(type) {
            case cellTypes.RED_FLOOR:
                return CellModelFactory.getRedFloorCell(x, y);
            case cellTypes.WOODEN_FLOOR:
                return CellModelFactory.getWoodenFloor(x, y,);
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
            default:
                throw new Error('Unknown cell type in cell model factory.');
        }
    }
    static getRedFloorCell(x, y){
        return new FloorModel(
            x,
            y,
            {
                type: cellTypes.RED_FLOOR,
                description: cellsDescriptions[cellTypes.RED_FLOOR],
                display: [terrain.RED_FLOOR]
            }
        );
    }
    static getWoodenFloor(x, y){
        return new FloorModel(
            x,
            y,
            {
                type: cellTypes.WOODEN_FLOOR,
                description: cellsDescriptions[cellTypes.WOODEN_FLOOR],
                display: [terrain.WOODEN_FLOOR_1, terrain.WOODEN_FLOOR_2]
            }
        );
    }
    static getGrassFloor(x, y){
        return new FloorModel(
            x,
            y,
            {
                type: cellTypes.GRASS,
                description: cellsDescriptions[cellTypes.GRASS],
                display: [terrain.GRASS_2]
            }
        );
    }
    static getGrayWallModel(x, y){
        return new WallModel(
            x,
            y,
            {
                type: cellTypes.GRAY_WALL,
                description: cellsDescriptions[cellTypes.GRAY_WALL],
                display: [terrain.GRAY_WALL]
            }
        );
    }
    static getHighPeaksWallModel(x, y){
        return new WallModel(
            x,
            y,
            {
                type: cellTypes.HIGH_PEAKS,
                description: cellsDescriptions[cellTypes.HIGH_PEAKS],
                display: [terrain.HIGH_PEAKS]
            }
        );
    }
    static getMountainWallModel(x, y){
        return new WallModel(
            x,
            y,
            {
                type: cellTypes.MOUNTAIN,
                description: cellsDescriptions[cellTypes.MOUNTAIN],
                display: [terrain.MOUNTAIN]
            }
        );
    }
    static getHillsFloorModel(x, y){
        return new FloorModel(
            x,
            y,
            {
                type: cellTypes.HILLS,
                description: cellsDescriptions[cellTypes.HILLS],
                display: [terrain.HILLS]
            }
        );
    }
    static getRightHillsFloorModel(x, y){
        return new FloorModel(
            x,
            y,
            {
                type: cellTypes.RIGHT_HILLS,
                description: cellsDescriptions[cellTypes.HILLS],
                display: [terrain.RIGHT_HILLS]
            }
        )
    }
    static getLefttHillsFloorModel(x, y){
        return new FloorModel(
            x,
            y,
            {
                type: cellTypes.LEFT_HILLS,
                description: cellsDescriptions[cellTypes.HILLS],
                display: [terrain.LEFT_HILLS]
            }
        )
    }
    static getWoodenSolidDoors(x, y){
        return new WoodenSolidDoorModel(x, y);
    }
    static getLavaFloorModel(x, y){
        return new LavaCellModel(x, y);
    }
    static getFountainModel(x, y){
        return new FountainModel(x, y);
    }
}