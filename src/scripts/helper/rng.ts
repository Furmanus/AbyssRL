import { RNG } from 'rot-js';
/**
 * Method responsible for returning random numer in given range.
 *
 * @param min     Min value
 * @param max     Max value
 */
export function getRandomNumber(min: number, max: number): number {
  return Math.floor(RNG.getUniform() * (max - min + 1) + min);
}

/**
 * Method responsible for returning random number between 1 and 100.
 */
export function getPercentage(): number {
  return RNG.getPercentage();
}
