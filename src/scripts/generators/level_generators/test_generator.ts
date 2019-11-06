import {AbstractLevelGenerator} from './abstract_generator';
import {LevelModel} from '../../model/dungeon/level_model';
import Arena from 'rot-js/lib/map/arena';
import * as ROT from 'rot-js';
import {config as globalConfig} from '../../global/config';
import {CellTypes} from '../../constants/cell_types';
import {Cell} from '../../model/dungeon/cells/cell_model';
import {monsterFactory, monsterGroupsFactory} from '../../factory/monster_factory';
import {EntityGroupModel} from '../../model/entity/entity_group_model';

export class TestLevelGenerator extends AbstractLevelGenerator {
    public generateLevel(level: LevelModel): void {
        const generator: Arena = new ROT.Map.Arena(globalConfig.LEVEL_WIDTH, globalConfig.LEVEL_HEIGHT);

        level.initialize();
        generator.create(generatorCallback);

        for (let i = 1; i < 25; i++) {
            for (let j = 1; j < 15; j++) {
                if (j !== 8) {
                    level.changeCellType(i, j, CellTypes.RED_FLOOR);
                } else {
                    if (i === 2 || i === 3 || i === 23 || i === 24) {
                        level.changeCellType(i, j, CellTypes.RED_FLOOR);
                    }
                }
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
        const controller1 = monsterFactory.getOrcController(levelModel, cell1);
        const controller2 = monsterFactory.getOrcController(levelModel, cell2);
        const group: EntityGroupModel = monsterGroupsFactory.getOrcPack(levelModel, cell1);

        levelModel.spawnEntityGroup(group);

        // levelModel.spawnMonster(controller1, cell1);
        // levelModel.spawnMonster(controller2, cell2);
    }
}
