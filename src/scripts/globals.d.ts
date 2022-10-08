import type { PlayerModel } from './entity/models/player.model';

declare global {
  interface Window {
    dungeonState: DungeonState;
    applicationPlayerModel: PlayerModel;
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
