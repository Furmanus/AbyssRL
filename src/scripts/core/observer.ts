import {
    IAnyFunction, IAnyObject,
} from '../interfaces/common';

interface IObserverEntry {
    observer: Observer;
    event?: string;
    callback: IAnyFunction;
}
const observers: WeakMap<IAnyObject, Set<IObserverEntry>> = new WeakMap<IAnyObject, Set<IObserverEntry>>();

export class Observer {
    constructor() {
        if (new.target === Observer) {
            throw new Error('Cannot create new Observer object. Observer is supposed to be inherited only.');
        }

        observers.set(this, new Set<IObserverEntry>());
    }
    /**
     * Turns on listening on observer instance on specified event by another observer instance. After event is notified,
     * passed callback function is triggered.
     *
     * @param observer  Observer instance which listens to specified events
     * @param event     Name of event
     * @param callback  Callback function called after event is notified
     */
    public on(observer: Observer, event: string, callback: IAnyFunction): void {
        observers.get(this).add({
            observer,
            event,
            callback,
        });
    }
    /**
     * Turns off listening on specified event by observer instance object.
     *
     * @param observer  Observer instance listening on specified event
     * @param event     Event name
     */
    public off(observer: Observer, event?: string): void {
        const observersSet = observers.get(this);
        const observerEntries = observersSet.values();

        for (const entry of observerEntries) {
            if (entry.observer === observer && (!event || entry.event === event)) {
                observersSet.delete(entry);
            }
        }
    }
    /**
     * Makes observer instance notify that specific event happened. If any other observer instance was listening to
     * specified event, callback function is called with listening observer instance passed as 'this' value.
     *
     * @param event     Name of event
     * @param data      Additional data passed along with notification
     */
    // tslint:disable-next-line:no-any
    public notify(event: string, data?: any): void {
        const observerEntries = observers.get(this).values();

        for (const entry of observerEntries) {
            if (entry.event === event) {
                entry.callback.call(entry.observer, data);
            }
        }
    }
}
