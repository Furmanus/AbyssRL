import {AbstractLevelGenerator} from './abstract_generator';
import {LevelModel} from '../../model/dungeon/level_model';
import Arena from 'rot-js/lib/map/arena';
import * as ROT from 'rot-js';
import {config as globalConfig} from '../../global/config';
import {CellTypes} from '../../constants/cell_types';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {monsterFactory} from '../../factory/monster_factory';

export class TestLevelGenerator extends AbstractLevelGenerator {
    public generateLevel(level: LevelModel): void {
        const generator: Arena = new ROT.Map.Arena(globalConfig.LEVEL_WIDTH, globalConfig.LEVEL_HEIGHT);

        level.initialize();
        generator.create(generatorCallback);

        for (let i = 1; i < 15; i++) {
            for (let j = 1; j < 15; j++) {
                level.changeCellType(i, j, CellTypes.RED_FLOOR);
            }
        }

        this.generateRandomStairsUp(level);

        this.generateTestLevelMonsters(level);

        function generatorCallback(x: number, y: number, value: number): void {
            if (value === 1) {
                level.changeCellType(x, y, CellTypes.HIGH_PEAKS);
            } else {
                level.changeCellType(x, y, CellTypes.HIGH_PEAKS);
            }
        }
    }
    public generateTestLevelMonsters(levelModel: LevelModel): void {
        const cell1: Cell = levelModel.getRandomUnoccupiedCell();
        const cell2: Cell = levelModel.getRandomUnoccupiedCell();

        levelModel.spawnMonster(monsterFactory.getOrcController(levelModel, cell1), cell1);
        levelModel.spawnMonster(monsterFactory.getGiantRatController(levelModel, cell2), cell2);
    }
}
