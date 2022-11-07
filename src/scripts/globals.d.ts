import type { PlayerModel } from './entity/models/player.model';
import type { ApplicationConfigService } from './global/config';
import type { RngService } from './utils/rng.service';

declare global {
  interface Window {
    _application: {
      dungeonState?: DungeonState;
      playerModel?: PlayerModel;
      configService?: ApplicationConfigService;
      rngService?: RngService;
    }
  }

  interface Set<T> {
    random(): T;
  }
  
  interface Array<T> {
    random(): T;
  }
  
  declare module '*.jpg';
  declare module '*.webp';
  declare module '*.png';
  declare module '*.svg';
}
