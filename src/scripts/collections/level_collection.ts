import {LevelModel} from '../model/dungeon/level_model';
import {Collection} from './collection';
import {DungeonTypes} from '../constants/dungeon_types';

export class LevelCollection extends Collection<LevelModel> {
    public getByBranchAndNumber(branch: DungeonTypes, num: number): LevelModel {
        return this.get().find((model: LevelModel) => model.branch === branch && model.levelNumber === num);
    }
}
