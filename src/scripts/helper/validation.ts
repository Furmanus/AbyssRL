import { ICoordinates } from '../interfaces/common';
import { config } from '../global/config';

export function validatePositionIsInMap(position: ICoordinates): boolean {
  const {
    LEVEL_WIDTH,
    LEVEL_HEIGHT,
  } = config;
  const {
    x,
    y,
  } = position;

  return (x >= 0 && y >= 0 && x <= LEVEL_WIDTH - 1 && y <= LEVEL_HEIGHT - 1);
}
