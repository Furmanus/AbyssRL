import { Collection } from './collection';
import { BaseModel } from './base.model';
import { IAnyFunction } from '../interfaces/common';

jest.mock('./base.model');

const TEST_EVENT = 'test_event';

describe('Test collection class', () => {
  let collection: Collection<BaseModel>;
  let element1: BaseModel;
  let element2: BaseModel;
  let callback: IAnyFunction;

  beforeEach(() => {
    element1 = new BaseModel();
    element2 = new BaseModel();
    collection = new Collection(element2);
    callback = jest.fn();
  });

  it('Constructor should create collection with element', () => {
    expect(collection.has(element2)).toBe(true);
  });
  it('Add method should add element and call notify', () => {
    collection.add(element1);

    expect(collection.has(element1)).toBe(true);
  });
  it('Remove method should remove element and call notify', () => {
    collection.remove(element2);

    expect(collection.has(element2)).toBe(false);
  });
  it('forEach method should call callback proper number of times', () => {
    collection.add(element1);
    collection.forEach(callback);

    expect(callback).toHaveBeenCalledTimes(2);
  });
});
