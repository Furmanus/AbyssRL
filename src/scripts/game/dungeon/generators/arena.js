import game from './../../game.js';
import Generator from './generator.js';

/**
 * Class representing arena level type.
 * @extends {Generator}
 */
class ArenaGenerator extends Generator{

    constructor(){

        super();
    }

    /**
     *
     * @param {Level} level - {@code Level} object
     */
    generate(level){

        for(let i=0; i<level.cells.length; i++){

            for(let j=0; j<level.cells[i].length; j++){

                if(i !== 0 && j !== 0 && i !== game.options.LEVEL_WIDTH - 1 && j !== game.options.LEVEL_HEIGHT - 1){

                    level.cells[i][j].changeCellType('grass');
                }
            }
        }
    }
}

module.exports = ArenaGenerator;