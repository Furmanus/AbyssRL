import { Constructor } from './constructor';
import { IAnyObject } from '../interfaces/common';

export class BaseModel extends Constructor {
  public id = Math.random().toString();

  public serialize(): unknown {
    return { ...this };
  }
}
