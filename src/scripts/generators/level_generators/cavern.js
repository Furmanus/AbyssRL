import {config as globalConfig} from '../../global/config';
import {AbstractLevelGenerator} from './abstract_generator';
import {cellTypes} from '../../constants/cell_types';
import * as ROT from 'rot-js';

const singletonToken = Symbol('Cavern level generator singleton token');
let instance;

export class CavernLevelGenerator extends AbstractLevelGenerator {
    /**
     * @constructor
     * @typedef {CavernLevelGenerator}
     * @param {Symbol}  token   Unique symbol used to generate only instance of class.
     */
    constructor (token) {
        super();

        if(token !== singletonToken){
            throw new Error(`Can't create instance of singleton class with new keyword. Use getInstance() static method instead`);
        }
    }
    /**
     * Method responsible for generating cavern level.
     *
     * @param {LevelModel}  level           Level model which cells will be transformed.
     * @param {Object}      config          Object with configuration parameters.
     * @param {function}    debugCallback   Optional: callback for rot.js generator for debugging purpose.
     */
    generateLevel (level, config = {}, debugCallback) {
        const solidCellProbability = config.solidCellProbability || 0.5;
        const born = config.born || [5, 6, 7, 8];
        const survive = config.survive || [4, 5, 6, 7, 8];
        const connected = config.connected || true;

        const generator = new ROT.Map.Cellular(
            globalConfig.LEVEL_WIDTH - 2,
            globalConfig.LEVEL_HEIGHT - 2,
            {
                born,
                survive,
                connected
            }
        );

        level.initialize();

        generator.randomize(solidCellProbability);
        for(let i=0; i<4; i++) {
            generator.create();
        }
        generator.create(debugCallback || generatorCallback);

        function generatorCallback(x, y, value){
            if (value === 1) {
                level.changeCellType(x + 1, y + 1, cellTypes.MOUNTAIN);
            } else {
                level.changeCellType(x + 1, y + 1, cellTypes.GRASS);
            }
            if(x === 1 && y === 1){
                level.changeCellType(1, 1, cellTypes.WOODEN_SOLID_DOORS);
            }
        }

        generator.connect(function(x, y, value){
            if(value === 0){
                level.changeCellType(x + 1, y + 1, cellTypes.GRASS);
            }
        });
        this.smoothLevel(level, {
            cellsToSmooth: [cellTypes.HIGH_PEAKS, cellTypes.MOUNTAIN],
            cellsToChange: [cellTypes.GRASS],
            cellsAfterChange: [cellTypes.HILLS]
        });
        this.smoothLevelHills(level);
        this.generateRandomStairsUp(level);
        this.generateRandomStairsDown(level);
    }
    /**
     * Returns only created instance of cavern level generator.
     * @returns {CavernLevelGenerator}
     */
    static getInstance () {
        if(!instance) {
            instance = new CavernLevelGenerator(singletonToken);
        }

        return instance;
    }
}