/**
 * Created by Lukasz Lach on 2017-04-24.
 */

/**
 * Class representing information section on game view. Section is split into two parts: first part is player
 * information (hit points, stats, name), second part is about game enviroment(visible monsters, objects).
 */
export class InfoView {
    private screenElement: HTMLCanvasElement = document.getElementById('info') as  HTMLCanvasElement;
    private playerName: HTMLParagraphElement = document.querySelector('[data-element="player_name.element"]');
    private levelInfo: HTMLParagraphElement = document.querySelector('[data-element="level_info.element"]');

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
    /**
     * Changes text in HTML element with player name.
     *
     * @param name  New text
     */
    public changePlayerNameMessage(name: string): void {
        this.playerName.textContent = name;
    }
    /**
     * Changes text in HTML element with level information.
     *
     * @param message New text
     */
    public changeLevelInfoMessage(message: string): void {
        this.levelInfo.innerHTML = message;
    }
    public getScreen(): HTMLCanvasElement {
        return this.screenElement;
    }
}
