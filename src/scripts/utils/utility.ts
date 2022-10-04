import { config } from '../global/config';
import { Position } from '../position/position';
import {
  IAnyFunction,
  IAnyObject,
  IBooleanDictionary,
  ICoordinates,
} from '../interfaces/common';
/**
 * Calculates and returns distance between two points.
 *
 * @param   x1  Horizontal(row) coordinate of first point
 * @param   y1  Vertical(column) coordinate of first point
 * @param   x2  Horizontal(row) coordinate of second point
 * @param   y2  Vertical(column) coordinate of second point
 * @returns     Returns calculated distance between two points.
 */
export function getDistance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
export function getDistanceBetweenPoints(
  pointA: Position,
  pointB: Position,
): number {
  return getDistance(pointA.x, pointA.y, pointB.x, pointB.y);
}
/**
 * Method which executes provided callback function on every point of bresenham line between points (x1, y1) and (x2, y2).
 *
 * @param   x1        Horizontal(row) coordinate of starting point.
 * @param   y1        Vertical(column) coordinate of starting point.
 * @param   x2        Horizontal(row) coordinate of target point.
 * @param   y2        Vertical(column) coordinate of target point.
 * @param   callback  Callback function to execute on every point of bresenham line.
 */
export function bresenhamLine(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  callback: IAnyFunction,
): void {
  const deltaX = Math.abs(x2 - x1);
  const deltaY = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;

  let err = deltaX - deltaY;

  while (true) {
    const e2 = 2 * err;

    if (
      !(
        x1 < 1 ||
        y1 < 1 ||
        x1 >= config.LEVEL_WIDTH - 1 ||
        y1 >= config.LEVEL_HEIGHT - 1
      )
    ) {
      callback(x1, y1);
    }
    if (x1 === x2 && y1 === y2) {
      break;
    }
    if (e2 > -deltaY) {
      err -= deltaY;
      x1 += sx;
    }
    if (e2 < deltaX) {
      err += deltaX;
      y1 += sy;
    }
  }
}
/**
 * Flood fill algorithm which triggers provided callback function for every (x, y) cell on map. Border object can be
 * passed as argument, border is an array which stores objects {x: number, y: number} of map cells which stops
 * propagation of algorithm.
 * @param   border   (Optional)Array which stores objects in form {x: {number}, y: {number}} of map cells which stops
 *                    propagation of algorithm.
 * @param   startX         Row coordinate of cell where algorithm starts.
 * @param   startY         Column coordinate of cell where algorithm starts.
 * @param   callback  Callback function called for every (x, y) coordinates on path of algorithm.
 */
export function floodFill(
  border: ICoordinates[],
  startX: number,
  startY: number,
  callback: IAnyFunction,
): void {
  /**
   * Object {'x y': true} storing information by already visited cells by algorithm as keys x + " " + y.
   */
  const visitedCells: IBooleanDictionary = {};

  flood(startX, startY);

  function flood(x: number, y: number): void {
    // if algorithm goes off level map, we stop current function
    if (
      x < 1 ||
      y < 1 ||
      x > config.LEVEL_WIDTH - 1 ||
      y > config.LEVEL_HEIGHT - 1
    ) {
      return;
    }
    // if examined cell was already visited, we stop current function
    if (visitedCells[x + ' ' + y]) {
      return;
    }
    // if border was passed as algorithm and examined cell is a border, we stop current function
    if (border && meetsBorder(x, y)) {
      return;
    }

    visitedCells[x + ' ' + y] = true; // we mark currently examined cell as visited
    callback(x, y); // trigger provided callback function for currently examined cell

    // recursively call flood function for all surrounding coordinates
    flood(x - 1, y - 1);
    flood(x - 1, y);
    flood(x - 1, y + 1);
    flood(x, y - 1);
    flood(x, y + 1);
    flood(x + 1, y - 1);
    flood(x + 1, y);
    flood(x + 1, y + 1);
  }
  // check if currently examined cell is a border (is in border array provided as main function argument)
  function meetsBorder(x: number, y: number): boolean {
    for (const item of border) {
      if (item.x === x && item.y === y) {
        return true;
      }
    }
    return false;
  }
}
/**
 * Converts two given points in form {x: x, y: y} to direction in form {x: x, y: y} between them. For example for
 * points {x: 1, y: 1} and {x: 2, y: 1} direction will be {x: 1, y: 0}. This is just a direction, not a vector with
 * length, so direction between points {x: 1, y: 1} and {x: 10, y: 1} still will be {x: 1, y: 0}.
 *
 * @param   coords1 - Starting point
 * @param   coords2 - Goal point
 * @return  Returns direction object {x: number, y: number} where x and y can be equal only to -1, 0, 1.
 */
export function convertCoordsToDirection(
  coords1: ICoordinates,
  coords2: ICoordinates,
): ICoordinates {
  let directionX = coords2.x - coords1.x;
  let directionY = coords2.y - coords1.y;

  if (directionX !== 0) {
    directionX = directionX > 0 ? 1 : -1;
  }

  if (directionY !== 0) {
    directionY = directionY > 0 ? 1 : -1;
  }

  return { x: directionX, y: directionY };
}
/**
 * Method responsible for checking if two arrays are equal to each other (other array is given in form of arguments)
 */
export function isArrayEqualToArguments<M = IAnyObject>(
  array: M[],
  ...args: M[]
): boolean {
  let result = true;

  if (array.length !== args.length) {
    return false;
  }
  array.forEach((item: M) => {
    if (!args.includes(item)) {
      result = false;
    }
  });
  args.forEach((item: M) => {
    if (!array.includes(item)) {
      result = false;
    }
  });

  return result;
}
/**
 * Method responsible for cheching if certain array contains all of given arguments.
 */
export function doesArrayContainsArguments<M = IAnyObject>(
  array: M[],
  ...args: M[]
): boolean {
  let result = true;

  args.forEach((item: M) => {
    if (!array.includes(item)) {
      result = false;
    }
  });

  return result;
}
export function getPositionFromString(
  str: string,
  separator: string,
): Position {
  const coordsArray = str.split(separator);
  const x = Number(coordsArray[0]);
  const y = Number(coordsArray[1]);

  if (!isNaN(x) && !isNaN(y)) {
    return new Position(x, y);
  }
  throw new Error(
    'Invalid position coordinates in getPositionFromString method',
  );
}
export function convertCoordsToString(x: number, y: number): string {
  return `${x}x${y}`;
}
/**
 * Capitalizes first letter of given text.
 *
 * @param   str    Text with first letter to capitalize.
 * @returns         Returns transformed text.
 */
export function capitalizeString(str: string): string {
  const trimmedString: string = str.trim();

  if (trimmedString.length === 0) {
    return '';
  } else if (trimmedString.length === 1) {
    return trimmedString.toUpperCase();
  } else {
    return trimmedString.charAt(0).toUpperCase() + trimmedString.slice(1);
  }
}
/**
 * Converts first letter of given string to according natural number.
 *
 * @param   char  String which first char should be converted to number
 * @returns       Number corresponding to given letter.
 */
export function getNumericValueOfChar(char: string): number {
  return char.toLowerCase().charCodeAt(0) - 97;
}
/**
 * Converts number to according lowercase letter of alphabet
 * @param   num   Number to convert
 * @returns       Letter to which number was converted
 */
export function getLetterFromNumber(num: number): string {
  return String.fromCharCode(num + 97);
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
