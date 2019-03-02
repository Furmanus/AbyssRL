/**
 * @author Lukasz Lach
 */
import {
    IAnyFunction,
    IAnyObject,
} from '../interfaces/common';

interface IObserverEntry {
    observer: Observer;
    event: string;
    callback: IAnyFunction;
}

export class Observer {
    private observers: Set<IObserverEntry> = new Set();

    constructor() {
        if (new.target === Observer) {
            throw new Error('Cannot create new Observer object. Observer is supposed to be inherited only.');
        }
    }
    public on(observer: Observer, event: string, callback: IAnyFunction): void {
        this.observers.add({
            observer,
            event,
            callback,
        });
    }
    public off(observer: Observer, event: string): void {
        const observers = this.observers;
        const observerEntries = observers.values();

        for (const entry of observerEntries){
            if (entry.observer === observer && entry.event === event) {
                observers.delete(entry);
            }
        }
    }
    public notify(event: string, data: IAnyObject = {}): void {
        const observerEntries = this.observers.values();

        for (const entry of observerEntries){
            if (entry.event === event) {
                entry.callback.call(entry.observer, data);
            }
        }
    }
}
