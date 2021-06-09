/**
 * Created by Lukasz Lach on 2017-04-24.
 */

import { MainController } from './controller/main_controller';
// @ts-ignore
import * as u5tiles from './assets/u5tiles.png';
import '../styles/app.less';
import { tilesetObject } from './global/tileset';
// tslint:disable
declare global {
  // tslint:disable-next-line:interface-name
  interface Set<T> {
    random<T>(elem: T): T;
  }
}

Array.prototype.random = function <M>(): M {
  const arr: M[] = Array.from(this);
  const { length } = arr;

  return arr[Math.floor(Math.random() * length)];
};
Set.prototype.random = function <M>(): M {
  const valArray: M[] = Array.from(this);

  return valArray.random();
};
// tslint: enable
(() => {
  const tileSet = document.createElement('img');
  tileSet.setAttribute('src', u5tiles);

  tileSet.addEventListener('load', () => {
    tilesetObject.tileset = tileSet;
    // tslint:disable-next-line:no-unused-expression
    new MainController(tileSet);
  });
})();
