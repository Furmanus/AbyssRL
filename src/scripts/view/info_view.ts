import {EntityStats} from '../constants/monsters';
import {EntityModel, IEntityStatsObject} from '../model/entity/entity_model';
import {Cell} from '../model/dungeon/cells/cell_model';
import {ITemplate, ITemplateVariables} from '../interfaces/common';
import {getEntityInfoTemplate} from '../../templates/info_templates/examine_info';
import {config} from '../global/config';
import {tileset} from '../global/tiledata';
import Timeout = NodeJS.Timeout;

interface IStatsObject {
    [EntityStats.STRENGTH]: HTMLSpanElement;
    [EntityStats.DEXTERITY]: HTMLSpanElement;
    [EntityStats.INTELLIGENCE]: HTMLSpanElement;
    [EntityStats.TOUGHNESS]: HTMLSpanElement;
    [EntityStats.PERCEPTION]: HTMLSpanElement;
    [EntityStats.SPEED]: HTMLSpanElement;
    [EntityStats.HIT_POINTS]: HTMLSpanElement;
    [EntityStats.MAX_HIT_POINTS]: HTMLSpanElement;
}

/**
 * Class representing information section on game view. Section is split into two parts: first part is player
 * information (hit points, stats, name), second part is about game enviroment(visible monsters, objects).
 */
export class InfoView {
    private screenElement: HTMLCanvasElement = document.getElementById('info') as  HTMLCanvasElement;
    private playerName: HTMLParagraphElement = document.querySelector('[data-element="player_name.element"]');
    private levelInfo: HTMLParagraphElement = document.querySelector('[data-element="level_info.element"]');
    private examineDisplay: HTMLElement = document.getElementById('object_info');
    private currentImageAnimationIntervalId: Timeout;
    private tileset: CanvasImageSource;
    private TILE_SIZE: number = config.TILE_SIZE;
    private stats: IStatsObject = {
        [EntityStats.STRENGTH]: document.getElementById('info-stat-strength'),
        [EntityStats.DEXTERITY]: document.getElementById('info-stat-dexterity'),
        [EntityStats.INTELLIGENCE]: document.getElementById('info-stat-intelligence'),
        [EntityStats.TOUGHNESS]: document.getElementById('info-stat-toughness'),
        [EntityStats.PERCEPTION]: document.getElementById('info-stat-perception'),
        [EntityStats.SPEED]: document.getElementById('info-stat-speed'),
        [EntityStats.HIT_POINTS]: document.getElementById('info-stat-hitpoints'),
        [EntityStats.MAX_HIT_POINTS]: document.getElementById('info-stat-maxhitpoints'),
    };

    constructor(width: number, height: number, tiledata: HTMLImageElement) {
        this.screenElement.style.width = width + 'px';
        this.screenElement.style.height = height + 'px';
        this.tileset = tiledata;
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
    public setStrength(value: string|number): void {
        this.stats[EntityStats.STRENGTH].innerText = value as string;
    }
    public setDexterity(value: string|number): void {
        this.stats[EntityStats.DEXTERITY].innerText = value as string;
    }
    public setIntelligence(value: string|number): void {
        this.stats[EntityStats.INTELLIGENCE].innerText = value as string;
    }
    public setToughness(value: string|number): void {
        this.stats[EntityStats.TOUGHNESS].innerText = value as string;
    }
    public setPerception(value: string|number): void {
        this.stats[EntityStats.PERCEPTION].innerText = value as string;
    }
    public setSpeed(value: string|number): void {
        this.stats[EntityStats.SPEED].innerText = value as string;
    }
    public setHitpoints(value: string|number): void {
        this.stats[EntityStats.HIT_POINTS].innerText = value as string;
    }
    public setMaxHitpoints(value: string|number): void {
        this.stats[EntityStats.MAX_HIT_POINTS].innerText = value as string;
    }
    public setPlayerStats(stats: IEntityStatsObject): void {
        this.setStrength(stats[EntityStats.STRENGTH]);
        this.setDexterity(stats[EntityStats.DEXTERITY]);
        this.setIntelligence(stats[EntityStats.INTELLIGENCE]);
        this.setToughness(stats[EntityStats.TOUGHNESS]);
        this.setPerception(stats[EntityStats.PERCEPTION]);
        this.setSpeed(stats[EntityStats.SPEED]);
        this.setHitpoints(stats[EntityStats.HIT_POINTS]);
        this.setMaxHitpoints(stats[EntityStats.MAX_HIT_POINTS]);
    }
    public displayCellDescriptionInView(cell: Cell): void {
        let templateVariables: ITemplateVariables;
        let template: ITemplate;
        let canvas: HTMLCanvasElement;

        if (cell.entity) {
            templateVariables = this.prepareEntityDisplayVariables(cell.entity);
            template = getEntityInfoTemplate(templateVariables);

            this.examineDisplay.innerHTML = template.wrapper;

            canvas = this.examineDisplay.querySelector('#image');
            this.drawCellDisplayOnCanvas(canvas, cell.entity.display);
        } else if (cell.inventory.size) {
            // placeholder
        } else {
            templateVariables = this.prepareCellDisplayVariables(cell);
            template = getEntityInfoTemplate(templateVariables);

            this.examineDisplay.innerHTML = template.cell;

            canvas = this.examineDisplay.querySelector('#image');
            this.drawCellDisplayOnCanvas(canvas, cell.display);
        }
    }
    public removeDisplayCellDescription(): void {
        while (this.examineDisplay.hasChildNodes()) {
            this.examineDisplay.removeChild(this.examineDisplay.firstChild);
        }

        if (this.currentImageAnimationIntervalId) {
            clearInterval(this.currentImageAnimationIntervalId);
        }
    }
    private drawCellDisplayOnCanvas(canvas: HTMLCanvasElement, cellDisplay: string): void {
        const tileData: {x: number, y: number, frames: number} = tileset[cellDisplay];
        const {
            x,
            y,
            frames,
        } = tileData;
        const currentFrameObj: {frame: number} = {frame: 1};

        canvas.getContext('2d').drawImage(
            this.tileset,
            x * this.TILE_SIZE,
            y * this.TILE_SIZE,
            32,
            32,
            0,
            0,
            32,
            32,
        );
        if (frames > 1) {
            this.currentImageAnimationIntervalId = setInterval(
                this.drawAnimatedCellDisplay.bind(this, x, y, currentFrameObj, canvas),
                250,
            );
        }
    }
    private drawAnimatedCellDisplay(x: number, y: number, frameObj: {frame: number}, canvas: HTMLCanvasElement): void {
        canvas.getContext('2d').drawImage(
            this.tileset,
            x * this.TILE_SIZE + frameObj.frame * this.TILE_SIZE,
            y * this.TILE_SIZE,
            32,
            32,
            0,
            0,
            32,
            32,
        );

        frameObj.frame = frameObj.frame < 3 ? frameObj.frame + 1 : 0;
    }
    private prepareEntityDisplayVariables(entity: EntityModel): ITemplateVariables {
        const {
            description,
            hitPoints,
            maxHitPoints,
            naturalWeapon,
        } = entity;

        return {
            description,
            hitPoints,
            maxHitPoints,
            weaponType: naturalWeapon.naturalType,
            weaponDamage: naturalWeapon.damage.getSerializedData(),
            weaponDmgType: naturalWeapon.type,
        };
    }
    private prepareCellDisplayVariables(cell: Cell): ITemplateVariables {
        return {
            description: cell.description,
        };
    }
}
