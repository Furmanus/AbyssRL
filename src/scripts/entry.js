/**
 * Created by Lukasz Lach on 2017-04-24.
 */

import {MainController} from './controller/main_controller';

(function(){
    const tileSet = document.createElement('img');
    tileSet.setAttribute('src', 'assets/u5tiles.png');

    tileSet.addEventListener('load', function(){
        new MainController(tileSet);
    });
})();