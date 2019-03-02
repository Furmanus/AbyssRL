export interface IAnyFunction {
    /* tslint:disable-next-line:no-any*/
    (...args: any[]): any;
}
export interface IAnyObject {
    /* tslint:disable-next-line:no-any*/
    [propName: string]: any;
}
export interface IStringDictionary {
    [propName: string]: string;
}
export interface IBooleanDictionary {
    [propName: string]: boolean;
}
export interface ICoordinates {
    x: number;
    y: number;
}
export interface IDirection {
    x: directionType;
    y: directionType;
}
export type directionType = -1 | 0 | 1;
