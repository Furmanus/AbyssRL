import { IAnyFunction } from '../interfaces/common';

interface IObserverEntry {
  event?: string;
  callback: IAnyFunction;
}

export abstract class Observer {
  #observers: Set<IObserverEntry> = new Set();

  constructor() {
    if (new.target === Observer) {
      throw new Error(
        'Cannot create new Observer object. Observer is supposed to be inherited only.',
      );
    }
  }

  /**
   * Turns on listening on observer instance on specified event. After event is notified,
   * passed callback function is triggered.
   *
   * @param event     Name of event
   * @param callback  Callback function called after event is notified
   */
  public on(event: string, callback: IAnyFunction): void {
    this.#observers.add({
      event,
      callback,
    });
  }

  /**
   * Turns off listening on specified event.
   *
   * @param event     Event name
   */
  public off(event?: string): void {
    const observerEntries = this.#observers.values();

    for (const entry of observerEntries) {
      if (!event || entry.event === event) {
        this.#observers.delete(entry);
      }
    }
  }

  /**
   * Makes observer instance notify that specific event happened. If any other observer instance was listening to
   * specified event, callback function is called.
   *
   * @param event     Name of event
   * @param data      Additional data passed along with notification
   */
  public notify(event: string, data?: any): void {
    const observerEntries = this.#observers.values();

    for (const entry of observerEntries) {
      if (entry.event === event) {
        entry.callback(data);
      }
    }
  }
}
