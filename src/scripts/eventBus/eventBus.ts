export abstract class EventBus<EventBusDataType extends Record<string, Array<any>>> {
  #subscribers: Map<keyof EventBusDataType, Set<(...args: EventBusDataType[keyof EventBusDataType]) => void>>;

  public publish<EventName extends keyof EventBusDataType>(name: EventName, ...args: EventBusDataType[EventName]): void {
    this.#subscribers.get(name)?.forEach((cb) => {
      cb(...args);
    });
  }

  public subscribe<EventName extends keyof EventBusDataType>(name: EventName, callback: (...args: EventBusDataType[EventName]) => void): void {
    if (!this.#subscribers.has(name)) {
      this.#subscribers.set(name, new Set());
    }

    this.#subscribers.get(name).add(callback);
  }

  public unsubscribe<EventName extends keyof EventBusDataType>(name: EventName, callback: (...args: EventBusDataType[EventName]) => void): void {
    if (!this.#subscribers.has(name)) {
      this.#subscribers.set(name, new Set());
    }

    this.#subscribers.get(name).delete(callback);
  }
}
