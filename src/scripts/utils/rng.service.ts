import { RNG } from 'rot-js';
import { applicationConfigService } from '../global/config';

class RngService {
  /**
   * Method responsible for returning random numer in given range.
   *
   * @param min     Min value
   * @param max     Max value
   */
  public getRandomNumber(min: number, max: number): number {
    return Math.floor(RNG.getUniform() * (max - min + 1) + min);
  }

  /**
   * Method responsible for returning random number between 1 and 100.
   */
  public getPercentage(): number {
    return RNG.getPercentage();
  }

  /**
   * Sets specific seed value for RNG. For two same seeds values, RNG will give same random results for sequent rolls.
   *
   * @param seedNumber Seed value
   */
  public setSeed(seedNumber: number): void {
    RNG.setSeed(seedNumber);
  }

  public getSeed(): number {
    return RNG.getSeed();
  }
}

const rngService = new RngService();

if (applicationConfigService.isDevMode || applicationConfigService.isTestMode) {
  window._application.rngService = rngService;
}

export { rngService };
export type {
  RngService,
};
