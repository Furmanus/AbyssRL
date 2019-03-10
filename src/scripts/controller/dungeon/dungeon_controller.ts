import {DungeonModel} from '../../model/dungeon/dungeon_model';
import {LevelController} from './level_controller';
import {MAIN_DUNGEON} from '../../constants/dungeon_types';
import {getDungeonStrategyInstance} from '../../factory/strategy_factory';
import {MainDungeonLevelGenerationStrategy} from '../../strategy/dungeon_generator/main_dungeon_strategy';
import {Controller} from '../controller';

export interface ILevelControllersMap {
    [prop: string]: LevelController;
}

/**
 * Controller of single dungeon.
 */
export class DungeonController extends Controller {
    /**
     * Type of dungeon.
     */
    private type: string;
    /**
     * Model of dungeon.
     */
    private model: DungeonModel;
    /**
     * Object with level controllers. Key is equal to level number.
     */
    private readonly levels: ILevelControllersMap;
    private readonly strategy: MainDungeonLevelGenerationStrategy;

    constructor(type: string = MAIN_DUNGEON, maxLevelNumber: number = 8) {
        super();

        this.type = type;
        this.model = new DungeonModel(type, maxLevelNumber);
        this.levels = {};
        this.strategy = getDungeonStrategyInstance(this.type);

        this.initialize();
    }
    /**
     * Initialization of dungeon controller instance.
     */
    protected initialize(): void {
        this.generateNewLevel();
    }
    private generateNewLevel(): void {
        const maxLevelNumber: number = this.model.maxLevelNumber;

        for (let counter = 1; counter <= maxLevelNumber; counter++) {
            if (!this.levels[counter]) {
                this.levels[counter] = new LevelController({
                    branch: this.type,
                    levelNumber: counter,
                });
                this.strategy.generateRandomLevel(this.levels[counter].getModel());
            }
        }
    }
    /**
     * Returns certain level object from dungeon.
     *
     * @param   levelNumber     Number of level in dungeon
     * @returns                 Returns level controller of given level number
     */
    public getLevel(levelNumber: number): LevelController {
        try {
            return this.levels[levelNumber];
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error('Can\'t find dungeon level');
            // tslint:disable-next-line:no-console
            console.error(e.stack);
        }
    }
    /**
     * Returns model of dungeon.
     */
    public getDungeonModel(): DungeonModel {
        return this.model;
    }
}
