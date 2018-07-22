import {config as globalConfig} from '../../global/config';
import {AbstractLevelGenerator} from './abstract_generator';
import {cellTypes} from '../../constants/cell_types';
import ROT from 'rot-js';

const singletonToken = Symbol('Dungeon level generator singleton token');
let instance;

export class DungeonLevelGenerator extends AbstractLevelGenerator {
    /**
     * @constructor
     * @typedef {DungeonLevelGenerator}
     * @param {Symbol}  token   Unique token used to generate only instance.
     */
    constructor (token) {
        super();

        if(token !== singletonToken){
            throw new Error(`Can't create instance of singleton class with new keyword. Use getInstance() static method instead`);
        }
    }
    /**
     * Generates random dungeon (rooms connected with corridors) from given level cells.
     *
     * @param {LevelModel}       level              Level model containing level cells.
     * @param {Object}           config             Additional level config info.
     * @param {function}         debugCallback      Optional callback function serving as debug for map generation
     */
    generateLevel (level, config = {}, debugCallback) {
        const roomDugPercentage = config.roomDugPercentage || 0.2;
        const roomWidth = config.roomWidth || [4, 15];
        const roomHeight = config.roomHeight || [4, 15];
        let rooms;
        let roomsArray = [];

        const generator = new ROT.Map.Uniform(
            globalConfig.LEVEL_WIDTH,
            globalConfig.LEVEL_HEIGHT,
            {
                roomDugPercentage,
                roomWidth,
                roomHeight
            }
            );

        generator.create(debugCallback || generatorCallback);

        rooms = generator.getRooms();
        rooms.forEach(item => {
            roomsArray.push({
                left: item.getLeft(),
                top: item.getTop(),
                right: item.getRight(),
                bottom: item.getBottom(),
                width: item.getRight() - item.getLeft(),
                height: item.getBottom() - item.getTop(),
                size: (item.getRight() - item.getLeft()) * (item.getBottom() - item.getTop())
            });
        });

        this.generateRandomStairsUp(level);
        this.generateRandomStairsDown(level);

        function generatorCallback(x, y, value){
            if (value === 1) {
                level.changeCellType(x, y, cellTypes.GRAY_WALL);
            } else {
                level.changeCellType(x, y, cellTypes.RED_FLOOR);
            }
        }
    }
    /**
     * Returns only created instance of cavern level generator.
     * @returns {DungeonLevelGenerator}
     */
    static getInstance () {
        if(!instance) {
            instance = new DungeonLevelGenerator(singletonToken);
        }

        return instance;
    }
}