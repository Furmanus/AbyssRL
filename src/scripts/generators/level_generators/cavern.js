import {config as globalConfig} from '../../global/config';
import {AbstractLevelGenerator} from './abstract_generator';
import {cellTypes} from '../../constants/cell_types';

const singletonToken = Symbol('Cavern level generator singleton token');
let instance;

export class CavernLevelGenerator extends AbstractLevelGenerator{
    /**
     * @constructor
     * @typedef {CavernLevelGenerator}
     * @param {Symbol}  token   Unique symbol used to generate only instance of class.
     */
    constructor(token){
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
    generateLevel(level, config = {}, debugCallback){
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

        generator.randomize(solidCellProbability);
        for(let i=0; i<4; i++) {
            generator.create();
        }
        generator.create(debugCallback || generatorCallback);

        function generatorCallback(x, y, value){
            if (value === 1) {
                level.getCell(x + 1, y + 1).changeCellType(cellTypes.MOUNTAIN);
            } else {
                level.getCell(x + 1, y + 1).changeCellType(cellTypes.GRASS);
            }
        }

        generator.connect(function(x, y, value){
            if(value === 0){
                level.getCell(x + 1, y + 1).changeCellType(cellTypes.GRASS);
            }
        });
        this.smoothLevel(level.getCells(), {
            cellsToSmooth: [cellTypes.HIGH_PEAKS, cellTypes.MOUNTAIN],
            cellsToChange: [cellTypes.GRASS],
            cellsAfterChange: [cellTypes.HILLS]
        });
        this.smoothLevelHills(level.getCells());
    }
    /**
     * Returns only created instance of cavern level generator.
     * @returns {CavernLevelGenerator}
     */
    static getInstance(){
        if(!instance) {
            instance = new CavernLevelGenerator(singletonToken);
        }

        return instance;
    }
}