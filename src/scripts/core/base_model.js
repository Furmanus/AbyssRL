import Constructor from './constructor';

class BaseModel extends Constructor {
    /**
     * Sets property value in model.
     *
     * @param {string}  key     Name of property
     * @param {*}       value   Value of property
     * @param {boolean} silent  If set to true, no notification will be send about property change
     */
    setProperty (key, value, silent = false) {
        if (typeof key !== 'string') {
            throw new Error('Property key has to be type string');
        }
        this[key] = value;

        if (!silent) {
            this.notify(`property:${key}:change`, value);
        }
    }
}