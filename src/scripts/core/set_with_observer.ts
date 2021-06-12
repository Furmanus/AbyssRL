import { Observer } from './observer';
import { IListener } from './map_with_observer';
import { IAnyObject } from '../interfaces/common';

export class SetWithObserver<E> extends Observer {
  private set: Set<E>;
  private setListeners: Set<IListener> = new Set<IListener>();

  public get size(): number {
    return this.set.size;
  }

  public constructor(list?: E[]) {
    super();

    if (list) {
      this.set = new Set<E>(list);
    } else {
      this.set = new Set<E>();
    }
  }

  public add(item: E): this {
    this.set.add(item);
    this.notify('add', item);
    return this;
  }

  public clear(): this {
    this.set.clear();
    this.notify('clear');

    return this;
  }

  public delete(value: E): this {
    this.set.delete(value);
    this.notify('delete', value);

    return this;
  }

  public has(value: E): boolean {
    return this.set.has(value);
  }

  public forEach(callback: (element: E) => void, thisArg?: IAnyObject): void {
    this.set.forEach(callback, thisArg);
  }
}
