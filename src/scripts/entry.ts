/* eslint-disable no-extend-native */
/**
 * Created by Lukasz Lach on 2017-04-24.
 */

import { MainController } from './controller/main_controller';
import u5tiles from './assets/u5tiles.png';
import '../styles/app.less';
import { tilesetObject } from './global/tileset';

Array.prototype.random = function <M>(): M {
  const arr: M[] = Array.from(this);
  const { length } = arr;

  return arr[Math.floor(Math.random() * length)];
};
Set.prototype.random = function <M>(): M {
  const valArray: M[] = Array.from(this);

  return valArray.random();
};

(() => {
  const tileSet = document.createElement('img');
  tileSet.setAttribute('src', u5tiles);

  tileSet.addEventListener('load', () => {
    tilesetObject.tileset = tileSet;
    // eslint-disable-next-line no-new
    new MainController(tileSet);
  });
})();
