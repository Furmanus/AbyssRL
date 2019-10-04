import {Rectangle} from '../rectangle';
import {Position} from '../position';

describe('Test Rectangle class', () => {
    let rect: Rectangle;

    beforeEach(() => {
        rect = new Rectangle(new Position(0, 0), 3, 4);
    });

    it('Should return correct area', () => {
        expect(rect.area).toBe(12);
    });
    it('Scale method should set correct values', () => {
        rect.scale(0.5);

        expect(rect.area).toBe(2);
        expect(rect.width).toBe(1);
        expect(rect.height).toBe(2);
    });
    it('Copy method should return different instance with same properties', () => {
        const copy: Rectangle = rect.copy();

        expect(copy).not.toBe(rect);
        expect(copy.width).toBe(3);
        expect(copy.height).toBe(4);
    });
    it('Should return correct horizontal distance from other rectangle', () => {
        const rect2: Rectangle = new Rectangle(new Position(6, 6), 2, 1);
        const rect3: Rectangle = new Rectangle(new Position(2, 6), 2, 1);

        expect(rect.getHorizontalDistanceFromRect(rect2)).toBe(3);
        expect(rect.getHorizontalDistanceFromRect(rect3)).toBe(0);
    });
    it('Should return correct vertical distance from other rectangle', () => {
        const rect2: Rectangle = new Rectangle(new Position(6, 6), 2, 1);
        const rect3: Rectangle = new Rectangle(new Position(6, 2), 2, 1);

        expect(rect.getVerticalDistanceFromRect(rect2)).toBe(2);
        expect(rect.getVerticalDistanceFromRect(rect3)).toBe(0);
    });
    it('Should return correct serialized data', () => {
        expect(rect.getSerializedData()).toEqual({
            leftTop: {x: 0, y: 0},
            width: 3,
            height: 4,
        });
    });
});
