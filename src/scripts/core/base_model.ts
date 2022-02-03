import { Constructor } from './constructor';
import { IAnyObject } from '../interfaces/common';

export class BaseModel extends Constructor {
  public serialize(): unknown {
    return { ...this };
  }
}
