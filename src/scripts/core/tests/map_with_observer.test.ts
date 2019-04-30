import {Controller} from '../../controller/controller';
import {WallModel} from '../../model/dungeon/cells/wall_model';
import {MapWithObserver} from '../map_with_observer';
import {IAnyFunction} from '../../interfaces/common';
import {CellModelFactory} from '../../factory/cell_model_factory';

jest.mock('../../controller/controller');

describe('Test MapWithObserver class', () => {
    let controller: Controller;
    let cell1: WallModel;
    let cell2: WallModel;
    let cell3: WallModel;
    let map: MapWithObserver<string, WallModel>;
    let callback: IAnyFunction;
    let callback2: IAnyFunction;

    beforeAll(() => {
        extendArrayPrototype();
    });

    beforeEach(() => {
        controller = new Controller();
        cell1 = CellModelFactory.getGrayWallModel(2, 2);
        cell2 = CellModelFactory.getGrayWallModel(3, 3);
        cell3 = CellModelFactory.getGrayWallModel(4, 4);
        map = new MapWithObserver([['2x2', cell1], ['3x3', cell2]]);
        callback = jest.fn();
        callback2 = jest.fn();
    });

    it('Constructor should create map containing both cells', () => {
        expect(map.get('2x2')).toBe(cell1);
        expect(map.get('3x3')).toBe(cell2);
    });
    it('Controller should react on cell notify', () => {
        const argument = {cell: cell1};

        map.on(controller, 'test', callback);
        cell1.notify('test', argument);

        expect(callback).toHaveBeenCalledWith(argument);
    });
    it('Controller should react on cell notify with cell added after enabling listening', () => {
        const argument = {cell: cell3};

        map.on(controller, 'test', callback);
        map.set('4x4', cell3);

        cell3.notify('test', argument);

        expect(callback).toHaveBeenCalledWith(argument);
    });
    it('Removed values notifications should be ignored', () => {
        const argument1 = {cell: cell1};
        const argument2 = {cell: cell2};

        map.on(controller, 'test', callback);
        map.set('2x2', cell3);

        cell1.notify('test', argument1);
        cell3.notify('test', argument2);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(argument2);
    });
    it('Listener should react on different map entries notifications', () => {
        const argument1 = {cell: cell1};
        const argument2 = {cell: cell2};

        map.on(controller, 'test', callback);
        map.set('4x4', cell3);

        cell1.notify('test', argument1);
        cell2.notify('test', argument2);
        cell3.notify('test', argument2);

        expect(callback).toHaveBeenCalledTimes(3);
    });
    it('Listener should not react to event it was not listening to', () => {
        const argument1 = {cell: cell1};
        const argument2 = {cell: cell2};

        map.on(controller, 'test', callback);

        cell1.notify('test', argument2);
        cell2.notify('tost', argument1);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(argument2);
    });
    it('Listener should not react after stop listening', () => {
        const argument1 = {cell: cell1};

        map.on(controller, 'test', callback);
        map.on(controller, 'tost', callback);
        map.stopListening(controller);

        cell1.notify('test', argument1);
        cell2.notify('tost', argument1);

        expect(callback).not.toHaveBeenCalled();
    });
    it('Delete should remove element from map and controller should ignore removed objects', () => {
        const argument1 = {cell: cell1};

        map.on(controller, 'tost', callback);

        map.delete('2x2');
        cell1.notify('tost', argument1);

        expect(map.get('2x2')).toBe(undefined);
        expect(callback).not.toHaveBeenCalled();
    });
    it('Size property should return number of map elements', () => {
        map.set('4x4', cell3);

        expect(map.size).toBe(3);
    });
    it('Clear method should remove all objects from map', () => {
        map.set('4x4', cell3);
        map.clear();

        expect(map.size).toBe(0);
    });
});

// tslint:disable-next-line:no-any
function extendArrayPrototype(): void {
    if (Array.prototype.random === undefined) {
        Array.prototype.random = jest.fn();
    }
}
