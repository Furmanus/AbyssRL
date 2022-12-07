import { v4 as uuid } from 'uuid';

export interface SerializedBaseModel {
  id?: string;
}

export class BaseModel {
  public id = uuid();

  public constructor(config?: SerializedBaseModel) {
    if (config?.id) {
      this.id = config.id;
    }
  }

  public serialize(): { id: string } {
    return { id: this.id };
  }
}
