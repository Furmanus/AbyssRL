import {Constructor} from './constructor';
import { uid } from '../helper/uid_helper';

export interface IBaseModel {
    // tslint:disable-next-line:no-any
    setProperty: (key: string, value: any, silent: boolean) => void;
    getSerializedData: () => object;
}
interface IBaseModelConfig {
    id?: string;
}

export class BaseModel extends Constructor implements IBaseModel {
    public id: string;
    public constructor(config: IBaseModelConfig = {}) {
        super();

        this.id = config.id || uid();
    }
    /**
     * Models extending base model can have different number and type of properties
     */
    /* tslint:disable-next-line*/
    [prop: string]: any;
    /**
     * Sets property value in model.
     *
     * @param   key     Name of property
     * @param   value   Value of property
     * @param   silent  If set to true, no notification will be send about property change
     */
    /* tslint:disable-next-line:no-any*/
    public setProperty(key: string, value: any, silent: boolean = false): void {
        if (this.hasOwnProperty(key)) {
            this[key] = value;

            if (!silent) {
                this.notify(`property:${key}:change`, value);
            }
        } else {
            // tslint:disable-next-line:no-console
            console.warn(`Attempt to set unknown property ${key}`);
        }
    }
    public getSerializedData(): object {
        return {id: this.id};
    }
}
