import { EventBus } from '../eventBus';
import { GameEventBusDataTypes } from './gameEventBus.interfaces';

class GameEventBus extends EventBus<GameEventBusDataTypes> {}

export const gameEventBus = new GameEventBus();
