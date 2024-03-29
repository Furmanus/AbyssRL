export interface Coordinates {
    x: number;
    y: number;
}

export type CoordinatesString = `${number}x${number}`;

export interface PressKeyOptions {
    shiftKey?: boolean;
    key?: string;
  }
