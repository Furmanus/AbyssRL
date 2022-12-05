import { Constructor } from './constructor';
import { IAnyFunction } from '../interfaces/common';
import { BaseController } from './base.controller';

/**
 * Collection of generic type models (they have to extend BaseModel).
 */
export class Collection<
  M extends Constructor = Constructor,
> extends Constructor {
  private collection: M[];
  private listeners: Map<
    BaseController,
    {
      [eventName: string]: IAnyFunction;
    }
  > = new Map();

  get size(): number {
    return this.collection.length;
  }

  constructor(list?: M[] | M) {
    super();

    if (list instanceof Array) {
      this.collection = list;
    } else if (list !== undefined) {
      this.collection = [list];
    } else {
      this.collection = [];
    }
  }

  /**
   * Adds new element to collection. Action is notified with ADD event from collection events enum.
   *
   * @param item  New collection element to add
   */
  public add(item: M): this;
  public add(item: M[]): this;
  public add(item: M | M[]): this {
    if (Array.isArray(item)) {
      this.collection = [...this.collection, ...item];
    } else {
      this.collection.push(item);
    }

    return this;
  }

  /**
   * Returns element in collection as specific index.
   *
   * @param index  Position in collection from which item we want to retrieve. Returns whole collection if no index
   *               is specified.
   */
  public get(index: number): M;
  public get(): M[];
  public get(index?: number): M | M[] {
    if (typeof index === 'number') {
      return this.collection[index];
    } else if (index === undefined) {
      return this.collection;
    } else {
      throw new Error(`Invalid argument type: ${index}`);
    }
  }

  /**
   * Removes elements or single element from collection.
   *
   * @param item  Elements or single element to remove from collection
   * @returns     Returns removed elements or element
   */
  public remove(item: M[]): M[];
  public remove(item: M): M;
  public remove(item: M | M[]): M | M[] {
    if (Array.isArray(item)) {
      const removedItems: M[] = [];

      for (const examinedItem of item) {
        if (this.has(examinedItem)) {
          this.collection.splice(this.collection.indexOf(examinedItem), 1);
          removedItems.push(examinedItem);
        }
      }

      return removedItems;
    } else {
      if (this.has(item)) {
        this.collection.splice(this.collection.indexOf(item), 1);

        return item;
      }
    }
  }

  /**
   * Removes items from collection by their indexes (order)
   *
   * @param indexes Numberic indexes of items to be removed from collection
   * @returns Array of removed items from collection
   */
  public removeByIndexes(...indexes: number[]): M[] {
    return this.getByIndexes(...indexes).map((item) => this.remove(item));
  }

  /**
   * Retrieves items from collection by their indexes (order)
   *
   * @param indexes Numberic indexes of items to be retrieved from collection
   * @returns Array of retrieved items from collection
   */
  public getByIndexes(...indexes: number[]): M[] {
    return indexes.map((num) => this.get(num));
  }

  /**
   * Checks if collection contains certain element.
   *
   * @param   item    Element to be found in collection
   * @returns         Returns boolean variable determining whether element is in collection
   */
  public has(item: M): boolean {
    return this.collection.includes(item);
  }

  /**
   * Iterates through all elements of collection and triggers passed function.
   *
   * @param callback  Callback called on each element of collection.
   */
  public forEach(callback: IAnyFunction): void {
    this.collection.forEach(callback);
  }

  /**
   * Enables listening by specified Controller instance on collection objects emitting specific event. Enables
   * listening on event on already existing in collection objects and makes that passed controller will be
   * automatically listening on all newly added elements.
   *
   * @param controller    Instance of controller which will be listening on event
   * @param event         Event name
   * @param callback      Callback function triggered after one or more collection's member notifies event
   */
  public listenOn(
    controller: BaseController,
    event: string,
    callback: IAnyFunction,
  ): this {
    this.forEach((element: M) => {
      element.on(controller, event, callback);
    });

    if (this.listeners.has(controller)) {
      this.listeners.get(controller)[event] = callback;
    } else {
      this.listeners.set(controller, {
        [event]: callback,
      });
    }
    return this;
  }

  /**
   * Disabled listening on specified event notified by collection elements.
   *
   * @param controller    Instance of controller which is listening on event
   * @param event         Event name
   */
  public stopListening(controller: BaseController, event: string): this {
    this.forEach((element: M) => {
      element.off(controller, event);
    });

    if (this.listeners.has(controller)) {
      this.listeners.delete(controller);
    }
    return this;
  }
}
