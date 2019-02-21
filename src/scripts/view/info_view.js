/**
 * Created by Lukasz Lach on 2017-04-24.
 */

/**
 * Class representing information section on game view. Section is split into two parts: first part is player information (hit points, stats, name), second part is about game
 * enviroment(visible monsters, objects).
 */
export class InfoView {
    constructor (width, height) {
        this.screenElement = document.getElementById("info");
        this.screenElement.style.width = width + 'px';
        this.screenElement.style.height = height + 'px';
    }
    /**
     * Function responsible for resizing info window size.
     * @param {number} newWidth New info window width in pixels.
     * @param {number} newHeight New info window height in pixels.
     */
    changeSize (newWidth, newHeight) {
        this.screenElement.style.width = newWidth + 'px';
        this.screenElement.style.height = newHeight + 'px';
    }
    getScreen () {
        return this.screenElement;
    }
}
