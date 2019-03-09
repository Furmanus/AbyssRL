/**
 * View of game mini map. Contains HTML elements of mini maps and methods to display data.
 */
export class MinimapView {
    private screenElement: HTMLCanvasElement = document.getElementById('map') as HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        this.context = this.screenElement.getContext('2d');
        this.context.canvas.width = width;
        this.context.canvas.height = height;
    }
    /**
     * Function responsible for resizing mini map window size.
     * @param newWidth        New mini map window width in pixels.
     * @param newHeight       New mini map window height in pixels.
     */
    public changeSize(newWidth: number, newHeight: number): void {
        this.context.canvas.width = newWidth;
        this.context.canvas.height = newHeight;
    }
    public getScreen(): HTMLCanvasElement {
        return this.screenElement;
    }
}
