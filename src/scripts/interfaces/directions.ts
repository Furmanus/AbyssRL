import { keyboardKeyToDirectionMap } from '../main/constants/keyboardDirections.constants';

type VectorDirection = '-1' | '0' | '1';

export type Directions = Exclude<`${VectorDirection}x${VectorDirection}`, '0x0'>;

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
