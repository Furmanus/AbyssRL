import {ArenaLevelGenerator} from '../../generators/level_generators/arena';
import {CavernLevelGenerator} from '../../generators/level_generators/cavern';
import {DungeonLevelGenerator} from '../../generators/level_generators/dungeon';
import * as Rng from '../../helper/rng';
import {config} from '../../global/config';

const arenaLevelGenerator = ArenaLevelGenerator.getInstance();
const cavernLevelGenerator = CavernLevelGenerator.getInstance();
const dungeonLevelGenerator = DungeonLevelGenerator.getInstance();

const typeToGenerator = {
    dungeon: dungeonLevelGenerator,
    arena: arenaLevelGenerator,
    cavern: cavernLevelGenerator
};

export class MainDungeonLevelGenerationStrategy {
    /**
     * @constructor
     * @typedef {MainDungeonLevelGenerationStrategy}
     */
    constructor () {

    }
    generateRandomLevel (levelModel) {
        const {levelNumber} = levelModel;

        if (config.defaultLevelType) {
            try {
                typeToGenerator[config.defaultLevelType].generateLevel(levelModel);
                return;
            } catch (e) {

            }
        }

        switch(levelNumber){
            default:
                let percentDieRoll = Rng.getPercentage();

                if(percentDieRoll < 33){
                    arenaLevelGenerator.generateLevel(levelModel);
                }else if(percentDieRoll < 66){
                    cavernLevelGenerator.generateLevel(levelModel);
                }else {
                    dungeonLevelGenerator.generateLevel(levelModel);
                }
        }
    }
}