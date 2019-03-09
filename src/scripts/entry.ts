/**
 * Created by Lukasz Lach on 2017-04-24.
 */

import {MainController} from './controller/main_controller';
import '../styles/app.less';
// tslint:disable
declare global {
    // tslint:disable-next-line:interface-name
    interface Set<T> {
        random<T>(elem: T): T;
    }
}

Array.prototype.random = function<M>(): M {
    const arr: M[] = Array.from(this);
    const length: number = arr.length;

    return arr[Math.floor(Math.random() * length)];
};
Set.prototype.random = function<M>(): M {
    const valArray: M[] = Array.from(this);

    return valArray.random();
};
// tslint: enable
(() => {
    const tileSet = document.createElement('img');
    tileSet.setAttribute('src', 'assets/u5tiles.png');

    tileSet.addEventListener('load', () => {
        // tslint:disable-next-line:no-unused-expression
        new MainController(tileSet);
    });
})();
