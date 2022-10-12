import { Coordinates, CoordinatesString } from '../interfaces/interfaces';

export function convertPositionToCoordinatesString({ x, y }: Coordinates): CoordinatesString {
  return `${x}x${y}`;
}
