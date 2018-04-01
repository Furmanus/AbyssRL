import {DungeonModel} from '../../model/dungeon/dungeon_model';
import {Observer} from '../../core/observer';
import {LevelController} from './level_controller';

export class DungeonController extends Observer{

    constructor(type = 'main', maxLevelNumber = 8){
        super();
        /**
         * Model of dungeon.
         * @type {DungeonModel}
         */
        this.model = new DungeonModel(type, maxLevelNumber);
        /**
         * Object with level controllers. Key is equal to level number.
         * @type {Object}
         */
        this.levels = {};

        this.initialize();
    }
    initialize(){
        const thisDungeonController = this;

        this.levels[1] = new LevelController({
            branch: thisDungeonController,
            levelNumber: 1
        });
    }
    /**
     * Returns certain level object from dungeon.
     * @param {number}  levelNumber
     * @returns {LevelController}
     */
    getLevel(levelNumber){
        try {
            return this.levels[levelNumber];
        }catch (e) {
            console.error('Can\'t find dungeon level');
            console.error(e.stack);
        }
    }
}