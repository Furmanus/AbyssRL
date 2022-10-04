import { rngService } from '../utils/rng.service';

export enum CoinValues {
    Head = 'head',
    Tails = 'tails',
}

type CoinValue = 'head' | 'tails';

export class Coin {
    public value: CoinValues = null;

    public static toss(): boolean {
      return new Coin().toss() === CoinValues.Head;
    }

    public toss(): CoinValues {
      this.value = rngService.getRandomNumber(1, 2) === 2 ? CoinValues.Head : CoinValues.Tails;

      return this.value;
    }
}
