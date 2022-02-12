import { Constructor } from './constructor';
import { IAnyObject } from '../interfaces/common';
import { v4 as uuid } from 'uuid';

export interface SerializedBaseModel {
  id?: string;
}

export class BaseModel extends Constructor {
  public id = uuid();

  public constructor(config?: SerializedBaseModel) {
    super();

    if (config?.id) {
      this.id = config.id;
    }
  }

  public serialize(): { id: string } {
    return { id: this.id };
  }
}
