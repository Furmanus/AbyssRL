import { Collection } from './collection';
import { BaseModel } from './base.model';
import { CollectionEvents } from '../constants/collection_events';
import { BaseController } from './base.controller';
import { IAnyFunction } from '../interfaces/common';

jest.mock('./base.model');
jest.mock('./base.controller');

const TEST_EVENT = 'test_event';

describe('Test collection class', () => {
  let collection: Collection<BaseModel>;
  let controller: BaseController;
  let element1: BaseModel;
  let element2: BaseModel;
  let callback: IAnyFunction;

  beforeEach(() => {
    element1 = new BaseModel();
    element2 = new BaseModel();
    collection = new Collection(element2);
    controller = new BaseController();
    callback = jest.fn();

    collection.notify = jest.fn();
  });

  it('Constructor should create collection with element', () => {
    expect(collection.has(element2)).toBe(true);
  });
  it('Add method should add element and call notify', () => {
    collection.add(element1);

    expect(collection.has(element1)).toBe(true);
    expect(collection.notify).toHaveBeenCalledWith(
      CollectionEvents.Add,
      element1,
    );
  });
  it('Remove method should remove element and call notify', () => {
    collection.remove(element2);

    expect(collection.has(element2)).toBe(false);
    expect(collection.notify).toHaveBeenCalledWith(
      CollectionEvents.Remove,
      element2,
    );
  });
  it('forEach method should call callback proper number of times', () => {
    collection.add(element1);
    collection.forEach(callback);

    expect(callback).toHaveBeenCalledTimes(2);
  });
  it('listenOn method should correctly make controllers listen on collection elements', () => {
    collection.add(element1);
    collection.listenOn(controller, TEST_EVENT, callback);

    expect(element1.on).toHaveBeenCalledWith(controller, TEST_EVENT, callback);
    expect(element2.on).toHaveBeenCalledWith(controller, TEST_EVENT, callback);
  });
  it('stopListening method should correctly detach events', () => {
    collection.listenOn(controller, TEST_EVENT, callback);
    collection.stopListening(controller, TEST_EVENT);

    expect(element2.off).toHaveBeenCalledWith(controller, TEST_EVENT);
  });
});
