import { Controller } from '../../controller/controller';
import { SetWithObserver } from '../set_with_observer';
import { IAnyFunction } from '../../interfaces/common';

jest.mock('../../controller/controller');

describe('Test set with observer class', () => {
  let controller: Controller;
  let setWithObserver: SetWithObserver<number>;
  let callback: IAnyFunction;

  beforeEach(() => {
    controller = new Controller();
    callback = jest.fn();
  });

  it('Should create new set with objects from given array', () => {
    setWithObserver = new SetWithObserver<number>([1, 2, 3]);

    expect(setWithObserver.size).toBe(3);
  });
  it('Should listen on event and trigger callback when event occurs', () => {
    setWithObserver = new SetWithObserver<number>();

    setWithObserver.on(controller, 'add', callback);
    setWithObserver.add(1);

    expect(callback).toHaveBeenCalledTimes(1);
  });
  it('Should listen on delete event and trigger callback when event occurs', () => {
    setWithObserver = new SetWithObserver<number>([1]);

    setWithObserver.on(controller, 'delete', callback);
    setWithObserver.delete(1);

    expect(callback).toHaveBeenCalledTimes(1);
  });
  it('Should listen on clear event and trigger callback when event occurs', () => {
    setWithObserver = new SetWithObserver<number>([1, 2, 3]);

    setWithObserver.on(controller, 'clear', callback);
    setWithObserver.clear();

    expect(callback).toHaveBeenCalledTimes(1);
    expect(setWithObserver.size).toBe(0);
  });
});
