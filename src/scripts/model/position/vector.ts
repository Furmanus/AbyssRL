/**
 * Class representing two dimensional vector.
 */
import {BaseModel} from '../../core/base_model';

export class Vector extends BaseModel {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
        super();

        this.x = x;
        this.y = y;
    }
    public add(vector: Vector): this {
        this.x += vector.x;
        this.y += vector.y;

        return this;
    }
    public substract(vector: Vector): this {
        this.x -= vector.x;
        this.y -= vector.y;

        return this;
    }
}
