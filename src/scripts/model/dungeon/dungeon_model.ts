/**
 * Created by Docent Furman on 16.07.2017.
 */
import {BaseModel} from '../../core/base_model';
import {DungeonEvents} from '../../constants/dungeon_events';
import {IActionAttempt} from '../../interfaces/common';
import {ASCEND, DESCEND} from '../../constants/directions';
import {DungeonTypes} from '../../constants/dungeon_types';
import {globalDungeonsCollection} from '../../global/collections';

export class DungeonModel extends BaseModel {
    private currentLevelNumber: number = null;
    private parentDungeonBranch: DungeonModel = null;
    public readonly type: DungeonTypes;
    public readonly maxLevelNumber: number;
    /**
     * @param   type             DungeonModel type (main dungeon or some branches)
     * @param   maxLevelNumber   How many levels this dungeon or branch contains
     * @param   levelNumber      Current level number (default to 1)
     */
    constructor(type: DungeonTypes, maxLevelNumber: number, levelNumber?: number) {
        super();

        this.currentLevelNumber = levelNumber || 1;
        this.type = type; // type of dungeon (main dungeon or some branch)
        this.maxLevelNumber = maxLevelNumber; // number determining number of dungeon levels (how deep it is)

        globalDungeonsCollection.add(this);
    }
    /**
     * Sets currentLevelNumber property in model. Action is notified with event CHANGE_CURRENT_LEVEL from dungeon events
     * enum.
     *
     * @param num   New level number
     */
    public setCurrentLevelNumber(num: number): void {
        const oldLevelNumber: number = this.currentLevelNumber;
        let direction: string;

        if (num <= this.maxLevelNumber) {
            direction = Math.sign(oldLevelNumber - num) > 0 ? ASCEND : DESCEND;

            this.currentLevelNumber = num;
            this.notify(DungeonEvents.CHANGE_CURRENT_LEVEL, {
                levelNumber: num,
                direction,
            });
        }
    }
    /**
     * Returns number of level in dungeon where player currently is.
     *
     * @returns     Number of current dungeon level
     */
    public getCurrentLevelNumber(): number {
        return this.currentLevelNumber;
    }
    /**
     * Verifies whether player can go to level of given number in dungeon.
     *
     * @param num   Level number
     */
    public canChangeLevel(num: number): IActionAttempt {
        let result: boolean;
        let message: string;

        if (num < 1 && !this.parentDungeonBranch) {
            result = false;
            message = 'Passage is blocked, you can\'t go up here.';
        } else if (num >= 1) {
            result = true;
        }

        return {
            result,
            message,
        };
    }
}
