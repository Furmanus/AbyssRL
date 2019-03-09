import {ArenaLevelGenerator} from '../../generators/level_generators/arena';
import {CavernLevelGenerator} from '../../generators/level_generators/cavern';
import {DungeonLevelGenerator} from '../../generators/level_generators/dungeon';
import * as Rng from '../../helper/rng';
import {config} from '../../global/config';
import {LevelModel} from '../../model/dungeon/level_model';

type AllGeneratorsTypes = ArenaLevelGenerator | CavernLevelGenerator | DungeonLevelGenerator;

interface ITypeToGenerator {
    [prop: string]: AllGeneratorsTypes;
}

const arenaLevelGenerator: ArenaLevelGenerator = ArenaLevelGenerator.getInstance();
const cavernLevelGenerator: CavernLevelGenerator = CavernLevelGenerator.getInstance();
const dungeonLevelGenerator: DungeonLevelGenerator = DungeonLevelGenerator.getInstance();

const typeToGenerator: ITypeToGenerator = {
    dungeon: dungeonLevelGenerator,
    arena: arenaLevelGenerator,
    cavern: cavernLevelGenerator,
};

export class MainDungeonLevelGenerationStrategy {
    public generateRandomLevel(levelModel: LevelModel): void {
        const {
            levelNumber,
        } = levelModel;
        const defaultLevelTypeGenerator = config.defaultLevelType && typeToGenerator[config.defaultLevelType];

        if (config.defaultLevelType && defaultLevelTypeGenerator) {
            defaultLevelTypeGenerator.generateLevel(levelModel);
        }

        switch (levelNumber) {
            default:
                const percentDieRoll: number = Rng.getPercentage();

                if (percentDieRoll < 33) {
                    arenaLevelGenerator.generateLevel(levelModel);
                } else if (percentDieRoll < 66) {
                    cavernLevelGenerator.generateLevel(levelModel);
                } else {
                    dungeonLevelGenerator.generateLevel(levelModel);
                }
        }
    }
}
