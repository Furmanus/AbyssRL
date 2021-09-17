import { EntityStats } from '../constants/monsters';
import { EntityModel, IEntityStatsObject } from '../model/entity/entity_model';
import { Cell } from '../model/dungeon/cells/cell_model';
import { ITemplate, ITemplateVariables } from '../interfaces/common';
import { getEntityInfoTemplate } from '../../templates/info_templates/examine_info';
import { config } from '../global/config';
import { tileset } from '../global/tiledata';
import Timeout = NodeJS.Timeout;
import { ItemModel } from '../model/items/item_model';
import { WeaponModel } from '../model/items/weapons/weapon_model';
import { ArmourModel } from '../model/items/armours/armour_model';

interface IStatsObject {
  [EntityStats.Strength]: HTMLSpanElement;
  [EntityStats.Dexterity]: HTMLSpanElement;
  [EntityStats.Intelligence]: HTMLSpanElement;
  [EntityStats.Toughness]: HTMLSpanElement;
  [EntityStats.Perception]: HTMLSpanElement;
  [EntityStats.Speed]: HTMLSpanElement;
  [EntityStats.HitPoints]: HTMLSpanElement;
  [EntityStats.MaxHitPoints]: HTMLSpanElement;
}

/**
 * Class representing information section on game view. Section is split into two parts: first part is player
 * information (hit points, stats, name), second part is about game enviroment(visible monsters, objects).
 */
export class InfoView {
  private screenElement: HTMLCanvasElement = document.getElementById(
    'info',
  ) as HTMLCanvasElement;

  private playerName: HTMLParagraphElement = document.querySelector(
    '[data-element="player_name.element"]',
  );

  private levelInfo: HTMLParagraphElement = document.querySelector(
    '[data-element="level_info.element"]',
  );

  private examineDisplay: HTMLElement = document.getElementById('object_info');
  private currentImageAnimationIntervalId: Timeout;
  private tileset: CanvasImageSource;
  private TILE_SIZE: number = config.TILE_SIZE;
  private stats: IStatsObject = {
    [EntityStats.Strength]: document.getElementById('info-stat-strength'),
    [EntityStats.Dexterity]: document.getElementById('info-stat-dexterity'),
    [EntityStats.Intelligence]: document.getElementById(
      'info-stat-intelligence',
    ),
    [EntityStats.Toughness]: document.getElementById('info-stat-toughness'),
    [EntityStats.Perception]: document.getElementById('info-stat-perception'),
    [EntityStats.Speed]: document.getElementById('info-stat-speed'),
    [EntityStats.HitPoints]: document.getElementById('info-stat-hitpoints'),
    [EntityStats.MaxHitPoints]: document.getElementById(
      'info-stat-maxhitpoints',
    ),
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

  public setStrength(value: string | number): void {
    this.stats[EntityStats.Strength].innerText = value as string;
  }

  public setDexterity(value: string | number): void {
    this.stats[EntityStats.Dexterity].innerText = value as string;
  }

  public setIntelligence(value: string | number): void {
    this.stats[EntityStats.Intelligence].innerText = value as string;
  }

  public setToughness(value: string | number): void {
    this.stats[EntityStats.Toughness].innerText = value as string;
  }

  public setPerception(value: string | number): void {
    this.stats[EntityStats.Perception].innerText = value as string;
  }

  public setSpeed(value: string | number): void {
    this.stats[EntityStats.Speed].innerText = value as string;
  }

  public setHitpoints(value: string | number): void {
    this.stats[EntityStats.HitPoints].innerText = value as string;
  }

  public setMaxHitpoints(value: string | number): void {
    this.stats[EntityStats.MaxHitPoints].innerText = value as string;
  }

  public setPlayerStats(stats: IEntityStatsObject): void {
    this.setStrength(stats[EntityStats.Strength]);
    this.setDexterity(stats[EntityStats.Dexterity]);
    this.setIntelligence(stats[EntityStats.Intelligence]);
    this.setToughness(stats[EntityStats.Toughness]);
    this.setPerception(stats[EntityStats.Perception]);
    this.setSpeed(stats[EntityStats.Speed]);
    this.setHitpoints(stats[EntityStats.HitPoints]);
    this.setMaxHitpoints(stats[EntityStats.MaxHitPoints]);
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
      const itemModel: ItemModel = cell.inventory.get(0);
      templateVariables = this.prepareItemDisplayVariables(itemModel);
      template = getEntityInfoTemplate(templateVariables, itemModel.itemType);

      this.examineDisplay.innerHTML = template.item;

      canvas = this.examineDisplay.querySelector('#image');
      this.drawCellDisplayOnCanvas(canvas, itemModel.display);
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

  private drawCellDisplayOnCanvas(
    canvas: HTMLCanvasElement,
    cellDisplay: string,
  ): void {
    const tileData: { x: number; y: number; frames: number } =
      tileset[cellDisplay];
    const { x, y, frames } = tileData;
    const currentFrameObj: { frame: number } = { frame: 1 };

    canvas
      .getContext('2d')
      .drawImage(
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

  private drawAnimatedCellDisplay(
    x: number,
    y: number,
    frameObj: { frame: number },
    canvas: HTMLCanvasElement,
  ): void {
    canvas
      .getContext('2d')
      .drawImage(
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

  private prepareEntityDisplayVariables(
    entity: EntityModel,
  ): ITemplateVariables {
    const { description, hitPoints, maxHitPoints, naturalWeapon } = entity;

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

  private prepareItemDisplayVariables(item: ItemModel): ITemplateVariables {
    const baseVariables: ITemplateVariables = {
      description: item.description,
    };

    if (item instanceof WeaponModel) {
      return {
        ...baseVariables,
        damage: `${item.damage.getSerializedData()} (${item.type})`,
        toHit: `${item.toHit.getSerializedData()}`,
      };
    } else if (item instanceof ArmourModel) {
      return {
        ...baseVariables,
        dodgeModifier: `${item.dodgeModifier}`,
        protectionModifier: `${item.protectionModifier}`,
      };
    }
  }
}
