/**
 * @author Lukasz Lach
 */

//private variables declaration
const observers = Symbol();

export class Observer{
    constructor(){
        if(new.target === Observer){

            throw new Error('Cannot create new Observer object. Observer is supposed to be inherited only.');
        }
        /**
         * @private
         * @type {Set}
         */
        this[observers] = new Set();
    }
    on(observer, event, callback){
        this.getObservers().add({
            observer,
            event,
            callback
        });
    }
    off(observer, event){
        const observers = this.getObservers();
        const observerEntries = this.getObservers().values();

        for(let entry of observerEntries){
            if(entry.observer === observer && entry.event === event){
                observers.delete(entry);
            }
        }
    }
    notify(event, data = {}){
        const observerEntries = this.getObservers().values();

        for(let entry of observerEntries){
            if(entry.event === event){
                entry.callback.call(entry.observer, data);
            }
        }
    }
    /**
     * Returns map holding observers (observers objects are keys in map)
     * @returns {Set}
     */
    getObservers(){
        return this[observers];
    }
}