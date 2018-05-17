import {DungeonModel} from '../../model/dungeon/dungeon_model';
import {Observer} from '../../core/observer';
import {LevelController} from './level_controller';
import {MAIN_DUNGEON} from '../../constants/dungeon_types';
import {getDungeonStrategyInstance} from "../../factory/strategy_factory";

export class DungeonController extends Observer{

    constructor(type = MAIN_DUNGEON, maxLevelNumber = 8){
        super();
        /**
         * Type of dungeon.
         * @type {string}
         */
        this.type = type;
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
        /**@type {Object}*/
        this.strategy = getDungeonStrategyInstance(this.type);

        this.initialize();
    }
    /**
     * Initialization of dungeon controller instance.
     */
    initialize(){
        this.generateNewLevel();
    }
    generateNewLevel(){
        const maxLevelNumber = this.getDungeonModel().maxLevelNumber;

        for(let counter = 1; counter <= maxLevelNumber; counter++){
            if(!this.levels[counter]){
                this.levels[counter] = new LevelController({
                    branch: this.type,
                    levelNumber: counter
                });
                this.strategy.generateRandomLevel(this.levels[counter].getModel());
            }
        }
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
    /**
     * Returns model of dungeon.
     * @returns {DungeonModel}
     */
    getDungeonModel(){
        return this.model;
    }
}