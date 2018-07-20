import ROT from 'rot-js';

export class Rng{
    /**
     * Method responsible for returning random numer in given range.
     * @param {number}  min     Min value
     * @param {number}  max     Max value
     * @returns {number}
     */
    static getRandomNumber(min, max){
        return Math.floor((ROT.RNG.getUniform() * (max - min + 1)) + min);
    }

    /**
     * Method responsible for returning random number between 1 and 100.
     * @returns {int}
     */
    static getPercentage(){
        return ROT.RNG.getPercentage();
    }
}