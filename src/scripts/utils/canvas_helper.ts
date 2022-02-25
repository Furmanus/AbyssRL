/**
 * Draws not animated sprite on given canvas element.
 *
 * @param canvas    Canvas on which sprite should be drawn. Canvas should have width and height of 32 pixels
 * @param sprite    Name of sprite to draw, should be key in tileset object
 */
import { tileset } from '../global/tiledata';
import { tilesetObject } from '../global/tileset';
import { config } from '../global/config';

export function drawSpriteOnCanvas(
  canvas: HTMLCanvasElement,
  sprite: string,
): void {
  const tileData: { x: number; y: number; frames: number } = tileset[sprite];
  const { x, y } = tileData;

  canvas
    .getContext('2d')
    .drawImage(
      tilesetObject.tileset,
      x * config.TILE_SIZE,
      y * config.TILE_SIZE,
      32,
      32,
      0,
      0,
      32,
      32,
    );
}
