import { AllEventBusEventDataTypes, AllEventBusEventNames, EventBusCallbackFunction } from './eventBus.interfaces';

export abstract class EventBus<EventNames extends AllEventBusEventNames> {
  #subscribers: Map<EventNames, Set<(...args: AllEventBusEventDataTypes[EventNames]) => void>>;

  public publish<EventName extends EventNames>(name: EventName, ...args: AllEventBusEventDataTypes[EventName]): void {
    this.#subscribers.get(name)?.forEach((cb) => {
      cb(...args);
    });
  }

  public subscribe<EventName extends EventNames>(name: EventName, callback: EventBusCallbackFunction<EventName>): void {
    if (!this.#subscribers.has(name)) {
      this.#subscribers.set(name, new Set());
    }

    this.#subscribers.get(name).add(callback);
  }

  public unsubscribe<EventName extends EventNames>(name: EventName, callback: EventBusCallbackFunction<EventName>): void {
    if (!this.#subscribers.has(name)) {
      this.#subscribers.set(name, new Set());
    }

    this.#subscribers.get(name).delete(callback);
  }
}
