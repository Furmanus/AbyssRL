import {AbstractLevelGenerator} from './abstract_generator';
import {config as globalConfig} from '../../global/config';
import {cellTypes} from '../../constants/cell_types';

const singletonToken = Symbol('ArenaLevelGenerator singleton token');
let instance;

export class ArenaLevelGenerator extends AbstractLevelGenerator{
    /**
     * @constructor
     * @typedef {ArenaLevelGenerator}
     * @param {Symbol}  token   Unique symbol token used to create only instance.
     */
    constructor(token){
        super();

        if(token !== singletonToken){
            throw new Error(`Can't create instance of singleton class with new keyword. Use getInstance() static method instead`);
        }
    }
    /**
     * Generates arena big room from given level cells.
     * @param {LevelModel}       level              Level cells in array.
     * @param {Object}           config             Additional level config info.
     * @param {function}         debugCallback      Optional callback function serving as debug for map generation
     */
    generateLevel(level, config = {}, debugCallback){
        const generator = new ROT.Map.Arena(globalConfig.LEVEL_WIDTH, globalConfig.LEVEL_HEIGHT);

        generator.create(debugCallback || generatorCallback);

        function generatorCallback(x, y, value){
            if(value === 1){
                level.getCell(x, y).changeCellType(cellTypes.HIGH_PEAKS);
            }else{
                level.getCell(x, y).changeCellType(cellTypes.GRASS);
            }
        }
    }
    /**
     * Returns only created instance of arena level generator.
     * @returns {ArenaLevelGenerator}
     */
    static getInstance(){
        if(!instance) {
            instance = new ArenaLevelGenerator(singletonToken);
        }

        return instance;
    }
}