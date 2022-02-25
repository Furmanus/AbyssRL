import { Cell } from '../dungeon/models/cells/cell_model';
import { Path } from 'rot-js';
import { LevelModel } from '../dungeon/models/level_model';
import { ICoordinates } from '../interfaces/common';

export function calculatePathToCell(
  start: Cell,
  target: Cell,
  level: LevelModel,
): ICoordinates[] {
  const path: ICoordinates[] = [];
  const { x: targetX, y: targetY } = target;
  const { x: startX, y: startY } = start;

  const astar = new Path.AStar(
    targetX,
    targetY,
    (examinedX: number, examinedY: number) => {
      const examinedCell: Cell = level.getCell(examinedX, examinedY);
      const isTarget: boolean = examinedCell === target;
      const isStart: boolean = examinedCell === start;

      if (isStart) {
        return true;
      } else if (isTarget) {
        return !examinedCell.blockMovement;
      } else {
        return !examinedCell.blockMovement && !examinedCell.entity;
      }
    },
  );

  astar.compute(startX, startY, (x: number, y: number) => {
    path.push({ x, y });
  });

  return path;
}
