import {Generator} from './generator.js';
import {config} from '../../../global/config';

/**
 * Class representing arena level type.
 * @extends {Generator}
 */
export class ArenaGenerator extends Generator{

    constructor(){
        super();
    }

    /**
     *
     * @param {LevelModel} level - {@code LevelModel} object
     */
    generate(level){

        for(let i=0; i<level.cells.length; i++){

            for(let j=0; j<level.cells[i].length; j++){

                if(i !== 0 && j !== 0 && i !== config.LEVEL_WIDTH - 1 && j !== config.LEVEL_HEIGHT - 1){

                    level.cells[i][j].changeCellType('grass');
                }

                if(i === 12 && (j === 10 || j ===11)){
                    level.cells[i][j].changeCellType('lava');
                }
            }
        }
    }
}