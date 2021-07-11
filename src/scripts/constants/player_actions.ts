export const PLAYER_ACTION_MOVE_PLAYER = 'MOVE_PLAYER';
export const PLAYER_WALK_CONFIRM_NEEDED = 'PLAYER_WALK_CONFIRM_NEEDED';
export const PLAYER_ACTION_ACTIVATE_OBJECT = 'PLAYER_ACTION_ACTIVATE_OBJECT';
export const SHOW_MESSAGE_IN_VIEW = 'SHOW_MESSAGE_IN_VIEW';
export const START_PLAYER_TURN = 'START_PLAYER_TURN';
export const END_PLAYER_TURN = 'END_PLAYER_TURN';
export const PLAYER_ACTION_GO_UP = 'PLAYER_ACTION_GO_UP';
export const PLAYER_ACTION_GO_DOWN = 'PLAYER_ACTION_GO_DOWN';
export const PLAYER_DEATH = 'PLAYER_DEATH';
// TODO move above constants inside enum
export enum PlayerActions {
  PickUp = 'PickUp',
  EndPlayerTurn = 'EndPlayerTurn',
}
