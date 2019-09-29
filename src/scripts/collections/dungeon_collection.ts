import {Collection} from './collection';
import {DungeonModel} from '../model/dungeon/dungeon_model';
import {DungeonTypes} from '../constants/dungeon_types';

export class DungeonCollection extends Collection<DungeonModel> {
    public add(model: DungeonModel): this {
        if (this.getByType(model.type)) {
            throw new Error('Dungeons collection can\'t have two instances of same type');
        }
        super.add(model);
        return this;
    }
    /**
     * Returns dungeon model of specified type from collection.
     *
     * @param type    Type of dungeon
     */
    public getByType(type: DungeonTypes): DungeonModel {
        return this.get().find((dungeonModel: DungeonModel) => dungeonModel.type === type);
    }
}
