/**
 * Created by Lukasz Lach on 2017-04-24.
 */

import GameScreen from './view/game_view.js';
import InfoScreen from './view/info_view.js';
import MapScreen from './view/map_view.js';
import MessagesScreen from './view/messages_view.js';
import Dungeon from './game/dungeon/dungeon.js';
import Controller from './controller/game_controller.js';
import ArenaGenerator from './game/dungeon/generators/arena.js';
import config from './global/config';
import Utility from './game/utility.js';
import {MainController} from './controller/main_controller';

(function(){

    const tileSet = document.createElement('img');
    tileSet.setAttribute('src', 'assets/u5tiles.png');

    tileSet.addEventListener('load', function(){
        // z.levels[1].cells[10][10].changeCellType('wizard');
        // z.levels[1].cells[32][12].changeCellType('gray_wall');
        //gen.createCircleRoom(z.levels[1], 5, 5, 4, 'wooden_floor', 'gray_wall', true);
        // Utility.bresenhamLine(13,13,2,2, function(x, y){
        //
        //     z.levels[1].cells[x][y].changeCellType('wooden_floor');
        // });
        //console.log(gen.createRectangleRoom(z.levels[1], 2, 2, 5, 5, 'wooden_floor', 'gray_wall', true));
        //console.log(gen.createIrregularRoom(z.levels[1],4, 4, 7, 6, 3, 'wooden_floor', 'gray_wall', true));
        //console.log(gen.createIrregularRoom(z.levels[1],4, 4, 7, 9, 2, 'wooden_floor', 'gray_wall', true));
        //console.log(gen.createCircleRoom(z.levels[1], 18, 6, 4, 'wooden_floor', 'gray_wall', true));
        //console.log(gen.createRectangleRoom(z.levels[1], 12, 12, 5, 5, 'wooden_floor', 'gray_wall', true));

        //console.log(gen.connectRooms(z.levels[1], z.levels[1].rooms[0], z.levels[1].rooms[1], 'wooden_floor', 'gray_wall'));

        new MainController(tileSet);
    });
})();