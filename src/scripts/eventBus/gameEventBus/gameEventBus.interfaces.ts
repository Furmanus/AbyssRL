import { Monsters } from '../../entity/constants/monsters';
import { GameEventBusEventNames } from './gameEventBus.constants';

export type GameEventBusDataTypes = {
    [GameEventBusEventNames.ModalOpen]: [],
    [GameEventBusEventNames.ModalClose]: [],
    [GameEventBusEventNames.RecreateCurrentLevel]: [],
    [GameEventBusEventNames.SpawnMonster]: [Monsters];
    [GameEventBusEventNames.PlayerMovementConfirmNeeded]: [string, () => void, () => void];
}
