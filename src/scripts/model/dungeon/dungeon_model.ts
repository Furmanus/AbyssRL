/**
 * Created by Docent Furman on 16.07.2017.
 */
import {BaseModel} from '../../core/base_model';

export class DungeonModel extends BaseModel {
    /**
     * @param   type             DungeonModel type (main dungeon or some branches).
     * @param   maxLevelNumber   How many levels this dungeon or branch contains.
     */
    constructor(type: string, maxLevelNumber: number) {
        super();

        this.type = type; // string determining type of dungeon
        this.maxLevelNumber = maxLevelNumber; // number determining number of dungeon levels (how deep it is)
    }
}
