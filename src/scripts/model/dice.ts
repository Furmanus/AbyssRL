import { getRandomNumber } from '../helper/rng';

export class Dice {
    private multiplier: number;
    private sides: number;
    private additional: number;

    public constructor(description: string) {
      const splitDesc: string[] = description.trim().split('d');
      const multiplier: number = Number(splitDesc[0]);
      const rest: string[] = splitDesc[1].trim().split('+');
      const sides: number = Number(rest[0]);
      let additional: number;

      if (splitDesc.length !== 2 || isNaN(multiplier) || isNaN(sides)) {
        throw new Error('Wrong dice constructor description');
      }
      if (rest.length === 1) {
        additional = 0;
      } else if (rest.length === 2) {
        additional = Number(rest[1]);

        if (isNaN(additional)) {
          throw new Error('Wrong dice constructor description');
        }
      } else {
        throw new Error('Wrong dice constructor description');
      }

      this.multiplier = multiplier;
      this.sides = sides;
      this.additional = additional;
    }

    public roll(): number {
      return (this.multiplier * getRandomNumber(1, this.sides) + this.additional);
    }

    public getMultiplier(): number {
      return this.multiplier;
    }

    public getSides(): number {
      return this.sides;
    }

    public getAdditional(): number {
      return this.additional;
    }

    public getSerializedData(): string {
      let desc: string = `${this.multiplier}d${this.sides}`;

      if (this.additional) {
        desc += `+${this.additional}`;
      }

      return desc;
    }
}
