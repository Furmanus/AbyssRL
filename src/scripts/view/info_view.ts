/**
 * Created by Lukasz Lach on 2017-04-24.
 */

/**
 * Class representing information section on game view. Section is split into two parts: first part is player
 * information (hit points, stats, name), second part is about game enviroment(visible monsters, objects).
 */
export class InfoView {
    private screenElement: HTMLCanvasElement = document.getElementById('info') as  HTMLCanvasElement;

    constructor(width: number, height: number) {
        this.screenElement.style.width = width + 'px';
        this.screenElement.style.height = height + 'px';
    }
    /**
     * Function responsible for resizing info window size.
     * @param   newWidth        New info window width in pixels.
     * @param   newHeight       New info window height in pixels.
     */
    public changeSize(newWidth: number, newHeight: number): void {
        this.screenElement.style.width = newWidth + 'px';
        this.screenElement.style.height = newHeight + 'px';
    }
    public getScreen(): HTMLCanvasElement {
        return this.screenElement;
    }
}
