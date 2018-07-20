/**
 * Created by Docent Furman on 2017-04-24.
 */
export class MinimapView {
    constructor (width, height) {
        this.screen = document.getElementById('map');

        this.context = this.screen.getContext('2d');
        this.context.canvas.width = width;
        this.context.canvas.height = height;
    }
    /**
     * Function responsible for resizing mini map window size.
     * @param {number} newWidth New mini map window width in pixels.
     * @param {number} newHeight New mini map window height in pixels.
     */
    changeSize (newWidth, newHeight) {
        this.context.canvas.width = newWidth;
        this.context.canvas.height = newHeight;
    }
    getScreen () {
        return this.screen;
    }
}