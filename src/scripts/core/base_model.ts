import { Constructor } from './constructor';
import { IAnyObject } from '../interfaces/common';

export class BaseModel extends Constructor implements IAnyObject {
  /**
   * Models extending base model can have different number and type of properties
   */
  [prop: string]: any;
  /**
   * Sets property value in model.
   *
   * @param   key     Name of property
   * @param   value   Value of property
   * @param   silent  If set to true, no notification will be send about property change
   */
  public setProperty(key: string, value: any, silent: boolean = false): void {
    if (this.hasOwnProperty(key)) {
      this[key] = value;

      if (!silent) {
        this.notify(`property:${key}:change`, value);
      }
    } else {
      console.warn(`Attempt to set unknown property ${key}`);
    }
  }
}
