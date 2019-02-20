/**
 * Created by Lukasz Lach on 2017-04-24.
 */

import {MainController} from './controller/main_controller';
import '../styles/app.less';

Array.prototype.random = function() {
    const arr = Array.from(this);
    const length = arr.length;

    return arr[Math.floor(Math.random() * length)];
};
Set.prototype.random = function() {
    const valArray = Array.from(this);

    return valArray.random();
};

(function(){
    const tileSet = document.createElement('img');
    tileSet.setAttribute('src', 'assets/u5tiles.png');

    tileSet.addEventListener('load', function(){
        new MainController(tileSet);
    });
})();