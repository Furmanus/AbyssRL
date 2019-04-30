import {Observer} from './observer';
import {IAnyFunction, IAnyObject} from '../interfaces/common';
import {Controller} from '../controller/controller';

export interface IListener {
    observer: Controller;
    event: string;
    callback: IAnyFunction;
}

export class MapWithObserver<K, V extends Observer> extends Observer {
    private map: Map<K, V>;
    private mapListeners: Set<IListener> = new Set<IListener>();

    public get size(): number {
        return this.map.size;
    }

    constructor(list?: Array<[K, V]>) {
        super();

        if (list) {
            this.map = new Map<K, V>(list);
        } else {
            this.map = new Map<K, V>();
        }
    }
    /**
     * Method responsible for enabling listening of given controller on specified event on all elements of map.
     *
     * @param controller    Controller which will listen on events
     * @param event         Event name
     * @param callback      Callback function called after event was notified
     */
    public on(controller: Controller, event: string, callback: IAnyFunction): this {
        this.listenTo(controller, event, callback);

        return this;
    }
    /**
     * Deletes all entries from map.
     */
    public clear(): void {
        this.map.clear();
    }
    /**
     * Deletes single entry from map. Returns true if key was in map before deleting.
     *
     * @param key   Key from map to delete
     * @returns     Returns boolean variable indicating whether key was in map before deleting it
     */
    public delete(key: K): boolean {
        if (this.map.has(key)) {
            this.mapListeners.forEach((listenerObject: IListener) => {
                this.map.get(key).off(listenerObject.observer, listenerObject.event);
            });
            this.map.delete(key);

            return true;
        }
        return false;
    }
    /**
     * Iterates through map entries and calls callback function for each entry.
     *
     * @param callback  Function called on each entry of map
     * @param thisArg   this value
     */
    public forEach(callback: IAnyFunction, thisArg?: IAnyObject): void {
        this.map.forEach(callback, thisArg);
    }
    /**
     * Returns value object stored in map under passed key. Returns undefined if no such key is found.
     *
     * @param key   Key from map
     * @returns     Returns object stored under key or undefined if no key was found
     */
    public get(key: K): V {
        return this.map.get(key);
    }
    /**
     * Returns true if map has value stored for passed key.
     *
     * @param key   Key we want to check if present in map
     * @returns     Returns true if there was a value stored under given key
     */
    public has(key: K): boolean {
        return this.map.has(key);
    }
    /**
     * Stores new value under given key.
     *
     * @param key       Key under which value is supposed to be stored
     * @param value     Value to store
     * @returns         Returns this
     */
    public set(key: K, value: V): this {
        const removedValue: V = this.get(key);

        this.mapListeners.forEach((listener: IListener) => {
            if (removedValue) {
                removedValue.off(listener.observer, listener.event);
            }
            value.on(listener.observer, listener.event, listener.callback);
        });

        this.map.set(key, value);

        return this;
    }
    /**
     * Disables listening given controller to event notified by values objects from map.
     *
     * @param controller    Controller which listening on events will be disabled
     * @param event         Event name
     */
    public stopListening(controller: Controller, event?: string): void {
        this.mapListeners.forEach((listenerObject: IListener) => {
            if (listenerObject.observer === controller && (listenerObject.event === event || !event)) {
                this.mapListeners.delete(listenerObject);
            }
        });
        this.forEach((value: V) => {
            value.off(controller, event);
        });
    }
    /**
     * Enables listening given controller to event notified by values objects from map.
     *
     * @param controller    Controller which will listen on events
     * @param event         Event name
     * @param callback      Callback function called after event was notified
     */
    private listenTo(controller: Controller, event: string, callback: IAnyFunction): void {
        this.mapListeners.add({
            observer: controller,
            event,
            callback,
        });
        this.forEach((value: V) => {
            value.on(controller, event, callback);
        });
    }
}
