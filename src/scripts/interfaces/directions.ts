import { keyboardKeyToDirectionMap } from '../main/constants/keyboardDirections.constants';

export type Directions =
  | '-1x-1'
  | '1x-1'
  | '0x-1'
  | '-1x0'
  | '1x0'
  | '-1x1'
  | '1x1'
  | '0x1';

export type KeyboardWhichDirections =
  | 103
  | 104
  | 105
  | 102
  | 99
  | 98
  | 97
  | 100
  | 101
  | 36
  | 38
  | 33
  | 39
  | 34
  | 40
  | 35
  | 37
  | 190;

export function isKeyboardKeyDirection(
  x: number,
): x is KeyboardWhichDirections {
  return x in keyboardKeyToDirectionMap;
}
