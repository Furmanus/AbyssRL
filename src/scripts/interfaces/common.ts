import { ItemTypes } from '../constants/items/item';

/* tslint:disable-next-line:no-any */
export type IAnyFunction = (...args: any[]) => any;
export interface IAnyObject {
  /* tslint:disable-next-line:no-any */
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
  x: DirectionType;
  y: DirectionType;
}
export type DirectionType = -1 | 0 | 1;
export interface IDirections {
  [prop: number]: IDirection;
}
export interface IMessageData {
  message: string;
}
export interface IPlayerConfirmationObject {
  message: string;
  confirm: IAnyFunction;
  decline: IAnyFunction;
}
export interface IActionAttempt {
  result: boolean;
  message?: string;
}
export interface ITemplate {
  [templateName: string]: string;
}
export type TemplateType = Record<ItemTypes.Weapon | ItemTypes.Armour, string>;
export interface ITemplateVariables {
  // tslint:disable-next-line:no-any
  [propName: string]: string | number;
}
export type ValueOf<T> = T[keyof T];
