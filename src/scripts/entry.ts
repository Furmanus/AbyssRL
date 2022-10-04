/* eslint-disable no-extend-native */
import './state/application.state';
import { MainController } from './main/main.controller';
import u5tiles from '../assets/u5tiles.png';
import './styles/app.less';
import { tilesetObject } from './global/tileset';
import type { SerializedDungeonState } from './state/applicationState.interfaces';
import { rngService } from './utils/rng.service';
import { applicationConfigService } from './global/config';

Array.prototype.random = function <M>(): M {
  const arr: M[] = Array.from(this);
  const { length } = arr;

  return arr[rngService.getRandomNumber(0, length - 1)];
};
Set.prototype.random = function <M>(): M {
  const valArray: M[] = Array.from(this);

  return valArray.random();
};

if (applicationConfigService.rngSeedValue) {
  rngService.setSeed(applicationConfigService.rngSeedValue);
}

(async () => {
  const serializedGame = await fetch('/save').then((res) => res.text());
  let parsedGame: SerializedDungeonState;

  if (serializedGame) {
    try {
      parsedGame = JSON.parse(serializedGame);
    } catch {
      console.error('failed to decode json data');
    }
  }

  const tileSet = document.createElement('img');
  tileSet.setAttribute('src', u5tiles);

  tileSet.addEventListener('load', () => {
    tilesetObject.tileset = tileSet;
    // eslint-disable-next-line no-new
    new MainController(tileSet, parsedGame);
  });
})();
